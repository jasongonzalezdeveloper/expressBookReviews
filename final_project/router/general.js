const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const id = req.params.isbn;
  //Check if the book exists in the database 
  if (!books[id]) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).send(JSON.stringify(books[id],null,4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (filteredBooks.length === 0) {
    return res.status(404).json({message: "No books found for this author"});
  }
  return res.status(200).send(JSON.stringify(filteredBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  if (filteredBooks.length === 0) {
    return res.status(404).json({message: "No books found for this title"});
  }
  return res.status(200).send(JSON.stringify(filteredBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
