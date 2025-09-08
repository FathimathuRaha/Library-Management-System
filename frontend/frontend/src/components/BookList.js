import React, { useState, useEffect } from 'react';
import axios from 'axios'; // <- all imports at the top

const BookList = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/items');
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const borrowBook = async (id) => {
    try {
      await axios.put(`http://localhost:5000/items/borrow/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const returnBook = async (id) => {
    try {
      await axios.put(`http://localhost:5000/items/return/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div>
      {books.map((book) => (
        <div key={book._id} style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
          <h3>{book.name}</h3>
          <p>Quantity: {book.quantity}</p>
          <p>Price: ${book.price}</p>
          <p>Status: {book.available ? 'Available' : 'Borrowed'}</p>
          {book.available ? (
            <button onClick={() => borrowBook(book._id)}>Borrow</button>
          ) : (
            <button onClick={() => returnBook(book._id)}>Return</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookList; // <- only one export at the bottom
