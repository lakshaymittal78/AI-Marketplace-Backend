from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
from app.agent.router import decide_tool
from pydantic import BaseModel
from app.agent.tools.chat import handle_chat
from app.agent.tools.code import handle_code
from app.agent.tools.image import handle_image
from app.agent.graph import build_graph

router = APIRouter(prefix="/chat", tags=["chat"])
agent = build_graph()

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []
    
@router.post("/")
async def chat(request: ChatRequest,current_user = Depends(get_current_user)):
    result = await agent.ainvoke({"message": request.message,"history": request.history})
    return {"response": result["response"], "history": result["history"]}
