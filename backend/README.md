# The Hot Seat Backend

FastAPI backend for The Hot Seat.

## Sprint 8 scope

This backend currently supports:

- GET /health
- GET /demo-user
- GET /judges
- GET /session-types

No database, Runway, Featherless, Firebase, uploads, projects, or sessions are connected yet.

## Local setup

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it:

Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
omicron app.main:app --reload
```

Open:

http://localhost:8000/health

---

# Step 11 — Install dependencies

In the terminal:

```bash id="v0nm16"
cd backend
python -m venv .venv
```

Activate the environment.

On Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use:

```bash
.venv\Scripts\activate
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

Then install:

```bash
pip install -r requirements.txt
```
