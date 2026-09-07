import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models import (
    Organization, User, Project, ProjectMember, Milestone, Task,
    File, FileVersion, Approval, Message, Comment, Notification, ActivityLog
)

def seed_database():
    # Drop all tables and recreate schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()

    print("Seeding 5 structured sets of Projects, Clients, Developers, Tasks, Files & Approvals...")

    # 1. Organization
    org_id = str(uuid.uuid4())
    org = Organization(
        id=org_id,
        name="ClientFlow AI Workspace",
        slug="clientflow-workspace"
    )
    db.add(org)

    hashed_pw = get_password_hash("Demo@123")

    # 2. 5 Clients
    client1 = User(
        id="usr_client_1", organization_id=org_id, name="David Vance (Northstar)",
        email="client@clientflow.demo", password_hash=hashed_pw, role="CLIENT",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    )
    client2 = User(
        id="usr_client_2", organization_id=org_id, name="Sarah Lin (Vertex)",
        email="sarah@vertex.demo", password_hash=hashed_pw, role="CLIENT",
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    )
    client3 = User(
        id="usr_client_3", organization_id=org_id, name="Robert Sterling (Quantum)",
        email="robert@quantum.demo", password_hash=hashed_pw, role="CLIENT",
        avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    )
    client4 = User(
        id="usr_client_4", organization_id=org_id, name="Emma Watson (Horizon)",
        email="emma@horizon.demo", password_hash=hashed_pw, role="CLIENT",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    )
    client5 = User(
        id="usr_client_5", organization_id=org_id, name="Dr. Michael Chang (Aura)",
        email="michael@aura.demo", password_hash=hashed_pw, role="CLIENT",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    )

    # 3. 5 Developers & Managers (Core Agency Team)
    admin = User(
        id="usr_admin", organization_id=org_id, name="Sarah Jenkins (Admin)",
        email="admin@clientflow.demo", password_hash=hashed_pw, role="ADMIN",
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    )
    manager = User(
        id="usr_pm", organization_id=org_id, name="Alex Rivera (PM)",
        email="manager@clientflow.demo", password_hash=hashed_pw, role="PROJECT_MANAGER",
        avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    )
    dev1 = User(
        id="usr_dev_1", organization_id=org_id, name="Aarav Sharma (Lead Dev)",
        email="developer@clientflow.demo", password_hash=hashed_pw, role="TEAM_MEMBER",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    )
    dev2 = User(
        id="usr_dev_2", organization_id=org_id, name="Priya Patel (Senior Frontend)",
        email="priya@clientflow.demo", password_hash=hashed_pw, role="TEAM_MEMBER",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    )
    dev3 = User(
        id="usr_dev_3", organization_id=org_id, name="Marcus Vance (Backend Lead)",
        email="marcus@clientflow.demo", password_hash=hashed_pw, role="TEAM_MEMBER",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    )

    db.add_all([admin, manager, dev1, dev2, dev3, client1, client2, client3, client4, client5])
    db.commit()

    # 4. 5 Projects
    projects_data = [
        {
            "id": "proj_1", "name": "NextGen AI E-Commerce Platform", "key": "ECOMM",
            "client_id": client1.id, "progress": 85, "health": 92, "budget": 120000.0,
            "deadline": "2026-11-30", "desc": "High-throughput e-commerce platform with Gemini AI dynamic product recommendations and streaming search."
        },
        {
            "id": "proj_2", "name": "Mobile Banking & Wealth App", "key": "BANK",
            "client_id": client3.id, "progress": 60, "health": 88, "budget": 185000.0,
            "deadline": "2026-12-15", "desc": "Biometric mobile banking portal featuring encrypted microservice API integration."
        },
        {
            "id": "proj_3", "name": "Cloud Media Streaming Portal", "key": "STREAM",
            "client_id": client4.id, "progress": 40, "health": 75, "budget": 95000.0,
            "deadline": "2026-10-20", "desc": "Low-latency streaming video delivery network with real-time video transcoding."
        },
        {
            "id": "proj_4", "name": "Telehealth Patient Care Dashboard", "key": "HEALTH",
            "client_id": client5.id, "progress": 95, "health": 96, "budget": 140000.0,
            "deadline": "2026-09-30", "desc": "HIPAA-compliant doctor consultation dashboard and patient record synchronization."
        },
        {
            "id": "proj_5", "name": "Brand Design & Interactive UI Suite", "key": "BRAND",
            "client_id": client2.id, "progress": 25, "health": 82, "budget": 65000.0,
            "deadline": "2026-12-01", "desc": "Complete brand guidelines, dark mode design tokens, and vector icon suite."
        },
    ]

    projects_list = []
    for p_data in projects_data:
        p = Project(
            id=p_data["id"],
            organization_id=org_id,
            client_user_id=p_data["client_id"],
            name=p_data["name"],
            key_prefix=p_data["key"],
            description=p_data["desc"],
            status="ACTIVE",
            progress=p_data["progress"],
            health_score=p_data["health"],
            budget=p_data["budget"],
            start_date="2026-08-01",
            deadline=p_data["deadline"]
        )
        projects_list.append(p)
        db.add(p)

    db.commit()

    # 5. 5 Files (1 per project)
    files_data = [
        {"id": "file_1", "p_id": "proj_1", "name": "Ecommerce_Checkout_v2.png", "folder": "Deliverables", "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", "ver": 2, "status": "PENDING"},
        {"id": "file_2", "p_id": "proj_2", "name": "Banking_Security_Spec.pdf", "folder": "Docs", "url": "#", "ver": 1, "status": "APPROVED"},
        {"id": "file_3", "p_id": "proj_3", "name": "Video_Player_v1.mp4", "folder": "Design", "url": "#", "ver": 1, "status": "CHANGES_REQUESTED"},
        {"id": "file_4", "p_id": "proj_4", "name": "Patient_Portal_DesignSystem.fig", "folder": "Deliverables", "url": "#", "ver": 3, "status": "APPROVED"},
        {"id": "file_5", "p_id": "proj_5", "name": "Brand_Guidelines_Package.zip", "folder": "General", "url": "#", "ver": 1, "status": "PENDING"},
    ]

    for f in files_data:
        db.add(File(
            id=f["id"], project_id=f["p_id"], uploaded_by=dev1.id, folder=f["folder"],
            filename=f["name"], storage_url=f["url"], current_version=f["ver"], approval_status=f["status"]
        ))

    # 6. 5 Approvals (1 per project)
    approvals_data = [
        {"id": "app_1", "p_id": "proj_1", "f_id": "file_1", "title": "Approve AI Checkout Flow Wireframe v2", "from": client1.id, "status": "PENDING"},
        {"id": "app_2", "p_id": "proj_2", "f_id": "file_2", "title": "Approve Biometric Security Integration Spec", "from": client3.id, "status": "APPROVED"},
        {"id": "app_3", "p_id": "proj_3", "f_id": "file_3", "title": "Review HLS Video Streaming Player Controls", "from": client4.id, "status": "CHANGES_REQUESTED"},
        {"id": "app_4", "p_id": "proj_4", "f_id": "file_4", "title": "Approve HIPAA Telehealth Dashboard System", "from": client5.id, "status": "APPROVED"},
        {"id": "app_5", "p_id": "proj_5", "f_id": "file_5", "title": "Review Vector Logo & Dark Mode Token Suite", "from": client2.id, "status": "PENDING"},
    ]

    for a in approvals_data:
        db.add(Approval(
            id=a["id"], project_id=a["p_id"], file_id=a["f_id"], title=a["title"],
            description="Client verification requested for active sprint deliverable milestone.",
            status=a["status"], requested_from_user_id=a["from"]
        ))

    # 7. 5 Tasks per Project (Total 25 Tasks)
    statuses = ["TO_DO", "IN_PROGRESS", "REVIEW", "DONE", "BACKLOG"]
    priorities = ["HIGH", "MEDIUM", "URGENT", "LOW", "MEDIUM"]
    types = ["STORY", "BUG", "TASK", "STORY", "BUG"]
    assignees = [dev1.id, dev2.id, dev3.id, dev1.id, dev2.id]

    task_idx = 1
    for p in projects_list:
        for i in range(5):
            t = Task(
                id=f"task_{task_idx}",
                project_id=p.id,
                assignee_id=assignees[i],
                created_by=manager.id,
                issue_key=f"{p.key_prefix}-{100 + i + 1}",
                issue_type=types[i],
                story_points=(i + 1) * 2,
                title=f"{p.name} - Milestone Task #{i+1}",
                description=f"Detailed implementation requirements for module #{i+1} in {p.name}.",
                status=statuses[i],
                priority=priorities[i],
                due_date="2026-10-15"
            )
            db.add(t)
            task_idx += 1

    # 8. 5 Activity Logs per Project
    for p in projects_list:
        for i in range(5):
            db.add(ActivityLog(
                id=str(uuid.uuid4()),
                organization_id=org_id,
                project_id=p.id,
                user_id=dev1.id if i % 2 == 0 else manager.id,
                action=f"Updated sprint task #{i+1} status in {p.name}",
                entity_type="TASK",
                entity_id=f"task_{i+1}"
            ))

    # 9. 5 Messages per Project
    for p in projects_list:
        for i in range(5):
            db.add(Message(
                id=str(uuid.uuid4()),
                project_id=p.id,
                sender_id=p.client_user_id if i % 2 == 0 else dev1.id,
                message=f"Sprint update #{i+1}: Feature build is progressing smoothly on schedule.",
            ))

    db.commit()
    db.close()
    print("Database seeded with exactly 5 sets of Projects, Clients, Developers, Tasks, Files, and Approvals!")

if __name__ == "__main__":
    seed_database()
