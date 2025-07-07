# 💸 Personal Finance Visualizer

A simple, responsive web application to track personal finances—built with Next.js, React, shadcn/ui, and Recharts. It allows users to manage transactions, categorize spending, visualize data through charts, and set monthly budgets — all stored locally using browser **Local Storage**.

---

## 🚀 Live Demo

=
📁 [GitHub Repository](https://github.com/adiispam0804/financevisualizer)

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** Tailwind CSS
- **Charts:** [Recharts](https://recharts.org/)
- **Data Storage:** Browser Local Storage *(No backend or database)*

---

## 📦 Features by Stage

### ✅ Stage 1: Basic Transaction Tracking

- Add/Edit/Delete transactions (amount, date, description)
- View all transactions in a list
- Bar chart for monthly expenses
- Basic form validation (required fields, numeric amount)

### ✅ Stage 2: Categories

- Predefined categories (e.g., Food, Rent, Travel, etc.)
- Category selection in transaction form
- Pie chart of category-wise spending
- Dashboard with:
  - Total expenses
  - Category breakdown
  - Most recent transactions

### ✅ Stage 3: Budgeting

- Set monthly budgets per category
- Budget vs Actual comparison chart
- Simple insights (e.g. % spent of each category)

---

## 📸 Screenshots

<!-- Add screenshots here if available -->

yaml
Copy
Edit

---

## 🧠 How It Works (No Backend)

This app uses **Local Storage** to persist all data directly in the browser:

- Transactions and budgets are stored as JSON in `localStorage`
- On each load, the app pulls data from local storage and updates UI
- Works offline and has no server dependencies

---

## 📁 Folder Structure

app/
├─ page.tsx // Dashboard
├─ transactions/ // List and form
├─ api/ // (empty, since local storage is used)
components/
├─ TransactionForm.tsx
├─ TransactionList.tsx
├─ Dashboard.tsx
├─ BudgetChart.tsx
├─ CategoryPieChart.tsx
lib/
├─ storage.ts // localStorage helpers
models/
├─ types.ts // TypeScript types

yaml
Copy
Edit

---

## 🧪 Getting Started Locally

```bash
# Clone the repo
git clone https://github.com/your-username/personal-finance-visualizer

# Navigate to the project folder
cd personal-finance-visualizer

# Install dependencies
npm install

# Run the dev server
npm run dev
Open http://localhost:3000 in your browser to view the app.

📌 Important Notes
❌ No login or authentication is included (per assignment rules)

✅ Fully responsive and mobile-friendly design

🧠 Works entirely in-browser; all data is saved in localStorage

📃 License
This project is open-source and available under the MIT License.

🙌 Acknowledgments
shadcn/ui

Recharts

Next.js
