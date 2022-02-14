const router = require("express").Router();
const bcrypt = require("bcrypt");

const saltRounds = 5;



const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router
  .route("/signup")
  .get((req, res) => {
    res.render("auth");
  })

  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.render("signup", { errorMessage: "All filds are required" });
    }

    User.findOne({ username }).then((user) => {
      if (user && user.username) {
        res.render("signup", { errorMessage: "User already taken!" });
        throw new Error("Validation error");
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPwd = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashedPwd }).then(() =>
        res.redirect("/")
      );
    });
  });

  router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })

  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.render("login", { errorMessage: "All filds are required" });
      throw new Error("Validation error");
    }

    User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", { errorMessage: "Incorrect credentials!" });
        throw new Error("Validation error");
      }

      const isPwCorrect = bcrypt.compareSync(password, user.password);

      if (isPwCorrect) {
        req.session.currentUserId = user._id
    res.redirect("/profile")
      } else {
        res.render("login", { errorMessage: "Incorrect credentials!" });
      }
    })
    .catch((error) => console.log(error));



  })



module.exports = router;
