const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let reviewList = books[req.params.isbn].reviews;
  let user = req.session.authorization.user
  let reviewIndex = 1; // default to 1 in case of empty review list
  let found = false;
  // check to see if the user left a review already
  for(let i=1; i<Object.keys(reviewList).length; i++) {
    if(reviewList[i].user == user) {
        found = true;
        reviewIndex = i;
        break;
    }
  }
  if(!found) {
    reviewIndex = Object.keys(reviewList).length + 1;
  }
  reviewList[reviewIndex] = {"user": user, "review": req.body.review}; // add/edit review

  return res.status(200).json({message: "Review added to ISBN " + req.params.isbn + " with review: " + req.body.review});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
