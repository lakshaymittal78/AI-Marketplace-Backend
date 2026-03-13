async def handle_image(prompt: str) -> str:
    clean_prompt = prompt.replace(" ", "%20")
    image_url = f"https://image.pollinations.ai/prompt/{clean_prompt}"
    return f"Here is your image: {image_url}"