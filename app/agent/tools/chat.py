import httpx
import os

async def handle_chat(message: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 102,
                "messages": [{"role": "user", "content": message}]
            }
        )
    return response.json()["choices"][0]["message"]["content"]

async def handle_chat_with_history(messages: list[dict]) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 102,
                "messages": messages
            }
        )
    print(response.json()) 
    return response.json()["choices"][0]["message"]["content"]