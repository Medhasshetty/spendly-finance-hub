import sys
from pathlib import Path

# Add flask_app to path
flask_dir = Path(__file__).parent
sys.path.insert(0, str(flask_dir))

from app import init_db, get_db_connection

SAMPLE_TRANSACTIONS = [
    ("income", "Salary", 50000.0, "2026-08-01", "August Salary"),
    ("expense", "Bills", 7600.0, "2026-08-02", "Rent and utilities"),
    ("expense", "Education", 3000.0, "2026-08-05", "Certification course"),
    ("expense", "Travel", 1450.0, "2026-08-09", "Monthly transit pass"),
    ("expense", "Shopping", 2750.0, "2026-08-11", "Office backpack"),
    ("income", "Freelance", 12500.0, "2026-08-13", "Client website design"),
    ("expense", "Food", 3200.0, "2026-08-15", "Weekly groceries"),
]

def seed():
    init_db()
    conn = get_db_connection()
    count = conn.execute("SELECT COUNT(*) FROM transactions").fetchone()[0]
    if count == 0:
        for tx in SAMPLE_TRANSACTIONS:
            conn.execute(
                """
                INSERT INTO transactions (type, category, amount, date, description)
                VALUES (?, ?, ?, ?, ?)
            """,
                tx,
            )
        conn.commit()
        print(f"Seeded {len(SAMPLE_TRANSACTIONS)} sample transactions into SQLite database.")
    else:
        print(f"Database already contains {count} transactions. No seeding needed.")
    conn.close()

if __name__ == "__main__":
    seed()
