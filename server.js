const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 4500;

mongoose.connect('mongodb://127.0.0.1/restapi_login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());


const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
