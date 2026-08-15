import json
import unittest
import sys
from pathlib import Path

# Add flask_app to path
flask_dir = Path(__file__).parent / "flask_app"
sys.path.insert(0, str(flask_dir))

from app import app, init_db, get_db_connection, DATABASE


class SpendlyApiTestCase(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()
        init_db()
        # Clean test table
        conn = get_db_connection()
        conn.execute("DELETE FROM transactions")
        conn.commit()
        conn.close()

    def test_01_empty_transactions(self):
        res = self.client.get("/api/transactions")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data, [])

    def test_02_empty_summary(self):
        res = self.client.get("/api/summary")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["total_income"], 0.0)
        self.assertEqual(data["total_expense"], 0.0)
        self.assertEqual(data["balance"], 0.0)
        self.assertEqual(data["transaction_count"], 0)

    def test_03_create_income_transaction(self):
        payload = {
            "type": "income",
            "category": "Salary",
            "amount": 50000.0,
            "date": "2026-08-01",
            "description": "August Monthly Salary",
        }
        res = self.client.post(
            "/api/transactions",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertIn("id", data)
        self.assertEqual(data["type"], "income")
        self.assertEqual(data["category"], "Salary")
        self.assertEqual(data["amount"], 50000.0)
        self.assertEqual(data["date"], "2026-08-01")
        self.assertEqual(data["description"], "August Monthly Salary")

    def test_04_create_expense_transaction(self):
        payload = {
            "type": "expense",
            "category": "Food",
            "amount": 4500.50,
            "date": "2026-08-05",
            "description": "Weekly Groceries",
        }
        res = self.client.post(
            "/api/transactions",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertEqual(data["type"], "expense")
        self.assertEqual(data["amount"], 4500.50)

    def test_05_summary_calculation(self):
        # Insert income
        self.client.post(
            "/api/transactions",
            data=json.dumps({
                "type": "income",
                "category": "Salary",
                "amount": 60000,
                "date": "2026-08-01",
            }),
            content_type="application/json",
        )
        # Insert expense
        self.client.post(
            "/api/transactions",
            data=json.dumps({
                "type": "expense",
                "category": "Rent",
                "amount": 15000,
                "date": "2026-08-02",
            }),
            content_type="application/json",
        )
        # Check summary
        res = self.client.get("/api/summary")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["total_income"], 60000.0)
        self.assertEqual(data["total_expense"], 15000.0)
        self.assertEqual(data["balance"], 45000.0)
        self.assertEqual(data["transaction_count"], 2)

    def test_06_validation_failures(self):
        # Test missing all fields
        res = self.client.post(
            "/api/transactions",
            data=json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("error", data)
        self.assertIn("fields", data)
        self.assertIn("type", data["fields"])
        self.assertIn("category", data["fields"])
        self.assertIn("amount", data["fields"])
        self.assertIn("date", data["fields"])

        # Test amount = 0
        res = self.client.post(
            "/api/transactions",
            data=json.dumps({
                "type": "income",
                "category": "Bonus",
                "amount": 0,
                "date": "2026-08-10",
            }),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("amount", res.get_json()["fields"])

        # Test amount negative
        res = self.client.post(
            "/api/transactions",
            data=json.dumps({
                "type": "expense",
                "category": "Coffee",
                "amount": -50,
                "date": "2026-08-10",
            }),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("amount", res.get_json()["fields"])

        # Test invalid type
        res = self.client.post(
            "/api/transactions",
            data=json.dumps({
                "type": "investment",
                "category": "Stocks",
                "amount": 100,
                "date": "2026-08-10",
            }),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("type", res.get_json()["fields"])

        # Test invalid date
        res = self.client.post(
            "/api/transactions",
            data=json.dumps({
                "type": "income",
                "category": "Freelance",
                "amount": 500,
                "date": "invalid-date",
            }),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("date", res.get_json()["fields"])

    def test_07_update_and_delete(self):
        # Create
        res = self.client.post(
            "/api/transactions",
            data=json.dumps({
                "type": "income",
                "category": "Freelance",
                "amount": 5000,
                "date": "2026-08-01",
            }),
            content_type="application/json",
        )
        tx_id = res.get_json()["id"]

        # Update
        res_up = self.client.put(
            f"/api/transactions/{tx_id}",
            data=json.dumps({
                "type": "income",
                "category": "Freelance Design",
                "amount": 7500,
                "date": "2026-08-01",
                "description": "Updated rate",
            }),
            content_type="application/json",
        )
        self.assertEqual(res_up.status_code, 200)
        self.assertEqual(res_up.get_json()["amount"], 7500.0)
        self.assertEqual(res_up.get_json()["category"], "Freelance Design")

        # Delete
        res_del = self.client.delete(f"/api/transactions/{tx_id}")
        self.assertEqual(res_del.status_code, 200)

        # Verify deleted
        res_check = self.client.get("/api/transactions")
        self.assertEqual(len(res_check.get_json()), 0)


if __name__ == "__main__":
    unittest.main()
