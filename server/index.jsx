const express = require("express")
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt")
const saltRounds = 10;

const app = express()

app.use(express.json());
app.use(
     cors({
          origin: ["http://localhost:3000"],
          methods: ["GET", "POST"],
          credentials: true,
     })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
     session({
          key: "userId",
          secret: "This is a secret key, which should be really secret and not guessable, So this is my secret ;)",
          resave: false,
          saveUninitialized: false,
          cookie: {
               expires: 60 * 60 * 24,
          },
     })
);

const db = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "",
     database: "surge"
});

app.post('/reg', (req, res) => {
     const fullname = req.body.fullname
     const email = req.body.email
     const username = req.body.username
     const password = req.body.password
     const c_password = req.body.c_password

     if (password != c_password) {
          res.send({ message: "Passwords do not match, Please try again" });
     } else if (password.length < 8) {
          res.send({ message: "Password should be minimum 8 character long, Please try again" });
     } else {
          db.query(
               "SELECT * FROM user WHERE username=?",
               username,
               (err, result) => {
                    if (result.length == 0) {
                         bcrypt.hash(password, saltRounds, (err, hash) => {
                              if (err) {
                                   res.send({ message: "Something went wrong, Please try again" });
                              }

                              db.query(
                                   "INSERT INTO USER(FullName,Email,Username,Password) VALUES(?,?,?,?)",
                                   [fullname, email, username, hash],
                                   (err, result) => {
                                        if (err) {
                                             console.log(err);
                                             res.send({ message: "Something went wrong, Please try again" });
                                        } else {
                                             res.send(result);
                                        }
                                   }
                              );
                         })
                    } else {
                         res.send({ message: "Username already exist, Please try another" });
                    }
               }
          );
     }
});

app.post('/edit', (req, res) => {
     const fullname = req.body.fullname
     const email = req.body.email
     const username = req.body.username
     const password = req.body.password

     db.query(
          "SELECT * FROM user WHERE username=?",
          username,
          (err, result) => {
               if (err) {
                    //res.send({ err: err });
                    res.send({ message: err });
               }

               if (result.length > 0) {
                    bcrypt.compare(password, result[0].Password, (error, response) => {
                         if (response) {
                              // req.session.user = result;
                              // console.log(req.session.user);
                              // res.send(result);
                              db.query(
                                   "UPDATE user SET FullName=?,Email=? WHERE Username=?",
                                   [fullname, email, username],
                                   (err, result) => {
                                        if (err) {
                                             //res.send({ err: err });
                                             res.send({ message: err });
                                        }
                                        req.session.user[0].FullName = fullname;
                                        req.session.user[0].Email = email;
                                        res.send(req.session.user);
                                   }
                              );
                         } else {
                              res.send({ message: "Password Incorrect, Please try again" });
                         }
                    });
               } else {
                    res.send({ message: "Something wrong, Please try again" });
               }

          }
     );
});

app.get("/login", (req, res) => {
     if (req.session.user) {
          res.send({ loggedIn: true, user: req.session.user });
     } else {
          res.send({ loggedIn: false });
     }
});

app.post('/login', (req, res) => {
     const username = req.body.username
     const password = req.body.password

     db.query(
          "SELECT * FROM user WHERE username=?",
          username,
          (err, result) => {
               if (err) {
                    res.send({ err: err });
               }

               //console.log(result.length);
               if (result.length > 0) {
                    bcrypt.compare(password, result[0].Password, (error, response) => {
                         if (response) {
                              req.session.user = result;
                              req.session.user[0].Password = "Dont search for password here :)";
                              console.log(req.session.user);
                              res.send(result);
                         } else {
                              res.send({ message: "Username/Password Incorrect" });
                         }
                    });
               } else {
                    res.send({ message: "User doesn't exist" });
               }
          }
     );
});

app.post('/logout', (req, res) => {
     req.session.destroy();
     res.send({ loggedIn: false });
});

app.listen(3001, () => {
     console.log("running server")
})