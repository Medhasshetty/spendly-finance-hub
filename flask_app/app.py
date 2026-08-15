import os
import sqlite3
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, request, render_template, redirect, url_for, flash
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "spendly-dev-secret-key-change-in-production")

# Enable CORS for all /api/* routes so React dev and prod clients can communicate cleanly
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE = Path(__file__).parent / "expense_tracker.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            category TEXT NOT NULL,
            amount REAL NOT NULL CHECK(amount > 0),
            date TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


# Ensure the database and tables are created upon application startup
init_db()


def validate_transaction_payload(data):
    fields = {}
    if not isinstance(data, dict):
        return {"general": "Request body must be a JSON object"}

    tx_type = data.get("type")
    if not tx_type or not str(tx_type).strip():
        fields["type"] = "Transaction type is required."
    elif str(tx_type).strip().lower() not in ("income", "expense"):
        fields["type"] = "Transaction type must be either 'income' or 'expense'."

    category = data.get("category")
    if not category or not str(category).strip():
        fields["category"] = "Category is required."

    amount = data.get("amount")
    if amount is None or str(amount).strip() == "":
        fields["amount"] = "Amount is required."
    else:
        try:
            val = float(amount)
            if val <= 0:
                fields["amount"] = "Amount must be greater than 0."
        except (ValueError, TypeError):
            fields["amount"] = "Amount must be a valid positive number."

    date_str = data.get("date")
    if not date_str or not str(date_str).strip():
        fields["date"] = "Date is required."
    else:
        try:
            datetime.strptime(str(date_str).strip(), "%Y-%m-%d")
        except ValueError:
            fields["date"] = "Date must be in YYYY-MM-DD format."

    return fields


# ==========================================
# REST API ENDPOINTS
# ==========================================


@app.route("/api/transactions", methods=["GET"])
def api_get_transactions():
    """Returns all transactions ordered by date descending."""
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT id, type, category, amount, date, description, created_at
        FROM transactions
        ORDER BY date DESC, id DESC
    """).fetchall()
    conn.close()

    transactions = [
        {
            "id": row["id"],
            "type": row["type"],
            "category": row["category"],
            "amount": float(row["amount"]),
            "date": row["date"],
            "description": row["description"] or "",
            "created_at": row["created_at"],
        }
        for row in rows
    ]

    return jsonify(transactions), 200


@app.route("/api/transactions", methods=["POST"])
def api_create_transaction():
    """Creates a new transaction with strict validation."""
    data = request.get_json(silent=True) or {}
    validation_errors = validate_transaction_payload(data)

    if validation_errors:
        return (
            jsonify({"error": "Validation failed", "fields": validation_errors}),
            400,
        )

    tx_type = str(data["type"]).strip().lower()
    category = str(data["category"]).strip()
    amount = round(float(data["amount"]), 2)
    date_str = str(data["date"]).strip()
    description = str(data.get("description", "") or "").strip() or None

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO transactions (type, category, amount, date, description)
        VALUES (?, ?, ?, ?, ?)
    """,
        (tx_type, category, amount, date_str, description),
    )
    conn.commit()
    new_id = cursor.lastrowid

    row = conn.execute(
        "SELECT id, type, category, amount, date, description, created_at FROM transactions WHERE id = ?",
        (new_id,),
    ).fetchone()
    conn.close()

    created_tx = {
        "id": row["id"],
        "type": row["type"],
        "category": row["category"],
        "amount": float(row["amount"]),
        "date": row["date"],
        "description": row["description"] or "",
        "created_at": row["created_at"],
    }

    return jsonify(created_tx), 201


@app.route("/api/transactions/<int:tx_id>", methods=["PUT"])
def api_update_transaction(tx_id):
    """Updates an existing transaction."""
    data = request.get_json(silent=True) or {}
    validation_errors = validate_transaction_payload(data)

    if validation_errors:
        return (
            jsonify({"error": "Validation failed", "fields": validation_errors}),
            400,
        )

    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM transactions WHERE id = ?", (tx_id,)).fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Transaction not found"}), 404

    tx_type = str(data["type"]).strip().lower()
    category = str(data["category"]).strip()
    amount = round(float(data["amount"]), 2)
    date_str = str(data["date"]).strip()
    description = str(data.get("description", "") or "").strip() or None

    conn.execute(
        """
        UPDATE transactions
        SET type = ?, category = ?, amount = ?, date = ?, description = ?
        WHERE id = ?
    """,
        (tx_type, category, amount, date_str, description, tx_id),
    )
    conn.commit()

    row = conn.execute(
        "SELECT id, type, category, amount, date, description, created_at FROM transactions WHERE id = ?",
        (tx_id,),
    ).fetchone()
    conn.close()

    updated_tx = {
        "id": row["id"],
        "type": row["type"],
        "category": row["category"],
        "amount": float(row["amount"]),
        "date": row["date"],
        "description": row["description"] or "",
        "created_at": row["created_at"],
    }

    return jsonify(updated_tx), 200


@app.route("/api/transactions/<int:tx_id>", methods=["DELETE"])
def api_delete_transaction(tx_id):
    """Deletes a transaction by id."""
    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM transactions WHERE id = ?", (tx_id,)).fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Transaction not found"}), 404

    conn.execute("DELETE FROM transactions WHERE id = ?", (tx_id,))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "id": tx_id}), 200


@app.route("/api/summary", methods=["GET"])
def api_get_summary():
    """Calculates Total Income, Total Expense, and Current Balance directly from SQLite."""
    conn = get_db_connection()

    total_income = conn.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE type = 'income'
    """).fetchone()[0]

    total_expense = conn.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE type = 'expense'
    """).fetchone()[0]

    count = conn.execute("SELECT COUNT(*) FROM transactions").fetchone()[0]
    conn.close()

    total_income = round(float(total_income), 2)
    total_expense = round(float(total_expense), 2)
    balance = round(total_income - total_expense, 2)

    return (
        jsonify(
            {
                "total_income": total_income,
                "total_expense": total_expense,
                "balance": balance,
                "transaction_count": count,
            }
        ),
        200,
    )


# ==========================================
# SSR HTML FALLBACK ROUTES
# ==========================================


@app.route("/")
def dashboard():
    conn = get_db_connection()
    transactions = conn.execute("""
        SELECT *
        FROM transactions
        ORDER BY date DESC, id DESC
    """).fetchall()

    total_income = conn.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE type = 'income'
    """).fetchone()[0]

    total_expense = conn.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE type = 'expense'
    """).fetchone()[0]
    conn.close()

    balance = total_income - total_expense

    try:
        return render_template(
            "dashboard.html",
            transactions=transactions,
            total_income=total_income,
            total_expense=total_expense,
            balance=balance,
        )
    except Exception:
        # If template is empty or unconfigured, return JSON overview
        return jsonify({
            "message": "Spendly Flask API is active",
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": balance,
            "transactions_count": len(transactions),
        })


@app.route("/add", methods=["GET", "POST"])
def add_transaction():
    if request.method == "POST":
        transaction_type = request.form.get("type", "").strip().lower()
        category = request.form.get("category", "").strip()
        amount = request.form.get("amount", "").strip()
        date_str = request.form.get("date", "").strip()
        description = request.form.get("description", "").strip()

        if not transaction_type or not category or not amount or not date_str:
            flash("All required fields must be filled.", "danger")
            return redirect(url_for("add_transaction"))

        if transaction_type not in ("income", "expense"):
            flash("Transaction type must be Income or Expense.", "danger")
            return redirect(url_for("add_transaction"))

        try:
            amount_val = float(amount)
            if amount_val <= 0:
                flash("Amount must be greater than 0.", "danger")
                return redirect(url_for("add_transaction"))
        except ValueError:
            flash("Amount must be a valid number.", "danger")
            return redirect(url_for("add_transaction"))

        conn = get_db_connection()
        conn.execute(
            """
            INSERT INTO transactions (type, category, amount, date, description)
            VALUES (?, ?, ?, ?, ?)
        """,
            (transaction_type, category, amount_val, date_str, description or None),
        )
        conn.commit()
        conn.close()
        flash("Transaction added successfully!", "success")
        return redirect(url_for("dashboard"))

    try:
        return render_template("add_transaction.html")
    except Exception:
        return jsonify({"message": "Use POST /api/transactions to create transactions."})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
