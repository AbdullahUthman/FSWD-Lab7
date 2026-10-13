// Lab assignment: Book Management REST API
// Express + books.json, with validation, status codes and file persistence
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = "books.json";
let books = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

// Extra credit: persist changes to books.json
function saveBooks() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2), "utf8");
}

// Returns an error message string, or null if the body is valid
function validateBook(body) {
    if (!body) return "Request body is required";

    const { title, author, price } = body;

    if (typeof title !== "string" || title.trim() === "") {
        return "title is required as a non-empty string";
    }
    if (typeof author !== "string" || author.trim() === "") {
        return "author is required as a non-empty string";
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        return "price is required as a number that is 0 or greater";
    }
    return null;
}

// GET /books : all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// GET /books/:id : one book or 404
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
});

// POST /books : create a book, return 201
app.post("/books", (req, res) => {
    const error = validateBook(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    const newId = books.length
        ? Math.max(...books.map(b => b.id)) + 1
        : 1;

    const newBook = {
        id: newId,
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        price: req.body.price
    };

    books.push(newBook);
    saveBooks();
    return res.status(201).json(newBook);
});

// PUT /books/:id : update a book or 404
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const error = validateBook(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    book.title = req.body.title.trim();
    book.author = req.body.author.trim();
    book.price = req.body.price;
    saveBooks();
    return res.status(200).json(book);
});

// DELETE /books/:id : delete a book or 404
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const [deletedBook] = books.splice(index, 1);
    saveBooks();
    return res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
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
    console.log(`Book API running at http://localhost:${PORT}`);
});
