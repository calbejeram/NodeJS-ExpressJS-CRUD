const express = require('express');
const app = express();
const port = 5000;
const userRoutes = require('./routes/user.js');

app.get('/', (request, response) => {
    response.send('<html><body><h1>Hello Express JS</h1></body></html>')
});

app.get('/submit-data', (request, response) => {
    response.send('<html><body><h1>POST request called</h1></body></html>')
});

app.use(express.json());
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log('Server has started')
});