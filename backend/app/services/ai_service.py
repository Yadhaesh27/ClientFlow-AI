import json
import httpx
from typing import Dict, Any, List
from app.core.config import settings

async def call_gemini_api(prompt: str) -> str:
    """Helper to call Google Gemini API if key is present."""
    if not settings.GEMINI_API_KEY:
        return ""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text.strip()
    except Exception as e:
        print(f"[AI Service] Gemini API call error: {e}")
    
    return ""

async def generate_project_summary(project_data: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""
You are an expert AI project manager. Analyze the following project data and return ONLY a valid JSON object with:
"summary": a concise 2-sentence executive summary
"completed_work": list of 2-3 completed items
"pending_work": list of 2-3 pending items
"risks": list of key risks or "None identified"
"next_action": single highest priority next action

Project Data:
{json.dumps(project_data, indent=2)}
"""
    raw_response = await call_gemini_api(prompt)
    if raw_response:
        try:
            # Clean markdown codeblocks if present
            clean_str = raw_response.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_str)
        except Exception:
            pass

    # Heuristic fallback if no API key or parsing error
    tasks = project_data.get("tasks", [])
    completed = [t["title"] for t in tasks if t.get("status") == "DONE"]
    pending = [t["title"] for t in tasks if t.get("status") != "DONE"]
    approvals = project_data.get("approvals", [])
    pending_app = [a["title"] for a in approvals if a.get("status") == "PENDING"]

    summary_text = f"Project '{project_data.get('name')}' is currently {project_data.get('status', 'ACTIVE')} with a health score of {project_data.get('health_score', 100)}/100. Overall progress is at {project_data.get('progress', 0)}%."

    return {
        "summary": summary_text,
        "completed_work": completed[:3] if completed else ["Initial project setup & scope alignment"],
        "pending_work": pending[:3] if pending else ["Final deliverable review and sign-off"],
        "risks": ["1 overdue task pending team update"] if project_data.get("health_score", 100) < 80 else ["No critical risks identified."],
        "next_action": f"Review pending approval '{pending_app[0]}'" if pending_app else "Proceed with remaining Kanban tasks."
    }

async def extract_tasks_from_feedback(text: str) -> List[Dict[str, Any]]:
    prompt = f"""
Extract actionable tasks from this client feedback comment:
"{text}"

Return ONLY a JSON array of task objects with fields:
- "title": concise task title
- "description": brief explanation of work needed
- "priority": "LOW", "MEDIUM", "HIGH", or "URGENT"
- "suggested_due_date": optional date string or null
- "source_text": text snippet from feedback
"""
    raw_response = await call_gemini_api(prompt)
    if raw_response:
        try:
            clean_str = raw_response.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_str)
        except Exception:
            pass

    # Heuristic fallback
    extracted = []
    lines = [line.strip() for line in text.split(".") if line.strip()]
    for idx, line in enumerate(lines):
        if any(w in line.lower() for w in ["change", "fix", "update", "add", "remove", "need", "please", "make", "logo", "color", "font", "button"]):
            priority = "HIGH" if any(w in line.lower() for w in ["urgent", "asap", "immediately", "broken", "must"]) else "MEDIUM"
            extracted.append({
                "title": f"Action Item: {line[:45]}...",
                "description": f"Extracted from client feedback: '{line}'",
                "priority": priority,
                "suggested_due_date": None,
                "source_text": line
            })
    
    if not extracted and text:
        extracted.append({
            "title": "Address Client Feedback",
            "description": f"Client feedback note: {text}",
            "priority": "MEDIUM",
            "suggested_due_date": None,
            "source_text": text
        })
        
    return extracted

async def analyze_project_risk(project_data: Dict[str, Any], health_info: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "health_score": health_info["score"],
        "status": health_info["status"],
        "breakdown": health_info["breakdown"],
        "reasons": health_info["reasons"],
        "recommended_actions": health_info["recommended_actions"]
    }

async def chat_with_project_context(project_context: Dict[str, Any], user_message: str) -> str:
    prompt = f"""
You are ClientFlow AI assistant. Answer the user's question using ONLY the provided project context data.
If the information is not present in the context, state clearly that it is unavailable in the database.

Project Context:
{json.dumps(project_context, indent=2)}

User Question: {user_message}
"""
    raw = await call_gemini_api(prompt)
    if raw:
        return raw

    # Heuristic context fallback
    msg_lower = user_message.lower()
    proj_name = project_context.get("name", "the project")
    tasks = project_context.get("tasks", [])
    approvals = project_context.get("approvals", [])

    if "health" in msg_lower or "score" in msg_lower:
        return f"Project '{proj_name}' currently has a health score of {project_context.get('health_score')}/100 ({project_context.get('status')})."
    elif "status" in msg_lower or "progress" in msg_lower:
        return f"Project '{proj_name}' is in '{project_context.get('status')}' status with an overall progress of {project_context.get('progress')}%. Total tasks: {len(tasks)}."
    elif "task" in msg_lower or "pending" in msg_lower:
        pending_titles = [t["title"] for t in tasks if t.get("status") != "DONE"]
        return f"There are {len(pending_titles)} pending task(s): {', '.join(pending_titles[:4])}."
    elif "approval" in msg_lower or "client" in msg_lower:
        return f"There are {len(approvals)} approval item(s) on record. Pending client action count: {sum(1 for a in approvals if a.get('status') == 'PENDING')}."
    else:
        return f"Based on live project data for '{proj_name}': Progress is {project_context.get('progress')}%, Health Score is {project_context.get('health_score')}/100, and there are {len(tasks)} tasks registered."
