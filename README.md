The Hot Seat
The Hot Seat is a web application that helps teams and individuals create, manage, and pressure-test projects using interactive "hot seat" sessions. Users can upload supporting materials (TXT or PDF), define the project's context and goals, and participate in simulated sessions where judges challenge the project with probing questions. Each session is recorded and analyzed, and detailed feedback is provided upon completion.

Key Features
Project Creation and Management:
Define projects with a title, detailed context, goals, and provide supplementary materials (TXT or PDF files, or pasted evidence).

Session Types and Judges:
Choose session types. Each has its own panel of virtual judges who take turns questioning the presenter in the "hot seat" format.

Simulated Judge Interactions:
Judges use custom avatars and personalities, pose challenging questions, and keep the session engaging with signature styles.

Automated Feedback and Scoring:
After a session ends, the system provides automated analysis, feedback, scores, and a final verdict on performance.

Modern Frontend:
Built with React (Next.js) and TypeScript, offering an intuitive UI for uploading materials, managing sessions, and reviewing feedback.

Robust Backend:
Powered by FastAPI and SQLAlchemy, the backend handles user data, sessions, file uploads, and feedback processing.

Tech Stack
Frontend: React (Next.js), TypeScript, modular UI components
Backend: Python (FastAPI), SQLAlchemy, PostgreSQL
File Handling: TXT and PDF upload support (without OCR in the MVP)
APIs: REST API endpoints for managing projects, sessions, and analysis
Getting Started
Prerequisites
Node.js and npm
Python 3.9 or later
PostgreSQL
Installation
Backend
Clone the repository and set up your Python environment:
bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Configure your environment variables or update app/config.py with your database URL and settings.
Run database migrations if any.
Start the backend server:
bash
uvicorn app.main:app --reload
Frontend
Install dependencies:
bash
cd frontend
npm install
Start the frontend server:
bash
npm run dev
Usage
Go to the frontend URL, usually http://localhost:3000.
Create a new project. Add a title, context/goals, and upload any supporting files.
Start a session. Choose a session type and participate as your project is put in the "hot seat."
After the session, view feedback and transcripts.
Contributing
Contributions are welcome. Please fork the repository and open a pull request.

License
No explicit license file detected. If you would like to open-source this project, consider adding a license file.
