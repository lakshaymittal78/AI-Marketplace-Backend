from typing import TypedDict
from app.agent.router import decide_tool
from app.agent.tools.chat import handle_chat, handle_chat_with_history
from app.agent.tools.code import handle_code
from app.agent.tools.image import handle_image
from app.agent.tools.search import search_web
from app.agent.tools.ppt import handle_ppt
from langgraph.graph import StateGraph, END
from app.agent.tools.email import handle_email
import httpx
import os
class AgentState(TypedDict):
    message: str
    tool: str
    response: str
    search_result: str
    history: list[dict]
    ppt_path: str
    code_plan: str
    code_output:str
    reflection: str 
    retry_count: int
    email_details: dict
async def decide_node(state: AgentState):
    tool = await decide_tool(state["message"])
    print(f"Decided tool: {tool}")
    return {"tool": tool}

async def ppt_node(state: AgentState):
    response = await handle_ppt(state["message"])
    return {"response": response}

async def chat_node(state: AgentState):
    search_results = state.get("search_result", "")
    history = state.get("history", [])
    messages = history + [{"role": "user", "content": state["message"]}]
    if search_results:
        messages[-1]["content"] += f"\n\nSearch Results:\n{search_results}"
    response = await handle_chat_with_history(messages)
    new_history = history + [{"role": "user", "content": state["message"]}, {"role": "assistant", "content": response}]
    return {"response": response, "history": new_history}

async def search_node(state: AgentState):
    result = await search_web(state["message"])
    print(f"Search results: {result[:200]}")
    return {"search_result": result}

async def code_node(state: AgentState):
    response = await handle_code(state["message"])
    return {"response": response}

async def code_execute_node(state: AgentState):
    response = await handle_code(state["message"], state["code_plan"])
    retry_count = state.get("retry_count", 0) + 1
    return {"code_output": response, "retry_count": retry_count}

async def image_node(state: AgentState):
    response = await handle_image(state["message"])
    return {"response": response}

async def code_plan_node(state: AgentState):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url = "https://api.groq.com/openai/v1/chat/completions",
            headers = {"Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}", "Content-Type": "application/json"},
            json = {
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content":  f"Analyze this coding problem and create a step by step plan: {state['message']}. Return only the plan, no code yet."},
                    
                ]
            }
        )
        plan = response.json()["choices"][0]["message"]["content"]
    return {"code_plan": plan}
async def code_execute_node(state: AgentState):
    response = await handle_code(state["message"], state["code_plan"])
    retry_count = state.get("retry_count", 0) + 1
    return {"code_output": response, "retry_count": retry_count}

async def reflection_node(state: AgentState):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url = "https://api.groq.com/openai/v1/chat/completions",
            headers = {"Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}", "Content-Type": "application/json"},
            json = {
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content":  f"Reflect on this code output and suggest improvements or next steps: {state['code_output']}. Return only your reflection."},
                    
                ]
            }
        )
        reflection = response.json()["choices"][0]["message"]["content"]
    return {"reflection": reflection}

async def code_finalize_node(state: AgentState):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url = "https://api.groq.com/openai/v1/chat/completions",
            headers = {"Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}", "Content-Type": "application/json"},
            json = {
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content":  f"Given this code plan: {state['code_plan']} and this reflection: {state['reflection']}, write the final code solution. "},
                    
                ]
            }
        )
        final_code = response.json()["choices"][0]["message"]["content"]
    return {"response": final_code}
async def email_node(state: AgentState):
    response = await handle_email(state["message"])
    return {"response": response}
# ✅ build_graph AFTER all nodes are defined
def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("decide", decide_node)
    graph.add_node("chat", chat_node)
    graph.add_node("code", code_node)
    graph.add_node("image", image_node)
    graph.add_node("search", search_node)
    graph.add_node("ppt", ppt_node)
    graph.add_node("code_plan", code_plan_node)
    graph.add_node("code_execute",code_execute_node)
    graph.add_node("code_reflect", reflection_node)
    graph.add_node("code_finalize", code_finalize_node) 
    graph.add_node("email", email_node)
    graph.set_entry_point("decide")
    graph.add_conditional_edges(
        "decide",
        lambda state: state["tool"],
        {
            "CHAT": "chat",
            "CODE": "code_plan",
            "IMAGE": "image",
            "SEARCH": "search",
            "PPT": "ppt",
            "EMAIL": "email"
        }
    )
    graph.add_edge("chat", END)
    graph.add_edge("code_plan", "code_execute")
    graph.add_edge("code_execute", "code_reflect")
    graph.add_conditional_edges(
    "code_reflect",
    lambda state: "finalize" if state["retry_count"] >= 2 or "GOOD" in state["reflection"] else "retry",
    {
        "finalize": "code_finalize",
        "retry": "code_execute"
    }
)
    graph.add_edge("code_finalize", END)
    graph.add_edge("image", END)
    graph.add_edge("search", "chat")
    graph.add_edge("ppt", END)
    return graph.compile()