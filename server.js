require('dotenv').config();
const connectDB = require('./config/connectDB');
const express = require('express')
const cors = require('cors');
const routes = require('./routes/index')

const app = express();
const PORT = 5000

connectDB();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({ extended: true })
);

app.use(routes)
app.get("/", function (req, res) {
  res.status(200).json("it's works..");
});
app.use(function (req, res) {
  res.status(404).json("Not Found");
});
app.use(function(err, req, res) {
  console.log('err', err.stack);
  res.json({
    status: 3,
    message: 'Sorry can\'t response your request right now, please try again later',
    error: 'internal error'
  });
});

app.listen(PORT, () => console.log('server running on port 5000...'));