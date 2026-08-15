from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
from pathlib import Path

app = Flask(__name__)
app.secret_key = "spendly-secret-key"

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

    return render_template(
        "dashboard.html",
        transactions=transactions,
        total_income=total_income,
        total_expense=total_expense,
        balance=balance
    )


@app.route("/add", methods=["GET", "POST"])
def add_transaction():

    if request.method == "POST":

        transaction_type = request.form.get("type", "").strip()
        category = request.form.get("category", "").strip()
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()
        description = request.form.get("description", "").strip()

        # Required field validation
        if not transaction_type or not category or not amount or not date:
            flash("All required fields must be filled.", "danger")
            return render_template("add_transaction.html")

        # Type validation
        if transaction_type not in ("income", "expense"):
            flash("Transaction type must be Income or Expense.", "danger")
            return render_template("add_transaction.html")

        # Amount validation
        try:
            amount = float(amount)
        except ValueError:
            flash("Amount must be a valid number.", "danger")
            return render_template("add_transaction.html")

        if amount <= 0:
            flash("Amount must be greater than 0.", "danger")
            return render_template("add_transaction.html")

        # Save transaction
        conn = get_db_connection()

        conn.execute("""
            INSERT INTO transactions
            (type, category, amount, date, description)
            VALUES (?, ?, ?, ?, ?)
        """, (
            transaction_type,
            category,
            amount,
            date,
            description
        ))

        conn.commit()
        conn.close()

        flash("Transaction added successfully!", "success")

        return redirect(url_for("dashboard"))

    return render_template("add_transaction.html")


if __name__ == "__main__":
    init_db()
    app.run(debug=True)