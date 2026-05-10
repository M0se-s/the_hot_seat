import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing Backend APIs...")

    # 1. Get session types
    print("1. Fetching session types...")
    resp = requests.get(f"{BASE_URL}/session-types")
    resp.raise_for_status()
    session_types = resp.json()
    if not session_types:
        print("No session types found! Make sure to run seed data.")
        return
    session_type_id = session_types[0]['id']
    print(f"   Got session type: {session_type_id}")

    # 2. Create project
    print("2. Creating a project...")
    project_payload = {
        "title": "Test Project API",
        "description": "Validation test for file uploads",
        "session_type_id": session_type_id
    }
    resp = requests.post(f"{BASE_URL}/projects", json=project_payload)
    resp.raise_for_status()
    project = resp.json()
    project_id = project['id']
    print(f"   Created project: {project_id}")

    # 3. Test text file upload
    print("3. Testing small .txt file upload...")
    txt_content = b"This is a test document. It contains some text for context extraction validation."
    files = {
        "file": ("test_doc.txt", txt_content, "text/plain")
    }
    resp = requests.post(f"{BASE_URL}/projects/{project_id}/uploads", files=files)
    if resp.status_code != 200:
        print(f"   Failed to upload txt: {resp.text}")
        return
    upload_resp = resp.json()
    print(f"   Upload response: {upload_resp}")

    # 4. Verify project fields for text file
    print("4. Verifying project fields after TXT upload...")
    resp = requests.get(f"{BASE_URL}/projects/{project_id}")
    resp.raise_for_status()
    updated_project = resp.json()
    
    file_urls = updated_project.get("file_urls", [])
    extracted_context = updated_project.get("extracted_context", [])
    
    print(f"   file_urls: {file_urls}")
    print(f"   extracted_context: {extracted_context}")
    
    if not file_urls or "supabase.co" not in file_urls[-1]:
        print("   ❌ Error: file_urls missing or does not contain Supabase URL")
    else:
        print("   ✅ file_urls OK")
        
    if not extracted_context or "This is a test document" not in extracted_context[-1]:
        print("   ❌ Error: extracted_context missing or incorrect")
    else:
        print("   ✅ extracted_context OK")


if __name__ == "__main__":
    run_tests()
