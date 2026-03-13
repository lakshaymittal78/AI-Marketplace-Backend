import httpx
import os

async def handle_code(topic: str, code_plan: str = "") -> str:
    prompt = topic
    if code_plan:
        prompt = f"Problem: {topic}\n\nFollow this plan:\n{code_plan}\n\nNow write the code."
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 1024,
                "messages": [
                    {"role": "system", "content": "You are an expert programmer. Help with code"},
                    {"role": "user", "content": prompt}
                ]
            }
        )
    return response.json()["choices"][0]["message"]["content"]