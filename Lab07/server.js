// Student REST API (Lab Part D + F) with Task 3 (department filter)
// and Task 4 (validation)
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json()); // parse JSON request bodies into req.body

const DATA_FILE = "students.json";
let students = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

// Part F: write the in-memory array back to the file
function saveStudents() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), "utf8");
}

// Task 4: name and department must be non-empty strings
function isValidStudent(body) {
    if (!body) return false;
    const { name, department } = body;
    return (
        typeof name === "string" && name.trim() !== "" &&
        typeof department === "string" && department.trim() !== ""
    );
}

const VALIDATION_MESSAGE = "name and department are required as non-empty strings";

// GET all students
app.get("/students", (req, res) => {
    res.status(200).json(students);
});

// Task 3: GET students by department (e.g. /students/department/BSCS)
app.get("/students/department/:department", (req, res) => {
    const department = req.params.department.toLowerCase();
    const result = students.filter(
        s => s.department.toLowerCase() === department
    );
    res.status(200).json(result);
});

// GET one student by id
app.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json(student);
});

// POST: create a student
app.post("/students", (req, res) => {
    if (!isValidStudent(req.body)) {
        return res.status(400).json({ message: VALIDATION_MESSAGE });
    }

    const newId = students.length
        ? Math.max(...students.map(s => s.id)) + 1
        : 1;

    const newStudent = {
        id: newId,
        name: req.body.name.trim(),
        department: req.body.department.trim()
    };

    students.push(newStudent);
    saveStudents();
    return res.status(201).json(newStudent);
});

// PUT: update a student's name and department
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    if (!isValidStudent(req.body)) {
        return res.status(400).json({ message: VALIDATION_MESSAGE });
    }

    student.name = req.body.name.trim();
    student.department = req.body.department.trim();
    saveStudents();
    return res.status(200).json(student);
});

// DELETE: remove a student
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const [deletedStudent] = students.splice(index, 1);
    saveStudents();
    return res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});

// Error handler: malformed JSON body -> 400, anything else -> 500
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON in request body" });
    }
    return res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
