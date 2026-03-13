import httpx
import os


async def decide_tool(message: str) -> str:
    # Fast path: if the user already provided an email-style template,
    # always route to the EMAIL tool without asking the model.
    lower = message.lower()
    if "subject:" in lower and "to:" in lower:
        return "EMAIL"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 10,
                "messages": [
                    {
                        "role": "user",
                        "content": f"""
                        User said: "{message}"
                        Which tool is needed? Reply with ONLY one word:
                        - CHAT (normal question)
                        - CODE (code help, bug fix, programming)
                        - IMAGE (generate an image)
                        - PPT (create a presentation)
                        - SEARCH (search the web for information)
                        - EMAIL (send an email)
                        Reply with ONLY one word, nothing else. 
                        """,
                    }
                ],
            },
        )
    result = response.json()["choices"][0]["message"]["content"].strip().upper()

    if "IMAGE" in result:
        return "IMAGE"
    elif "CODE" in result:
        return "CODE"
    elif "PPT" in result:
        return "PPT"
    elif "SEARCH" in result:
        return "SEARCH"
    elif "EMAIL" in result:
        return "EMAIL"
    else:
        return "CHAT"