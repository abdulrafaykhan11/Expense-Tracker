const typeSelect = document.querySelector("#type");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const dateInput = document.querySelector("#date");
const addBtn = document.querySelector("#addBtn");
const form = document.querySelector("form");

const transactionList = document.querySelector("#transaction-list");

const transactions = document.querySelectorAll(".transaction");
const deleteButtons = document.querySelectorAll(".delete-btn");

const amounts = document.querySelectorAll(".amount");

const balanceDisplay = document.querySelector(".balance h1");
const incomeDisplay = document.querySelector(".income h1");
const expenseDisplay = document.querySelector(".expense h1");

form.addEventListener("submit", addTransaction);

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
  let type = typeSelect.value;
  let description = descriptionInput.value;
  let amount = parseFloat(amountInput.value);
  let date = dateInput.value;
  // Create transaction element
  const transactionItem = document.createElement("div");
  transactionItem.classList.add("transaction", type);
  transactionItem.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <strong>${description}</strong><br/>
                <small>${date}</small>
            </div>
            <div>
                <span class="amount">${type === "income" ? "+" : "-"}$${amount.toFixed(2)}</span>
                <button class="btn btn-danger btn-sm delete-btn"><i class="fa fa-trash" aria-hidden="true"></i></button>
            </div>
        </li>
    `;
  transactionList.appendChild(transactionItem);
  localStorage.setItem("transactions", transactionList.innerHTML);

  // Clear form inputs
  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
  typeSelect.value = "income";

  // Update calculations
  updateCalculations();
  // Add delete functionality
  const deleteBtn = transactionItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    transactionItem.remove();
    updateCalculations();
  });
}
// Function to update balance, income, and expense
function updateCalculations() {
  const amounts = document.querySelectorAll(".amount");
  let income = 0;
  let expense = 0;
  amounts.forEach((amoutEl) => {
    const amountText = amoutEl.textContent;
    const amountValue = parseFloat(amountText.replace("$", ""));
    if (amountText.startsWith("+")) {
      income += amountValue;
    } else {
      expense -= amountValue;
    }
  });
  const balance = income - expense;
  balanceDisplay.textContent = `$${balance.toFixed(2)}`;
  incomeDisplay.textContent = `$${income.toFixed(2)}`;
  expenseDisplay.textContent = `$${expense.toFixed(2)}`;
}

// Load transactions from localStorage on page load
window.addEventListener("load", () => {
  const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
    transactionList.innerHTML = storedTransactions;
    // Reattach delete event listeners
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
        const transactionItem = e.target.closest(".transaction");
        transactionItem.remove();
        updateCalculations();
      });
    });
    updateCalculations();
  }
});
