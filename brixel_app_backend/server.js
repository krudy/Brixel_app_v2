const express = require('express');
const app = express();
const cors = require('cors');
const { port } = require('./config')

// MongoDB setup
require('./db/mongoose');

// cors 
app.use(cors());

// middleware to handle JSON 
app.use(express.json());

// test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// mount routes
app.use('/api', require('./routes/api'));

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
