import requests
import json
import uuid
import sys
from reportlab.pdfgen import canvas

BASE_URL = "http://127.0.0.1:8000"

def create_test_pdf(filename):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "This is a selectable PDF.")
    c.drawString(100, 730, "It contains some sample text to test extraction.")
    c.save()

def run_tests():
    print("Testing Backend APIs for PDF upload...")

    # 1. Get session types
    print("1. Fetching session types...")
    resp = requests.get(f"{BASE_URL}/session-types")
    resp.raise_for_status()
    session_types = resp.json()
    if not session_types:
        print("No session types found! Make sure to run seed data.")
        return
    session_type_id = session_types[0]['id']

    # 2. Create project
    print("2. Creating a project...")
    project_payload = {
        "title": "Test Project API PDF",
        "description": "Validation test for PDF uploads",
        "session_type_id": session_type_id
    }
    resp = requests.post(f"{BASE_URL}/projects", json=project_payload)
    resp.raise_for_status()
    project = resp.json()
    project_id = project['id']
    print(f"   Created project: {project_id}")

    # 3. Create PDF and upload
    pdf_filename = "test_document.pdf"
    create_test_pdf(pdf_filename)
    
    print("3. Testing selectable PDF file upload...")
    with open(pdf_filename, "rb") as f:
        files = {
            "file": (pdf_filename, f, "application/pdf")
        }
        resp = requests.post(f"{BASE_URL}/projects/{project_id}/uploads", files=files)
        
    if resp.status_code != 200:
        print(f"   Failed to upload pdf: {resp.text}")
        return
    upload_resp = resp.json()
    print(f"   Upload response: {upload_resp}")

    # 4. Verify project fields for PDF file
    print("4. Verifying project fields after PDF upload...")
    resp = requests.get(f"{BASE_URL}/projects/{project_id}")
    resp.raise_for_status()
    updated_project = resp.json()
    
    file_urls = updated_project.get("file_urls", [])
    extracted_context = updated_project.get("extracted_context", [])
    
    print(f"   file_urls: {file_urls}")
    print(f"   extracted_context: {extracted_context}")
    
    if not file_urls or "supabase.co" not in file_urls[-1]:
        print("   [ERROR] file_urls missing or does not contain Supabase URL")
    else:
        print("   [OK] file_urls OK")
        
    extracted_text_combined = " ".join(extracted_context)
    if not extracted_context or "selectable PDF" not in extracted_text_combined:
        print("   [ERROR] extracted_context missing or incorrect")
    else:
        print("   [OK] extracted_context OK")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    run_tests()
