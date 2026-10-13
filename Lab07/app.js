// Task 1: use the calculator module
const calc = require("./calculator");

console.log("Addition:", calc.add(10, 5));
console.log("Subtraction:", calc.subtract(10, 5));
console.log("Multiplication:", calc.multiply(10, 5));
console.log("Division:", calc.divide(10, 5));

// Division by zero throws an Error, so catch it to avoid crashing
try {
    console.log("Division:", calc.divide(10, 0));
} catch (err) {
    console.log("Error:", err.message);
}
