
const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;

function updateDisplay() {
    display.value = current;
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? "Error" : a / b;
        default:
            return b;
    }
}

function formatResult(number) {
    if (number === "Error") return number;
    if (!Number.isFinite(number)) return "Error";

    return String(Number(number.toPrecision(10)));
}

function enterNumber(value) {
    if (current === "Error" || resetNext) {
        current = value === "." ? "0." : value;
        resetNext = false;
    } else if (value === ".") {
        if (!current.includes(".")) {
            current += ".";
        }
    } else {
        current = current === "0" ? value : current + value;
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    if (operator && !resetNext) {
        const result = calculate(
            Number(previous),
            Number(current),
            operator
        );

        current = formatResult(result);
        updateDisplay();

        if (current === "Error") {
            previous = null;
            operator = null;
            resetNext = true;
            return;
        }
    }

    previous = current;
    operator = nextOperator;
    resetNext = true;
}

function showResult() {
    if (operator === null || previous === null) return;

    current = formatResult(
        calculate(
            Number(previous),
            Number(current),
            operator
        )
    );

    previous = null;
    operator = null;
    resetNext = true;
    updateDisplay();
}

function clearCalculator() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
    updateDisplay();
}

function deleteNumber() {
    if (resetNext || current === "Error") {
        current = "0";
        resetNext = false;
    } else {
        current = current.length > 1
            ? current.slice(0, -1)
            : "0";
    }

    updateDisplay();
}

function changeSign() {
    if (current === "Error") return;

    current = formatResult(-Number(current));
    updateDisplay();
}

function percentage() {
    if (current === "Error") return;

    current = formatResult(Number(current) / 100);
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            if (["+", "-", "*", "/"].includes(value)) {
                chooseOperator(value);
            } else if (value === "%") {
                percentage();
            } else {
                enterNumber(value);
            }
        }

        if (action === "clear") clearCalculator();
        if (action === "delete") deleteNumber();
        if (action === "equals") showResult();
        if (action === "sign") changeSign();
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        enterNumber(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        showResult();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});
