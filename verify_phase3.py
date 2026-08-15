import json
import sqlite3
import urllib.request
import urllib.error
from pathlib import Path

BASE_URL = "http://127.0.0.1:5000/api"
DB_PATH = Path(__file__).parent / "flask_app" / "expense_tracker.db"

def api_req(endpoint, method="GET", data=None):
    url = f"{BASE_URL}{endpoint}"
    req_data = json.dumps(data).encode("utf-8") if data is not None else None
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, json.loads(body) if body else {}

def run_checks():
    print("==================================================")
    print("PHASE 3 END-TO-END VERIFICATION SUITE")
    print("==================================================")

    # 1. Reset DB table for deterministic testing
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DELETE FROM transactions")
    conn.commit()
    conn.close()
    print("[OK] SQLite database reset for clean verification")

    # 2. Check Empty Summary
    status, summary = api_req("/summary")
    assert status == 200, f"Expected 200, got {status}"
    assert summary["total_income"] == 0, f"Expected 0, got {summary['total_income']}"
    assert summary["total_expense"] == 0, f"Expected 0, got {summary['total_expense']}"
    assert summary["balance"] == 0, f"Expected 0, got {summary['balance']}"
    print(f"[OK] Initial Summary: Income=INR {summary['total_income']}, Expense=INR {summary['total_expense']}, Balance=INR {summary['balance']}")

    # 3. Add Income = INR 50,000 (Salary)
    income_payload = {
        "type": "income",
        "category": "Salary",
        "amount": 50000,
        "date": "2026-08-01",
        "description": "August Salary",
    }
    status, created_income = api_req("/transactions", method="POST", data=income_payload)
    assert status == 201, f"Expected 201, got {status}: {created_income}"
    print(f"[OK] Added Income: {created_income['category']} - INR {created_income['amount']}")

    # 4. Verify Summary after Income
    status, summary = api_req("/summary")
    assert summary["total_income"] == 50000.0, f"Expected 50000, got {summary['total_income']}"
    assert summary["total_expense"] == 0.0, f"Expected 0, got {summary['total_expense']}"
    assert summary["balance"] == 50000.0, f"Expected 50000, got {summary['balance']}"
    print(f"[OK] Summary after Income: Total Income=INR {summary['total_income']}, Total Expense=INR {summary['total_expense']}, Current Balance=INR {summary['balance']}")

    # 5. Add Expense = INR 500 (Food)
    expense_payload = {
        "type": "expense",
        "category": "Food",
        "amount": 500,
        "date": "2026-08-02",
        "description": "Lunch with team",
    }
    status, created_expense = api_req("/transactions", method="POST", data=expense_payload)
    assert status == 201, f"Expected 201, got {status}: {created_expense}"
    print(f"[OK] Added Expense: {created_expense['category']} - INR {created_expense['amount']}")

    # 6. Verify Summary after Expense
    status, summary = api_req("/summary")
    assert summary["total_income"] == 50000.0, f"Expected 50000, got {summary['total_income']}"
    assert summary["total_expense"] == 500.0, f"Expected 500, got {summary['total_expense']}"
    assert summary["balance"] == 49500.0, f"Expected 49500, got {summary['balance']}"
    print(f"[OK] Summary after Expense: Total Income=INR {summary['total_income']}, Total Expense=INR {summary['total_expense']}, Current Balance=INR {summary['balance']}")

    # 7. Check Transaction History List
    status, tx_list = api_req("/transactions")
    assert status == 200, f"Expected 200, got {status}"
    assert len(tx_list) == 2, f"Expected 2 transactions, got {len(tx_list)}"
    print(f"[OK] Transaction history verified: {len(tx_list)} entries found")

    # 8. Check direct SQLite persistence
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    db_rows = conn.execute("SELECT * FROM transactions ORDER BY id ASC").fetchall()
    assert len(db_rows) == 2
    assert db_rows[0]["type"] == "income" and db_rows[0]["amount"] == 50000
    assert db_rows[1]["type"] == "expense" and db_rows[1]["amount"] == 500
    conn.close()
    print("[OK] SQLite direct database check: Persisted perfectly in expense_tracker.db")

    # 9. Validation Tests
    # A. Empty form
    status, err = api_req("/transactions", method="POST", data={})
    assert status == 400 and "type" in err.get("fields", {}), f"Failed empty check: {err}"
    print("[OK] Validation Test 1: Empty form -> Rejected HTTP 400")

    # B. Missing category
    status, err = api_req("/transactions", method="POST", data={"type": "income", "amount": 100, "date": "2026-08-01"})
    assert status == 400 and "category" in err.get("fields", {}), f"Failed missing category: {err}"
    print("[OK] Validation Test 2: Missing category -> Rejected HTTP 400")

    # C. Missing amount
    status, err = api_req("/transactions", method="POST", data={"type": "income", "category": "Salary", "date": "2026-08-01"})
    assert status == 400 and "amount" in err.get("fields", {}), f"Failed missing amount: {err}"
    print("[OK] Validation Test 3: Missing amount -> Rejected HTTP 400")

    # D. Amount = 0
    status, err = api_req("/transactions", method="POST", data={"type": "expense", "category": "Food", "amount": 0, "date": "2026-08-01"})
    assert status == 400 and "amount" in err.get("fields", {}), f"Failed amount=0: {err}"
    print("[OK] Validation Test 4: Amount = 0 -> Rejected HTTP 400")

    # E. Negative amount
    status, err = api_req("/transactions", method="POST", data={"type": "expense", "category": "Food", "amount": -250, "date": "2026-08-01"})
    assert status == 400 and "amount" in err.get("fields", {}), f"Failed negative amount: {err}"
    print("[OK] Validation Test 5: Negative amount -> Rejected HTTP 400")

    # F. Missing date
    status, err = api_req("/transactions", method="POST", data={"type": "expense", "category": "Food", "amount": 250})
    assert status == 400 and "date" in err.get("fields", {}), f"Failed missing date: {err}"
    print("[OK] Validation Test 6: Missing date -> Rejected HTTP 400")

    # G. Invalid date format
    status, err = api_req("/transactions", method="POST", data={"type": "expense", "category": "Food", "amount": 250, "date": "15-08-2026"})
    assert status == 400 and "date" in err.get("fields", {}), f"Failed invalid date: {err}"
    print("[OK] Validation Test 7: Invalid date format -> Rejected HTTP 400")

    print("==================================================")
    print("ALL 12 VERIFICATION SCENARIOS PASSED WITH 100% SUCCESS!")
    print("==================================================")

if __name__ == "__main__":
    run_checks()
