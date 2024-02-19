require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
let secret_key = process.env.JWT_SECRET_KEY;
const users = [
  {
    id: 1,
    username: "user1",
    password: "password1",
  },
  {
    id: 2,
    username: "user2",
    password: "password2",
  },
];

const authenticateJWT = (req, res, next) => {
  let token = process.env.TOKEN_DEMO2;
  if (token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden", token: token });
    }
    req.user = user;
    next();
  });
};

app.post("/user/login", (req, res) => {
  let { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid credentials", user: req.body });
  }
  const token = jwt.sign({ username, id: user.id }, secret_key, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () =>
  console.log(`Example app listening on port  http://localhost:${port}`)
);
