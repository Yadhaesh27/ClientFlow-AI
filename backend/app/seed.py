import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models import (
    Organization, User, Project, ProjectMember, Milestone, Task,
    File, FileVersion, Approval, Message, Comment, Notification, ActivityLog
)

def seed_database():
    # Drop all and recreate to update SQLite schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()

    print("Seeding database with ClientFlow AI demo data...")

    # 1. Organization
    org_id = str(uuid.uuid4())
    org = Organization(
        id=org_id,
        name="ClientFlow AI Agency Workspace",
        slug="clientflow-agency"
    )
    db.add(org)

    # 2. Users (Admin, Client, Team Developer with exact requested credentials)
    admin_id = str(uuid.uuid4())
    manager_id = str(uuid.uuid4())
    dev_id = str(uuid.uuid4())
    client_id = str(uuid.uuid4())

    hashed_pw = get_password_hash("Demo@123")

    admin = User(
        id=admin_id, organization_id=org_id, name="Sarah Jenkins (Admin)",
        email="admin@clientflow.demo", password_hash=hashed_pw, role="ADMIN",
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    )
    manager = User(
        id=manager_id, organization_id=org_id, name="Alex Rivera (PM)",
        email="manager@clientflow.demo", password_hash=hashed_pw, role="PROJECT_MANAGER",
        avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    )
    dev = User(
        id=dev_id, organization_id=org_id, name="Aarav Sharma (Senior Dev)",
        email="developer@clientflow.demo", password_hash=hashed_pw, role="TEAM_MEMBER",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    )
    client = User(
        id=client_id, organization_id=org_id, name="David Vance (Northstar Labs)",
        email="client@clientflow.demo", password_hash=hashed_pw, role="CLIENT",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    )

    db.add_all([admin, manager, dev, client])

    # 3. Projects with Keys & Client Assignments
    now = datetime.now(timezone.utc)
    future_date = (now + timedelta(days=14)).strftime("%Y-%m-%d")
    past_date = (now - timedelta(days=5)).strftime("%Y-%m-%d")

    proj1_id = str(uuid.uuid4())
    proj1 = Project(
        id=proj1_id,
        organization_id=org_id,
        client_user_id=client_id,
        key_prefix="WEB",
        name="E-Commerce Platform Overhaul",
        description="Complete website redesign and checkout optimization for Northstar Labs.",
        status="ACTIVE",
        progress=82,
        health_score=87,
        start_date=(now - timedelta(days=20)).strftime("%Y-%m-%d"),
        deadline=future_date,
        budget=245000.0
    )

    proj2_id = str(uuid.uuid4())
    proj2 = Project(
        id=proj2_id,
        organization_id=org_id,
        client_user_id=client_id,
        key_prefix="MOB",
        name="Mobile Banking UI Application",
        description="iOS and Android cross-platform client portal app development for Vertex Studio.",
        status="ACTIVE",
        progress=61,
        health_score=68,
        start_date=(now - timedelta(days=30)).strftime("%Y-%m-%d"),
        deadline=past_date,
        budget=180000.0
    )

    proj3_id = str(uuid.uuid4())
    proj3 = Project(
        id=proj3_id,
        organization_id=org_id,
        client_user_id=client_id,
        key_prefix="MKT",
        name="Marketing Automation Portal",
        description="Q4 Marketing dashboard, visual design deck, and automated email funnel.",
        status="ACTIVE",
        progress=94,
        health_score=95,
        start_date=(now - timedelta(days=10)).strftime("%Y-%m-%d"),
        deadline=future_date,
        budget=120000.0
    )

    db.add_all([proj1, proj2, proj3])

    # Assign developers
    db.add_all([
        ProjectMember(id=str(uuid.uuid4()), project_id=proj1_id, user_id=dev_id, role_in_project="DEVELOPER"),
        ProjectMember(id=str(uuid.uuid4()), project_id=proj1_id, user_id=manager_id, role_in_project="LEAD"),
        ProjectMember(id=str(uuid.uuid4()), project_id=proj2_id, user_id=dev_id, role_in_project="DEVELOPER"),
    ])

    # 4. ClientFlow Tasks
    t1 = Task(
        id=str(uuid.uuid4()), project_id=proj1_id, assignee_id=dev_id, created_by=manager_id,
        issue_key="WEB-101", issue_type="STORY", story_points=5,
        title="Implement hero section responsive layout", description="Use modern grid system for desktop and mobile viewports.",
        status="DONE", priority="HIGH", due_date=past_date
    )
    t2 = Task(
        id=str(uuid.uuid4()), project_id=proj1_id, assignee_id=dev_id, created_by=manager_id,
        issue_key="WEB-102", issue_type="TASK", story_points=3,
        title="Setup Analytics Tracking and SEO Meta Tags", description="Add meta tags and tracking metrics.",
        status="IN_PROGRESS", priority="MEDIUM", due_date=future_date
    )
    t3 = Task(
        id=str(uuid.uuid4()), project_id=proj1_id, assignee_id=manager_id, created_by=admin_id,
        issue_key="WEB-103", issue_type="STORY", story_points=8,
        title="Client Sign-off on Homepage Deliverable", description="Awaiting client approval in the Action Center.",
        status="REVIEW", priority="URGENT", due_date=future_date
    )
    t4 = Task(
        id=str(uuid.uuid4()), project_id=proj1_id, assignee_id=dev_id, created_by=manager_id,
        issue_key="WEB-104", issue_type="BUG", story_points=2,
        title="Fix mobile line wrapping on Safari", description="Resolve flexbox clipping on mobile devices.",
        status="TO_DO", priority="LOW", due_date=future_date
    )
    t5 = Task(
        id=str(uuid.uuid4()), project_id=proj2_id, assignee_id=dev_id, created_by=manager_id,
        issue_key="MOB-201", issue_type="BUG", story_points=5,
        title="Fix push notification authentication payload", description="Resolve 401 error on notification gateway connection.",
        status="IN_PROGRESS", priority="URGENT", due_date=past_date
    )

    db.add_all([t1, t2, t3, t4, t5])

    # 5. File & Approvals
    file1_id = str(uuid.uuid4())
    file1 = File(
        id=file1_id, project_id=proj1_id, uploaded_by=manager_id,
        folder="Deliverables", filename="Homepage_Design_v4.png",
        storage_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        mime_type="image/png", size_bytes=2450000, current_version=4,
        approval_status="PENDING"
    )
    db.add(file1)

    app1_id = str(uuid.uuid4())
    app1 = Approval(
        id=app1_id, project_id=proj1_id, file_id=file1_id,
        title="Homepage Design v4 Deliverable Sign-off",
        description="Please review the updated dark mode layout and client feedback revisions.",
        status="PENDING", requested_from_user_id=client_id
    )
    db.add(app1)

    # Activity logs
    activities = [
        ("PROJECT_CREATED", proj1_id, manager_id, "Project E-Commerce Platform Overhaul created"),
        ("TASK_CREATED", proj1_id, manager_id, "Task WEB-101 created"),
        ("TASK_STATUS_CHANGED", proj1_id, dev_id, "Task WEB-101 moved to DONE"),
        ("TASK_CREATED", proj1_id, manager_id, "Task WEB-104 [BUG] created"),
    ]
    for act, p_id, u_id, detail in activities:
        db.add(ActivityLog(
            id=str(uuid.uuid4()), organization_id=org_id, project_id=p_id,
            user_id=u_id, action=act, entity_type="project", entity_id=p_id,
            metadata_json=f'{{"detail": "{detail}"}}'
        ))

    db.commit()
    db.close()
    print("ClientFlow AI demo database seeded successfully!")

if __name__ == "__main__":
    seed_database()
