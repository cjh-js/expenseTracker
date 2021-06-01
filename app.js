const addForm = document.querySelector('.add-form');
const nameInput = document.querySelector('.name-input');
const moneyInput = document.querySelector('.money-input');
const historyWrap = document.querySelector('.history');
const total = document.querySelector('.total-money');
const incomeTotal = document.querySelector('.income-total');
const expenseTotal = document.querySelector('.expense-total');

let transaction = [];
let TRANSACTION_LS = 'transactions';

// Save Expense Info
function saveTransaction(){
    localStorage.setItem(TRANSACTION_LS, JSON.stringify(transaction));
}

// After Remove Thing
function updateBalance(){
    loadBalance();
    loadIncome();
    loadExpense();
}

// Delete History
function cleanTarget(id){
    const numberId = parseInt(id);
    transaction = transaction.filter(item => {
        return item.id !== numberId;
    });
}

function deleteHistory(e){
    const targetText = e.target.parentNode;
    const historyAll = targetText.parentNode;
    historyAll.removeChild(targetText);
    cleanTarget(targetText.id);
    saveTransaction();
    updateBalance();
}

// Get Expense Obj
function getExpenseObj(){
    const expenseObj = {
        name:nameInput.value,
        money:moneyInput.value,
        id:Math.ceil(Math.random()*99999)
    };
    return expenseObj;
}

// Get HTML Elements
function getWrap(){
    const wrap = document.createElement('div');
    wrap.classList.add('history-texts');
    return wrap;
}

function getDelBtn(){
    const delBtn = document.createElement('button');
    delBtn.innerText = '✖';
    delBtn.addEventListener('click', deleteHistory);
    return delBtn;
}

function getTextDiv(id){
    const text = document.createElement('div');
    const delBtn = getDelBtn();
    text.classList.add('texts');
    text.id = id;
    text.append(delBtn);
    return text;
}

function getHistoryName(){
    const name = document.createElement('div');
    return name;
}

// Get History
function getHistory(name, money, id){
    const wrap = getWrap();
    const text = getTextDiv(id);
    const historyName = getHistoryName();
    const historyMoney = document.createElement('div');
    historyName.innerText = name;

    if(money < 0){
        text.classList.add('negative');
        historyMoney.innerText = `${numberWithCommas(money)}`;
    } else{
        text.classList.add('positive');
        historyMoney.innerText = `+${numberWithCommas(money)}`;
    }

    text.append(historyName, historyMoney);
    wrap.append(text);
    historyWrap.append(wrap);
}

// After Submit
function submitExpense(e){
    e.preventDefault();

    const expenseObj = getExpenseObj();

    transaction.push(expenseObj);
    getHistory(expenseObj.name, expenseObj.money, expenseObj.id);
    updateBalance();
    saveTransaction();

    nameInput.value = '';
    moneyInput.value = '';
}

// Show Balance
function loadBalance(){
    const totalMoney = transaction.map(item => item.money
        ).reduce((total, money) => total += parseInt(money), 0);

    total.innerText = `$${numberWithCommas(totalMoney)}`;
}

function loadIncome(){
    const income = transaction.filter(item => item.money > 0
        ).reduce((income, item) => income += parseInt(item.money), 0);

    incomeTotal.innerText = `$${numberWithCommas(income)}`;
}

function loadExpense(){
    const expense = transaction.filter(item => item.money < 0
        ).reduce((income, item) => income += parseInt(item.money) * -1, 0);

    expenseTotal.innerText = `$${numberWithCommas(expense)}`;
}

// Load Data
function loadData(){
    transaction = JSON.parse(localStorage.getItem(TRANSACTION_LS)) || [];
}

// Restore Data
function restoreData(){
    transaction.forEach(item => {
        getHistory(item.name, item.money, item.id);
    });
    updateBalance();
}

// Show Number Clear
function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Event Listener
addForm.addEventListener('submit', submitExpense);
loadData();
restoreData();
