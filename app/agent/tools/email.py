import httpx
import os
from email.mime.text import MIMEText
import smtplib
import json
from typing import Dict


def _parse_email_locally(message: str) -> Dict[str, str] | None:
    """
    Fast, deterministic parser for messages that already include
    'Subject:' and 'To:' lines.
    """
    lines = [line.strip() for line in message.splitlines() if line.strip()]

    subject = None
    to_address = None
    body_lines: list[str] = []
    in_body = False

    for line in lines:
        if line.lower().startswith("subject:"):
            subject = line.split(":", 1)[1].strip()
            continue
        if line.lower().startswith("to:"):
            to_address = line.split(":", 1)[1].strip()
            continue
        # Everything after subject / to blocks is treated as body
        if subject or to_address:
            in_body = True
        if in_body:
            body_lines.append(line)

    if not subject or not to_address or not body_lines:
        return None

    body = "\n".join(body_lines).strip()
    return {"to": to_address, "subject": subject, "body": body}


async def handle_email(message: str) -> str:
    # 1) Try to parse structured emails locally to avoid model truncation
    email_details = _parse_email_locally(message)

    # 2) Fallback to Groq extraction only when needed (unstructured input)
    if email_details is None:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url="https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "max_tokens": 512,
                    "response_format": {"type": "json_object"},
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You extract email details from a natural language description.\n"
                                "Return ONLY valid JSON in this exact shape, with no truncation:\n"
                                '{\"to\": \"email@example.com\",'
                                ' \"subject\": \"subject here\",'
                                ' \"body\": \"full email body here\"}.\n'
                                "The body must be complete sentences, not cut off mid‑sentence."
                            ),
                        },
                        {"role": "user", "content": message},
                    ],
                },
            )
        content = response.json()["choices"][0]["message"]["content"]
        email_details = json.loads(content)

    # 3) Send email via SMTP
    from_address = os.getenv("EMAIL_ADDRESS")
    password = os.getenv("EMAIL_PASSWORD")

    if not from_address or not password:
        return "Email configuration is missing on the server (EMAIL_ADDRESS / EMAIL_PASSWORD)."

    msg = MIMEText(email_details["body"])
    msg["Subject"] = email_details["subject"]
    msg["From"] = from_address
    msg["To"] = email_details["to"]

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(from_address, password)
            server.send_message(msg)
    except smtplib.SMTPAuthenticationError:
        return (
            "Failed to send email: authentication with the SMTP server was rejected. "
            "If you're using Gmail, make sure you use an app password and that SMTP access is allowed."
        )
    except Exception as exc:  # pragma: no cover – defensive
        return f"Failed to send email: {type(exc).__name__}: {exc}"

    # Echo back exactly what was sent so the user can verify.
    return (
        "Email sent successfully.\n\n"
        f"To: {email_details['to']}\n"
        f"Subject: {email_details['subject']}\n\n"
        f"{email_details['body']}"
    )