// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const cors = require('cors');
const bodyParser = require('body-parser');


mongoose.connect("mongodb://localhost/myassetnew", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/api/test', (req, res) => {
  res.send('Hello Welcome to asset management !');
});

app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
