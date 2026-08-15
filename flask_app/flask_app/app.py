# Forwarding module for legacy path compatibility
import sys
from pathlib import Path

parent_dir = str(Path(__file__).parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from app import app, init_db, get_db_connection

if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5000, debug=True)