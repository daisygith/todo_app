const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const tasks = require('./tasks');

function error(err, req, res, next) {
    // log it
    if (!test) console.error(err.stack);

    // respond with 500 "Internal Server Error".
    res.status(500);
    res.send('Internal Server Error');
}

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/api/tasks', tasks.list);

app.post('/api/tasks', tasks.add);

app.put('/api/tasks/:id', tasks.update);

app.delete('/api/tasks/:id', tasks.delete);

app.use(error);

app.listen(port, () => {
    console.log(`TODO APP Server listening  on port ${port}`)
});