JUDGES = [
    {
        "id": "judge-mara-vale",
        "name": "Mara Vale",
        "role_name": "Journalist",
        "personality": "Sharp, composed, skeptical, press-room energy.",
        "description": "Tracks public trust, direct answers, evasions, and harm acknowledgment.",
        "signature_pressure": "Answer the question directly.",
    },
    {
        "id": "judge-priya-stone",
        "name": "Priya Stone",
        "role_name": "Operator",
        "personality": "Practical, impatient, execution-first.",
        "description": "Tracks ownership, deadlines, next steps, remediation, and execution.",
        "signature_pressure": "Who owns the fix, and by when?",
    },
    {
        "id": "judge-elias-cross",
        "name": "Elias Cross",
        "role_name": "Evidence Judge",
        "personality": "Cold, precise, legalistic, evidence-obsessed.",
        "description": "Tracks unsupported claims, contradictions, source mismatch, and timeline gaps.",
        "signature_pressure": "The record does not support that.",
    },
    {
        "id": "judge-nova-reed",
        "name": "Nova Reed",
        "role_name": "Product Judge",
        "personality": "Curious but brutal, allergic to vague product claims.",
        "description": "Tracks user pain, workflow clarity, product value, and differentiation.",
        "signature_pressure": "Who is this painfully for?",
    },
    {
        "id": "judge-victor-quell",
        "name": "Victor Quell",
        "role_name": "Finance Judge",
        "personality": "Blunt, numbers-first, skeptical of hype.",
        "description": "Tracks pricing, buyer logic, revenue assumptions, and defensibility.",
        "signature_pressure": "Who pays, how much, and why now?",
    },
    {
        "id": "judge-rowan-pierce",
        "name": "Rowan Pierce",
        "role_name": "Demo Judge",
        "personality": "Theatrical but practical, obsessed with memorability.",
        "description": "Tracks story, wow moment, technical depth, demo clarity, and hackathon fit.",
        "signature_pressure": "What is the moment people will remember?",
    },
]

SESSION_TYPES = [
    {
        "id": "session-crisis-panel",
        "name": "Crisis Panel",
        "description": "For crisis responses, public apologies, incident explanations, outage responses, and product recall responses.",
        "default_duration_seconds": 300,
        "judge_ids": [
            "judge-mara-vale",
            "judge-priya-stone",
            "judge-elias-cross",
        ],
    },
    {
        "id": "session-pitch-panel",
        "name": "Pitch Panel",
        "description": "For startup ideas, product pitches, business concepts, and investor-style pitch pressure tests.",
        "default_duration_seconds": 300,
        "judge_ids": [
            "judge-nova-reed",
            "judge-victor-quell",
            "judge-elias-cross",
        ],
    },
    {
        "id": "session-demo-panel",
        "name": "Demo Panel",
        "description": "For hackathon demos, product walkthroughs, technical demos, and competition pitches.",
        "default_duration_seconds": 300,
        "judge_ids": [
            "judge-rowan-pierce",
            "judge-nova-reed",
            "judge-victor-quell",
        ],
    },
]

DEMO_USER = {
    "id": "demo-user",
    "name": "Demo User",
    "email": "demo@hotseat.local",
    "role": "user",
}
