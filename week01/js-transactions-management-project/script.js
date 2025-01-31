const transactionType = document.getElementById('type');
const transactionAmount = document.getElementById('amount');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const transactionList = document.getElementById('transaction-list');
const totalIncomes = document.getElementById('total-incomes');
const totalExpenses = document.getElementById('total-expenses');
const balance = document.getElementById('balance');

const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function displayTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${transaction.type == 'income' ? 'Income:' : 'Expense:'} ${transaction.amount}</span>
            <button onclick="deleteTransaction(${index})">X</button>
        `;
        transactionList.appendChild(li);
    });
};

addTransactionBtn.addEventListener('click', () => {
    const type = transactionType.value;
    const amount = parseFloat(transactionAmount.value);

    if(isNaN(amount) || amount <= 0) {
        alert('Invalid transaction amount. Please type again');
        return;
    }

    transactions.push({ type, amount });

    localStorage.setItem('transactions', JSON.stringify(transactions));

    displayTransactions();
    calculateTotals();

    transactionAmount.value='';
});

function calculateTotals() {
    const totalIncomesAmount = transactions
        .filter(transaction => transaction.type == 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    
    const totalExpensesAmount = transactions
        .filter(transaction => transaction.type == 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    totalIncomes.textContent = totalIncomesAmount;
    totalExpenses.textContent = totalExpensesAmount;
    balance.textContent = totalIncomesAmount - totalExpensesAmount;
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions();
    calculateTotals();
}

displayTransactions();
calculateTotals();