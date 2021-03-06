import express from "express";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserById } from "../models/controller.js";
const router = express.Router();

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Authentication Server Routes

// passport middle ware runs when the '/login' endpoint is called
passport.use(
  // creates local strategy constructor for passport to authenticate user
  new LocalStrategy(
    // usernameField => tells passport to look for username in 'emailAddress' in User object
    // passwordField => tells passport to look for password in 'password' in User object
    {
      usernameField: "emailAddress",
      passwordField: "password",
    },
    // function call from passport receives username and password from inputs on front end
    function (username, password, done) {
      // calls User model controller and finds user by email and compares 'usernameField' and 'passwordField' with User object
      findUserByEmail(username)
        .then((user) => {
          bcrypt.compare(password, user.password, function (err, result) {
            if (!user || !result) {
              done(null, false, {
                message: "Incorrect username/password.",
              });
              return;
            }
            done(null, user);
          });
        })
        .catch(done);
    }
  )
);

// passport middle ware creates a cookie and saves it in the browser
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
// passport middle ware checks if there is a cookie saved in the browser and returns logged in user
passport.deserializeUser(function (id, done) {
  findUserById(id)
    .then((user) => {
      if (!user) {
        done(new Error("email not found or it was deleted"));
        return;
      }
      done(null, user);
    })
    .catch(done);
});

// POST Endpoint || login endpoint, uses the passport middle above, to authenticate if username and password from log in matches user in database
router.post(
  "/login",
  passport.authenticate("local"),
  async function (req, res) {
    res.send(req.user.emailAddress);
  }
);

// GET endpoint || endpoint logs out user
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// GET endpoint || when endpoint is called checks for user cookie in browser and returns user if there is
router.get("/getLoggedInUser", async function (req, res) {
  res.send(req.user);
});

export default router;
