#!/usr/bin/env python3
import os
import sys

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from src.main import app
    print("✅ App imported successfully")
    
    # Test the app
    with app.test_client() as client:
        response = client.get('/api/health')
        print(f"✅ Health check: {response.status_code} - {response.get_json()}")
        
    print("🚀 Starting server on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=False)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

