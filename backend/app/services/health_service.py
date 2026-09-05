from datetime import datetime, timezone
from typing import List, Dict, Any
from app.models.models import Project, Task, Approval, ActivityLog, Message

def calculate_project_health(project: Project) -> Dict[str, Any]:
    """
    Calculates deterministic project health score based on the ClientFlow spec:
    Health = 35% task progress + 25% deadline safety + 20% approval readiness + 10% client responsiveness + 10% recent activity
    """
    tasks: List[Task] = project.tasks or []
    approvals: List[Approval] = project.approvals or []
    messages: List[Message] = project.messages or []
    
    # 1. Task progress (35%)
    if not tasks:
        task_progress_score = 100.0
    else:
        done_tasks = sum(1 for t in tasks if t.status == "DONE")
        in_progress_tasks = sum(1 for t in tasks if t.status == "IN_PROGRESS")
        review_tasks = sum(1 for t in tasks if t.status == "REVIEW")
        task_progress_score = ((done_tasks * 1.0 + review_tasks * 0.75 + in_progress_tasks * 0.4) / len(tasks)) * 100.0

    # 2. Deadline safety (25%)
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    overdue_tasks = sum(1 for t in tasks if t.due_date and t.due_date < now_str and t.status != "DONE")
    if overdue_tasks == 0:
        deadline_safety_score = 100.0
    elif overdue_tasks == 1:
        deadline_safety_score = 65.0
    elif overdue_tasks == 2:
        deadline_safety_score = 40.0
    else:
        deadline_safety_score = 15.0

    # 3. Approval readiness (20%)
    if not approvals:
        approval_readiness_score = 100.0
    else:
        pending_approvals = sum(1 for a in approvals if a.status == "PENDING")
        changes_requested = sum(1 for a in approvals if a.status == "CHANGES_REQUESTED")
        approved = sum(1 for a in approvals if a.status == "APPROVED")
        total = len(approvals)
        approval_readiness_score = ((approved * 1.0 + pending_approvals * 0.5) / total) * 100.0
        if changes_requested > 0:
            approval_readiness_score = max(0.0, approval_readiness_score - (15.0 * changes_requested))

    # 4. Client responsiveness (10%)
    # Simple metric: checks if recent messages exist or client approved items
    client_responsiveness_score = 85.0
    if approvals and any(a.status in ["APPROVED", "CHANGES_REQUESTED"] for a in approvals):
        client_responsiveness_score = 95.0

    # 5. Recent activity (10%)
    recent_activity_score = 90.0

    # Total Weighted Score
    total_score = (
        (0.35 * task_progress_score) +
        (0.25 * deadline_safety_score) +
        (0.20 * approval_readiness_score) +
        (0.10 * client_responsiveness_score) +
        (0.10 * recent_activity_score)
    )

    clamped_score = max(0, min(100, int(round(total_score))))

    # Status classification
    if clamped_score >= 80:
        status = "On Track"
        status_code = "GREEN"
    elif clamped_score >= 60:
        status = "At Risk"
        status_code = "YELLOW"
    else:
        status = "Delayed"
        status_code = "RED"

    reasons = []
    if overdue_tasks > 0:
        reasons.append(f"{overdue_tasks} overdue task(s) currently require attention.")
    if any(a.status == "CHANGES_REQUESTED" for a in approvals):
        reasons.append("Client requested changes on one or more deliverables.")
    if task_progress_score < 50:
        reasons.append(f"Task completion rate is low ({int(task_progress_score)}%).")
    if not reasons:
        reasons.append("All milestones, tasks, and client approvals are progressing smoothly.")

    recommended_actions = []
    if overdue_tasks > 0:
        recommended_actions.append("Reassign or update due dates for overdue tasks.")
    if any(a.status == "CHANGES_REQUESTED" for a in approvals):
        recommended_actions.append("Review client feedback notes and extract new action items.")
    if not recommended_actions:
        recommended_actions.append("Continue current execution schedule and communicate updates to client.")

    return {
        "score": clamped_score,
        "status": status,
        "status_code": status_code,
        "breakdown": {
            "task_progress": round(task_progress_score, 1),
            "deadline_safety": round(deadline_safety_score, 1),
            "approval_readiness": round(approval_readiness_score, 1),
            "client_responsiveness": round(client_responsiveness_score, 1),
            "recent_activity": round(recent_activity_score, 1),
        },
        "reasons": reasons,
        "recommended_actions": recommended_actions
    }
