# Spendly - Personal Finance Management Application

## Overview

Spendly is a full-stack personal finance management application designed to help users track, manage, and understand their financial activity through a centralized and intuitive interface.

The application enables users to record income and expenses, organize transactions by category, monitor their financial balance, review transaction history, and manage their financial data.

Spendly is built with a React and TypeScript frontend, a Python Flask REST API backend, and SQLite for persistent data storage.

The primary objective of the application is to provide a simple, reliable, and professional solution for personal financial tracking.

---

## Key Features

### Financial Dashboard

The dashboard provides an overview of the user's financial activity, including:

- Total income
- Total expenses
- Current balance
- Recent transactions
- Financial summary information

Financial values are calculated from database records and are updated automatically when transactions are added, modified, or deleted.

### Transaction Management

Spendly provides complete transaction management functionality:

- Add income transactions
- Add expense transactions
- Edit existing transactions
- Delete transactions
- View transaction history
- Search transactions
- Filter transactions
- Categorize transactions

Each transaction contains:

- Transaction type
- Category
- Amount
- Date
- Description

### Financial Calculations

The application calculates financial values using the following logic:


Total Income = Sum of all income transactions

Total Expenses = Sum of all expense transactions

Current Balance = Total Income - Total Expenses

