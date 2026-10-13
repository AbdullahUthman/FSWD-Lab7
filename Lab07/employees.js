// Task 2: read employees.json, display, add one, write back
const fs = require("fs");

const FILE = "employees.json";

// 1. Read the file (text) and convert it to a JavaScript array
const employees = JSON.parse(fs.readFileSync(FILE, "utf8"));

// 2. Display the employees
console.log("Employees before adding:");
console.table(employees);

// 3. Add a new employee (id = highest existing id + 1)
const newId = employees.length
    ? Math.max(...employees.map(e => e.id)) + 1
    : 1;

employees.push({
    id: newId,
    name: "Hassan Ali",
    role: "Backend Developer",
    salary: 110000
});

// 4. Convert back to JSON text and overwrite the file
fs.writeFileSync(FILE, JSON.stringify(employees, null, 2), "utf8");

console.log("\nEmployee added and file updated. Employees now:");
console.table(employees);
