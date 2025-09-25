const express = require('express');
const app = express();
const { port } = require('./config')


// MongoDB setup
require('./db/mongoose');

// middleware to handle JSON 
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World')
  })

//mount routes
app.use('/api', require('./routes/api'));

app.listen(port);
console.log(`server listening on port ${port}`);