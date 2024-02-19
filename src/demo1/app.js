require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/user/generatetoken", (req, res) => {
  let secret_key = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date.now(),
    id: 12,
  };

  let token = jwt.sign(data, secret_key);
  res.send(token);
});

app.get("/user/validate", (req, res) => {
  let token_header_key = process.env.TOKEN_HEADER_KEY;
  let secret_key = process.env.JWT_SECRET_KEY;
  try {
    let verified = jwt.verify(token_header_key, secret_key);
    if (verified) {
      return res.send("Verified");
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.status(401).send("Unauthorized", err.message);
  }
});
app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
