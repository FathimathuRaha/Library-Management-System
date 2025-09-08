import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [user, setUser] = useState(null); // user state
  const [loginError, setLoginError] = useState("");

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      showAlert("Failed to fetch books", "error");
    }
  };

  useEffect(() => {
    if (user) fetchBooks(); // fetch only if logged in
  }, [user]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  // Borrow book
  const borrowBook = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/books/${id}/borrow`);
      showAlert("Book borrowed successfully", "success");
      fetchBooks();
    } catch (err) {
      showAlert(err.response?.data?.message || "Error borrowing book", "error");
    }
  };

  // Return book
  const returnBook = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/books/${id}/return`);
      showAlert("Book returned successfully", "success");
      fetchBooks();
    } catch (err) {
      showAlert(err.response?.data?.message || "Error returning book", "error");
    }
  };

  // Handle login (dummy credentials)
  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === "user" && password === "1234") {
      setUser({ username });
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input name="username" type="text" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        {loginError && <p className="error">{loginError}</p>}
      </div>
    );
  }

  const availableBooks = books.filter((b) => b.availability);
  const borrowedBooks = books.filter((b) => !b.availability);
if (!user) {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input name="username" type="text" placeholder="Username" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {loginError && <p className="error">{loginError}</p>}
    </div>
  );
}


  return (
    <div className="App">
      <header className="App-header">
        <h1>Library Management</h1>
        <div className="logout-container">
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {alert.message && (
        <div className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"}`}>
          {alert.message}
        </div>
      )}

      <h2>Available Books</h2>
      <div className="books-container">
        {availableBooks.length ? (
          availableBooks.map((book) => (
            <div className="book-card" key={book._id}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>ISBN: {book.ISBN}</p>
              <button onClick={() => borrowBook(book._id)}>Borrow</button>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>

      <h2>Borrowed Books</h2>
      <div className="books-container">
        {borrowedBooks.length ? (
          borrowedBooks.map((book) => (
            <div className="book-card" key={book._id}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>ISBN: {book.ISBN}</p>
              <button onClick={() => returnBook(book._id)}>Return</button>
            </div>
          ))
        ) : (
          <p>No books borrowed</p>
        )}
      </div>
    </div>
  );
}

export default App;
