from ddgs import DDGS
import asyncio

async def search_web(query: str) -> str:
    with DDGS() as ddgs:
        results = list(ddgs.text(query, max_results=5))
    
    formatted = []
    for r in results:
        formatted.append(
            f"Title: {r['title']}\n"
            f"URL: {r['href']}\n" 
            f"Summary: {r['body']}"
        )
    
    return "\n\n".join(formatted)

