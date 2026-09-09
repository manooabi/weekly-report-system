# Weekly Work Reporting System

A full-stack web application for managing weekly employee work reports. The system allows team members to create and submit structured weekly reports, while managers can review reports, request corrections, approve submissions, and monitor team reporting through dashboards and analytics.

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based access control
* Team Member, Manager, and Admin roles
* Protected frontend routes
* Protected backend API endpoints
* Team members can access only their own reports

### Team Member

* View assigned projects
* Create weekly reports
* Save reports as drafts
* Edit draft reports
* Submit reports for review
* View personal report history
* Respond to manager correction requests
* Edit and resubmit corrected reports
* View report versions and review history

### Weekly Reports

Each report supports:

* Week start and end dates
* Project
* Tasks
* Task priority
* Planned percentage
* Actual percentage
* Task status
* Planned hours
* Spent hours
* Deliverables
* Achievements
* Key achievement
* Blockers/challenges
* Key blocker
* Hours by task type
* Next week plan
* Notes
* Links

### Manager

* View reports from team members
* Filter reports by team member
* Filter by project
* Filter by status
* Filter by date range
* View individual reports
* Request corrections
* Provide review comments
* Approve submitted reports
* View report version history
* View review history
* View team member profiles
* Monitor reporting status through the dashboard

### Admin

* All Manager capabilities
* Create users
* Change user roles
* Activate/deactivate users
* Manage projects
* Manage categories
* Assign team members to projects

### Dashboard & Analytics

The manager dashboard provides:

* Total submitted reports
* Pending reports
* Reports requiring correction
* Approved reports
* Submission compliance
* Open blockers
* Recent activity
* Task completion trends
* Report status by team member
* Workload by project
* Time spent by task type

### Report Versioning

The system maintains report versions during the correction workflow.

When a manager requests a correction, the team member can update the report and resubmit it while preserving the previous version.

Review actions are associated with the report version they were performed against.

## Report Workflow

The main reporting workflow is:

```text
Draft
  ↓
Submitted
  ↓
Manager Review
  ├──→ Approved
  │
  └──→ Needs Correction
             ↓
        Edit & Resubmit
             ↓
          Submitted
             ↓
       Manager Review
```

Previous report versions and review actions are preserved for historical tracking.

## Technology Stack

### Frontend

* React
* JavaScript
* React Router
* Axios
* Recharts
* CSS

### Backend

* Node.js
* Express.js
* JavaScript
* REST API
* JWT Authentication
* Zod Validation

### Database

* MySQL
* Prisma ORM

### Development Tools

* Postman
* Git
* GitHub
* SourceTree

## System Architecture

```text
┌──────────────────────────┐
│      React Frontend      │
│                          │
│  Pages / Components      │
│  React Router            │
│  Axios                   │
│  Recharts                │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│    Node.js + Express     │
│                          │
│  Routes                  │
│  Controllers             │
│  Middleware              │
│  Validation              │
│  Authentication / RBAC   │
└────────────┬─────────────┘
             │
             │ Prisma ORM
             ▼
┌──────────────────────────┐
│         MySQL            │
│                          │
│ Users / Projects         │
│ Reports / Versions       │
│ Tasks / Reviews          │
│ Achievements / Blockers  │
└──────────────────────────┘
```

## User Roles

| Role        | Main Responsibilities                                        |
| ----------- | ------------------------------------------------------------ |
| Team Member | Create, edit, submit and resubmit own reports                |
| Manager     | Review team reports, request corrections and approve reports |
| Admin       | Manage users, roles, projects and categories                 |

## Project Structure

```text
weekly-report-system/
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   ├── validators/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   ├── prisma.config.ts
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── docs/
│   └── er-diagram.png
│
├── .gitignore
└── README.md
```

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MySQL
* Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd weekly-report-system
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `Backend` directory:

```env
DATABASE_URL="mysql://root@localhost:3306/weekly_report_system"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="1d"
```

Update the database credentials if your local MySQL configuration is different.

### 4. Create the Database

Create a MySQL database named:

```text
weekly_report_system
```

### 5. Apply Prisma Migrations

From the `Backend` directory:

```bash
npx prisma migrate deploy
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Seed Demo Data

```bash
npx prisma db seed
```

The seed creates demo users, roles, categories, projects, project memberships, reports, report versions, tasks, reviews and related data.

### 8. Start the Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 9. Install Frontend Dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

### 10. Start the Frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Demo Accounts

The seed provides the following demo accounts.

| Role        | Email                                             | Password     |
| ----------- | ------------------------------------------------- | ------------ |
| Admin       | [admin@example.com](mailto:admin@example.com)     | Password123! |
| Manager     | [manager@example.com](mailto:manager@example.com) | Password123! |
| Team Member | [john@example.com](mailto:john@example.com)       | Password123! |
| Team Member | [jane@example.com](mailto:jane@example.com)       | Password123! |
| Team Member | [mike@example.com](mailto:mike@example.com)       | Password123! |

These accounts are intended for local demonstration and testing.

## Main Application Pages

### Team Member

* Dashboard
* My Reports
* Create Report
* Edit Report
* Report Details

### Manager

* Manager Dashboard
* Reports
* Report Details / Review
* Projects & Categories
* Team Member Profile

### Admin

* User Management
* Manager functionality
* Project & Category Management

## API Overview

The backend exposes RESTful API endpoints for:

* Authentication
* Users
* Categories
* Projects
* Project memberships
* Reports
* Report versions
* Tasks
* Achievements
* Blockers
* Report hours
* Report submission
* Report correction
* Report approval
* Review history
* Dashboard analytics

All protected endpoints require authentication, and role-specific endpoints enforce RBAC permissions.

## Database Design

The database contains entities for:

* Roles
* Users
* Report statuses
* Task priorities
* Task statuses
* Task types
* Review actions
* Categories
* Projects
* Project members
* Reports
* Report versions
* Report tasks
* Report achievements
* Report blockers
* Report hours
* Report reviews

The ER diagram is available at:

```text
docs/er-diagram.png
```

## Security

The application implements:

* JWT authentication
* Password hashing
* Protected API endpoints
* Role-based authorization
* Team member report isolation
* Request validation using Zod
* Protected report review operations
* Protected administrative operations

## Testing

The system was tested across the main application workflows, including:

* Authentication
* Team member report creation
* Draft management
* Report submission
* Manager review
* Correction requests
* Correction and resubmission
* Report versioning
* Report approval
* Review history
* Dashboard analytics
* User management
* Project and category management
* Project member assignment
* Role-based access control
* Permission boundaries
* Invalid resource handling

## Future Enhancements

Possible future improvements include:

* AI-powered report assistance
* Email notifications
* Automated submission reminders
* Advanced analytics
* Cloud deployment
* Additional reporting and export capabilities

## Project Status

The core assessment requirements have been implemented, tested and integrated into a complete full-stack application.

The system supports the complete weekly reporting lifecycle from report creation through manager review, correction, resubmission and approval.
