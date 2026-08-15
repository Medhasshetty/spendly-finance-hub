# Spendly: Your Financial Compass

Build a complete production-quality personal finance web application called "Spendly".

IMPORTANT:

Spendly must look like a premium modern fintech SaaS product, NOT a basic college CRUD project, generic Bootstrap template, or over-designed AI dashboard.

The product should feel:

Professional • Minimal • Trustworthy • Modern • Clean • Premium • Easy to use

==================================================

1. BRAND

==================================================

Name: Spendly

Tagline:

Track. Manage. Grow.

Purpose:

Spendly helps users track income and expenses, organize transactions, monitor their balance, and understand spending patterns through a clean financial dashboard.

Target users:

- Students

- Working professionals

- Freelancers

- Small business owners

- Individuals managing personal finances

Brand personality:

- Professional

- Trustworthy

- Minimal

- Calm

- Intelligent

- Financially focused

==================================================

2. BRAND COLORS

==================================================

Use this exact color system:

Primary Navy: #0F172A

Primary Emerald: #10B981

Dark Emerald: #059669

Income Green: #22C55E

Expense Coral: #F43F5E

Background: #F8FAFC

White: #FFFFFF

Main Text: #1E293B

Secondary Text: #64748B

Border: #E2E8F0

Color usage:

- Navy = brand, navigation, important text

- Emerald = primary CTA and brand accent

- Green = income/positive financial values

- Coral = expenses/delete actions

- Soft gray = page background

- White = cards and forms

Avoid:

- Neon colors

- Purple-heavy AI aesthetics

- Excessive gradients

- Excessive glassmorphism

- Glowing effects

- 3D graphics

- Excessive shadows

- Overly colorful cards

The visual style must be flat, elegant, restrained, and premium.

==================================================

3. LOGO / BRAND MARK

==================================================

Create a simple professional Spendly logo.

Logo concept:

A minimal stylized "S" subtly inspired by financial growth or an upward movement.

The logo should be:

- Minimal

- Flat

- Modern

- Recognizable

- Professional

- Suitable for navbar and favicon

Use Navy + Emerald.

Wordmark:

"Spend" in Navy

"ly" in Emerald

DO NOT use:

- Coins

- Wallet illustrations

- Rupee symbols

- Piggy banks

- Large financial illustrations

- 3D logos

- Complex symbols

The logo should look like a real fintech SaaS brand.

==================================================

4. TYPOGRAPHY

==================================================

Use Inter.

Typography must be clean and modern.

Use:

- 32–40px for major financial numbers

- 24–30px for page headings

- 16–18px for card headings

- 14–16px for body text

- 12–14px for secondary text

Use bold text selectively.

==================================================

5. DESIGN SYSTEM

==================================================

Use:

- 12–16px border radius

- Subtle borders

- Very soft shadows

- Generous whitespace

- Clean cards

- Consistent spacing

- Strong visual hierarchy

Cards:

- White background

- #E2E8F0 border

- Very subtle shadow

- No excessive decoration

Primary button:

Emerald background + white text

Secondary button:

White background + Navy text + border

Danger:

Coral background + white text

Ghost:

Transparent + muted text

Use subtle hover and transition effects.

Do not over-animate.

==================================================

6. APPLICATION PAGES

==================================================

Create:

1. Dashboard

2. Transactions

3. Analytics

4. Categories

5. Settings

Also create:

- Add Transaction modal/page

- Edit Transaction modal/page

- Delete confirmation modal

- Empty states

- Error states

- 404 page

- 500 page

==================================================

7. NAVIGATION

==================================================

Desktop:

Use a clean left sidebar or professional top navigation.

Navigation:

- Spendly logo

- Dashboard

- Transactions

- Analytics

- Categories

- Settings

Active navigation item:

Use subtle Emerald accent.

Top-right:

- Notification icon

- User/profile area

Mobile:

Use a collapsible navigation or bottom/mobile navigation.

==================================================

8. DASHBOARD

==================================================

Dashboard header:

Heading:

Good afternoon

Subheading:

Here's your financial overview.

Primary CTA:

+ Add Transaction

Create four summary cards:

1. Current Balance

2. Total Income

3. Total Expenses

4. Savings Rate

Example values:

Current Balance: ₹31,500

Total Income: ₹50,000

Total Expenses: ₹18,500

Savings Rate: 63%

These are example values only. When backend is connected, values MUST come from real database calculations.

Each card should include:

- Label

- Large value

- Small supporting text

- Appropriate minimal icon

- Optional trend indicator

Do not make every card brightly colored.

Use mostly white cards with subtle accent elements.

==================================================

9. DASHBOARD CHARTS

==================================================

Create:

A. Income vs Expenses

Use Chart.js.

Show monthly:

- Income

- Expenses

Use clean professional visualization.

Income:

#22C55E

Expenses:

#F43F5E

B. Expense Breakdown

Use a clean donut chart.

Categories:

- Food

- Travel

- Shopping

- Bills

- Entertainment

- Healthcare

- Education

- Other

Use restrained colors from the brand palette and complementary muted shades.

Do not use random neon colors.

Charts must be:

- Responsive

- Interactive

- Minimal

- Easy to understand

==================================================

10. RECENT TRANSACTIONS

==================================================

Dashboard should contain "Recent Transactions".

Show latest 5 transactions.

Columns:

Date

Description

Category

Type

Amount

Example:

15 Aug | Groceries | Food | Expense | -₹500

14 Aug | Freelance Payment | Freelance | Income | +₹8,000

Income:

Green

Expense:

Coral

Add:

View all transactions

==================================================

11. TRANSACTIONS PAGE

==================================================

Header:

Transactions

Subtitle:

Manage and review your financial activity.

CTA:

+ Add Transaction

Controls:

- Search

- Transaction type filter

- Category filter

- Date range

- Sort by newest/oldest

- Sort by amount

Transaction table:

Date

Description

Category

Type

Amount

Actions

Actions:

Edit

Delete

Use pagination for large datasets.

On mobile:

Make the table horizontally scrollable or transform into responsive cards.

==================================================

12. ADD TRANSACTION

==================================================

Create a polished modal or dedicated form.

Title:

Add Transaction

Fields:

- Transaction Type

- Category

- Amount

- Date

- Description

Transaction Type:

Income / Expense

Amount:

Use INR ₹.

Validation:

- Type required

- Category required

- Amount required

- Amount must be greater than 0

- Date required

- Description optional

Buttons:

Cancel

Save Transaction

After success:

Show toast:

"Transaction added successfully."

Automatically update:

- Balance

- Income

- Expenses

- Charts

- Recent transactions

==================================================

13. EDIT TRANSACTION

==================================================

Use the same visual design as Add Transaction.

Pre-fill existing transaction values.

After update:

"Transaction updated successfully."

Recalculate all financial statistics.

==================================================

14. DELETE TRANSACTION

==================================================

Never delete immediately.

Show confirmation modal:

Delete transaction?

This action cannot be undone.

Buttons:

Cancel

Delete Transaction

After deletion:

"Transaction deleted successfully."

Refresh all relevant calculations.

==================================================

15. ANALYTICS PAGE

==================================================

Header:

Analytics

Subtitle:

Understand where your money goes.

Show:

- Monthly Spending Trend

- Income vs Expenses

- Expense Category Breakdown

- Highest Spending Category

- Average Monthly Expense

- Savings Rate

Date filters:

- This Month

- Last Month

- Last 3 Months

- Last 6 Months

- This Year

Use Chart.js.

Keep analytics informative but not overloaded.

==================================================

16. CATEGORIES

==================================================

Default Expense Categories:

- Food

- Travel

- Shopping

- Bills

- Entertainment

- Healthcare

- Education

- Other

Default Income Categories:

- Salary

- Freelance

- Business

- Investment

- Other

Display:

- Icon

- Category name

- Transaction count

- Total amount

Architect the system so custom categories can be added later.

==================================================

17. SETTINGS

==================================================

Create a clean settings page.

Sections:

- Profile

- Preferences

- Currency

- Appearance

- Data Management

Initial preferences:

Currency: INR ₹

Theme: Light

Future-ready:

- Dark mode

- Notifications

- Budget settings

- Account settings

Keep the settings page simple.

==================================================

18. EMPTY STATES

==================================================

If there are no transactions, do not show an empty dashboard.

Display:

No transactions yet

Start tracking your finances by adding your first transaction.

Button:

+ Add Transaction

Also create empty states for:

- No search results

- No analytics data

- No categories

==================================================

19. RESPONSIVE DESIGN

==================================================

The website MUST work correctly on:

- Desktop

- Laptop

- Tablet

- Mobile

Test conceptually at:

375px

768px

1024px

1440px

Mobile:

- Collapsible navigation

- Cards stack vertically

- Charts resize

- Forms become single-column

- Tables become cards or horizontal-scroll containers

- Buttons remain easy to tap

- No horizontal page overflow

==================================================

20. UX

==================================================

Use subtle micro-interactions:

- Hover states

- Button transitions

- Card hover

- Toast notifications

- Loading indicators

- Skeleton loading where useful

- Confirmation dialogs

- Empty states

- Error states

Keep animations subtle and fast.

Do NOT make the interface flashy.

==================================================

21. FINANCIAL LOGIC

==================================================

Total Income =

SUM(all income transactions)

Total Expenses =

SUM(all expense transactions)

Current Balance =

Total Income - Total Expenses

Savings Rate =

((Total Income - Total Expenses) / Total Income) × 100

Handle zero income safely.

Financial calculations must be performed reliably on the backend.

Do not rely only on frontend calculations.

Use accurate monetary handling and avoid floating-point financial errors.

==================================================

22. BACKEND

==================================================

Use:

Python 3

Flask

Flask-SQLAlchemy

SQLAlchemy

SQLite

Architecture must be modular.

Recommended structure:

spendly/

├── app/

│   ├── __init__.py

│   ├── models/

│   │   ├── transaction.py

│   │   └── category.py

│   ├── routes/

│   │   ├── dashboard.py

│   │   ├── transactions.py

│   │   ├── analytics.py

│   │   └── categories.py

│   ├── services/

│   │   ├── transaction_service.py

│   │   └── analytics_service.py

│   ├── templates/

│   ├── static/

│   │   ├── css/

│   │   ├── js/

│   │   └── images/

│   └── utils/

├── tests/

├── config.py

├── run.py

├── requirements.txt

├── .env.example

├── .gitignore

└── README.md

Keep route handlers thin.

Put business logic in service modules.

==================================================

23. DATABASE

==================================================

Use SQLite with SQLAlchemy.

Transaction fields:

id

type

category

amount

date

description

created_at

updated_at

Category fields:

id

name

type

created_at

Design the schema so authentication and user-specific transactions can be added later.

Do not hard-code transaction data into the UI.

==================================================

24. API

==================================================

Create clean internal APIs:

GET    /api/transactions

POST   /api/transactions

GET    /api/transactions/<id>

PUT    /api/transactions/<id>

DELETE /api/transactions/<id>

GET /api/dashboard/summary

GET /api/analytics/expenses

GET /api/analytics/monthly

GET /api/categories

POST /api/categories

Use correct HTTP status codes.

Use consistent JSON responses.

==================================================

25. VALIDATION & SECURITY

==================================================

Validate on both frontend and backend.

Validate:

- Required fields

- Valid transaction type

- Valid category

- Positive amount

- Valid date

- Valid numeric values

Use SQLAlchemy ORM to avoid SQL injection.

Do not expose:

- Stack traces

- Internal database errors

- Server paths

- Secrets

- API keys

Use environment variables for secrets.

Implement proper error handling.

==================================================

26. FRONTEND

==================================================

Use:

HTML5

CSS3

Bootstrap 5

JavaScript

Jinja2

Chart.js

You may use Bootstrap utilities, but the final UI MUST NOT look like a default Bootstrap template.

Create a custom Spendly design system using CSS variables.

Example:

--primary: #0F172A

--accent: #10B981

--success: #22C55E

--danger: #F43F5E

--background: #F8FAFC

--text: #1E293B

--muted: #64748B

--border: #E2E8F0

==================================================

27. ICONS

==================================================

Use a consistent minimal icon library such as Lucide Icons.

Icons should be:

- Simple

- Thin/medium stroke

- Consistent

Use icons for:

- Dashboard

- Transactions

- Analytics

- Categories

- Settings

- Income

- Expenses

- Balance

- Add

- Edit

- Delete

- Search

- Filter

Do not use emojis as primary UI icons.

==================================================

28. ACCESSIBILITY

==================================================

Use:

- Semantic HTML

- Proper labels

- Keyboard navigation

- Accessible buttons

- Sufficient color contrast

- ARIA labels where necessary

Never communicate information through color alone.

Example:

Income = green + "Income"

Expense = coral + "Expense"

==================================================

29. PERFORMANCE

==================================================

Optimize for:

- Fast initial loading

- Minimal JavaScript

- Efficient database queries

- Responsive charts

- Minimal dependencies

Do not add libraries unless necessary.

==================================================

30. TESTING

==================================================

Include tests for:

- Add transaction

- Edit transaction

- Delete transaction

- Invalid transaction

- Income calculation

- Expense calculation

- Balance calculation

- Savings rate

- Search

- Filtering

- API responses

==================================================

31. README

==================================================

Create a professional README containing:

- Project overview

- Features

- Screenshots section

- Tech stack

- Architecture

- Database structure

- Installation

- Environment setup

- Running locally

- API documentation

- Testing

- Deployment

- Future scope

==================================================

32. FUTURE-READY

==================================================

Do NOT implement these in the initial MVP.

But design the architecture so these can be added later:

- User authentication

- Multiple accounts

- Budgets

- Monthly reports

- Recurring transactions

- Notifications

- CSV/PDF export

- Cloud database

- Mobile app

- AI spending insights

==================================================

33. DO NOT BUILD

==================================================

Do NOT add:

- Banking integrations

- Real bank synchronization

- Cryptocurrency

- Stock trading

- Payment gateway

- Loan management

- Credit score tracking

- Tax management

- Social media

- Chatbot

- Unnecessary third-party APIs

- Complex financial forecasting

- Excessive AI features

Spendly's core purpose is:

TRACK

MANAGE

UNDERSTAND

==================================================

34. FINAL VISUAL QUALITY

==================================================

The most important requirement is visual quality.

The final website should immediately communicate:

"Your money, clearly organized."

The user should understand within 5 seconds:

1. How much money they have

2. How much they earned

3. How much they spent

4. Where they spent it

5. What action they can take next

Prioritize:

1. Professional UI

2. Excellent UX

3. Accurate financial calculations

4. Clean architecture

5. Responsive design

6. Accessibility

7. Performance

8. Maintainability

The result must look like a real fintech SaaS product that could be shown in a portfolio, internship interview, startup demo, or product presentation.

==================================================

35. FINAL CHECK

==================================================

Before completion verify:

✓ Logo and branding are consistent

✓ Navy + Emerald theme is consistent

✓ Dashboard is polished

✓ CRUD works

✓ Financial calculations are correct

✓ Balance updates automatically

✓ Search works

✓ Filters work

✓ Charts use real backend data

✓ Validation works

✓ Delete confirmation works

✓ Responsive layout works

✓ Mobile layout works

✓ Empty states exist

✓ Error states exist

✓ No hard-coded financial totals

✓ No broken buttons

✓ No unnecessary features

✓ Code is modular

✓ README exists

✓ UI does not look like default Bootstrap

✓ UI does not look excessively AI-generated

✓ UI is minimal, premium, and professional

Build the application fully rather than creating only a visual mockup. THE FINAL PRODUCT MUST BE IMMEDIATELY DEPLOYABLE.

## Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI, Bootstrap 5 utilities
- **Backend**: Python 3.11+, Flask 3.1 REST API, Flask-CORS
- **Database**: SQLite3 (`expense_tracker.db`)

## Local Development & Setup

### 1. Start the Flask Backend
```sh
# Install Python dependencies
pip install -r flask_app/requirements.txt

# Run Flask REST API
python flask_app/app.py
```
*The Flask REST API will start at `http://127.0.0.1:5000` and automatically initialize the SQLite database.*

### 2. Start the React Frontend
```sh
# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

### 3. Run Automated Tests
```sh
python test_flask_api.py
```

