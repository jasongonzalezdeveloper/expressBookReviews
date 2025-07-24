const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if( !username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.some(user => user.username === username)) {
    return res.status(400).json({message: "User already exists"});
  }

  if (!isValid(username)) {
    return res.status(400).json({message: "Invalid username format"});
  }
  
  users.push({username, password});
  return res.status(200).json({message: "User registered successfully"});
});

const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};
public_users.get('/',function (req, res) {
  return getBooks().then((books) => {
    res.send(JSON.stringify(books, null, 4));
  });
});

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({message: "Book not found"});
    }
  });
};
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then(book => {
      res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch(err => {
      res.status(404).json(err);
    });
});
  
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({message: "No books found for this author"});
    }
  });
};

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  getBooksByAuthor(author).then(filteredBooks => {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }).catch(err => {
    res.status(404).json(err);
  });
});


const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({message: "No books found for this title"});
    }
  });
};
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  getBooksByTitle(title).then(filteredBooks => {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }).catch(err => {
    res.status(404).json(err);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
      return res.status(404).json({message: "No reviews found for this book"});
  }
  return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;
