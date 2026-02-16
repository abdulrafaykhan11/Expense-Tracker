const typeSelect = document.querySelector("#type");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const dateInput = document.querySelector("#date");
const addBtn = document.querySelector("#addBtn");
const form = document.querySelector("form");

const transactionList = document.querySelector("#transaction-list");

const balanceDisplay = document.querySelector(".balance h1");
const incomeDisplay = document.querySelector(".income h1");
const expenseDisplay = document.querySelector(".expense h1");

let transactions = [];

// Load transactions from localStorage on page load
window.addEventListener("load", () => {
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    try {
      // Check if it's JSON (starts with [)
      if (storedTransactions.trim().startsWith("[")) {
        transactions = JSON.parse(storedTransactions);
        // Map 'text' to 'description' if necessary (legacy data support)
        transactions = transactions.map((t) => ({
          ...t,
          description: t.description || t.text,
          amount: parseFloat(t.amount),
        }));
      } else {
        // If it's HTML string (legacy), we can't easily parse it back to data without DOM parsing.
        // Given the user report, we are switching to JSON format.
        // If it's HTML, we'll start fresh to avoid issues, or try to keep it?
        // For this fix, let's assume JSON or empty.
        console.warn(
          "Legacy HTML format detected in localStorage. Clearing to fix display issues.",
        );
        transactions = [];
      }
    } catch (e) {
      console.error("Failed to parse transactions", e);
      transactions = [];
    }
  }
  renderTransactions();
  updateCalculations();
});

function addTransaction(e) {
  e.preventDefault();
  if (
    descriptionInput.value === "" ||
    amountInput.value === "" ||
    dateInput.value === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    type: typeSelect.value,
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    date: dateInput.value,
  };

  transactions.push(transaction);
  saveAndRender();

  // Clear form inputs
  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
  typeSelect.value = "income";
}

function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateCalculations();
}

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((transaction) => {
    // Create transaction element
    // Preserving the structure: div.transaction -> li
    const transactionItem = document.createElement("div");
    transactionItem.classList.add("transaction", transaction.type);

    const sign = transaction.type === "income" ? "+" : "-";

    transactionItem.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${transaction.description}</strong><br/>
                    <small>${transaction.date}</small>
                </div>
                <div>
                    <span class="amount">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
                    <button class="btn btn-danger btn-sm delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>
            </li>
        `;
    transactionList.appendChild(transactionItem);
  });

  // We don't need to re-attach event listeners manually if we use inlineonclick or delegate.
  // However, existing code used event listeners.
  // Using onclick="removeTransaction(id)" is simpler but requires exposing the function globally.
}

// Function to update balance, income, and expense
function updateCalculations() {
  const amounts = transactions.map((t) =>
    t.type === "income" ? t.amount : -t.amount,
  );

  const total = amounts.reduce((acc, item) => acc + item, 0);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0);

  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => acc + item, 0);

  balanceDisplay.textContent = `$${total.toFixed(2)}`;
  incomeDisplay.textContent = `$${income.toFixed(2)}`;
  expenseDisplay.textContent = `$${Math.abs(expense).toFixed(2)}`;
}

// Make removeTransaction globally available so onclick works
window.removeTransaction = function (id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveAndRender();
};

form.addEventListener("submit", addTransaction);
