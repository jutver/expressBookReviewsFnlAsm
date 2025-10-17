const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });
  res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });
  res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10: Get all books using async callback function
public_users.get('/async', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 600);
  });

  getBooks.then((bks) => {
    res.send(JSON.stringify(bks, null, 4));
  });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 600);
  });

  getBookByISBN
    .then((book) => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Task 12: Get book details based on Author using async-await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  
  const getBooksByAuthor = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let booksByAuthor = [];
        let keys = Object.keys(books);
        keys.forEach((key) => {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        });
        resolve(booksByAuthor);
      }, 600);
    });
  };

  try {
    const booksByAuthor = await getBooksByAuthor();
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 13: Get book details based on Title using async-await
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  
  const getBooksByTitle = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let booksByTitle = [];
        let keys = Object.keys(books);
        keys.forEach((key) => {
          if (books[key].title === title) {
            booksByTitle.push(books[key]);
          }
        });
        resolve(booksByTitle);
      }, 600);
    });
  };

  try {
    const booksByTitle = await getBooksByTitle();
    res.send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

module.exports.general = public_users;
