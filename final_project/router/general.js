const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulating async call
        return res.status(200).json(books);
    }
    catch (error) {
        return res.status(404).json({message: "Error retriving books: " + error})
    }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulating async call
    res.send(books[isbn]);
  }
  catch (error) {
    return res.status(500).json({message: "error retrieving book by ISBN: "+ error})
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  let bookList = [];
  for(let i=1; i<Object.keys(books).length; i++) {
    if(books[i].author == author) {
        bookList.push(books[i]);
    }
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulating async call
    if(bookList.length > 0) {
        res.send(bookList);
      }
      else {
        return res.status(404).json({message: "Author not found: " + author});
      }
  }
  catch (error) {
    return res.status(500).json({message: "error retrieving book by author: "+ error})
  }
  
  
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  let bookList = [];
  for(let i=1; i<Object.keys(books).length; i++) {
    if(books[i].title == title) {
        bookList.push(books[i]);
    }
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulating async call
    if(bookList.length > 0) {
        res.send(bookList);
      }
      else {
        return res.status(404).json({message: "Title not found: " + title});
      }
  }
  catch (error) {
    return res.status(500).json({message: "error retrieving book by title: "+ error})
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
