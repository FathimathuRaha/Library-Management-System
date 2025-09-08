import React, { useEffect, useState } from "react";
import "./BooksList.css"; // We'll create this CSS for styling

function BooksList() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      alert("Failed to fetch books");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const borrowBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/books/${id}/borrow`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchBooks();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to borrow book");
    }
  };

  const returnBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/books/${id}/return`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchBooks();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to return book");
    }
  };

  return (
    <div className="books-container">
      <h1>Library Books</h1>
      <div className="books-grid">
        {books.map((book) => (
          <div className="book-card" key={book._id}>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>ISBN:</strong> {book.ISBN}</p>
            <p>
              <strong>Status:</strong>{" "}
              {book.availability ? "Available" : "Borrowed"}
            </p>
            {book.availability ? (
              <button onClick={() => borrowBook(book._id)} className="borrow-btn">
                Borrow
              </button>
            ) : (
              <button onClick={() => returnBook(book._id)} className="return-btn">
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksList;
