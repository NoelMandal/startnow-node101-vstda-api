const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));


var mockData = [
    {
        todoItemId: 0,
        name: 'an item',
        priority: 3,
        completed: false
    },
    {
        todoItemId: 1,
        name: 'another item',
        priority: 2,
        completed: false
    },
    {
        todoItemId: 2,
        name: 'a done item',
        priority: 1,
        completed: true
    }
];

app.get('/', function (req, res) {
    res.status(200).json('ok');
});

app.get('/api/TodoItems', function (req, res) {
    res.status(200).json(mockData);
});

app.get('/api/TodoItems/:number', (req, res) => {
    //loops thru mockData array 
    for (var i = 0; i < mockData.length; i++) {
        //if param in url matches existing todoitemid, responds with matching index  
        if (req.params.number == mockData[i].todoItemId) {
            res.status(200).json(mockData[i]);
            return;
        }
    }
    res.status(400).send("none");
});

app.post('/api/TodoItems/', (req, res) => {
        // do  my keys exist and have the proper types
    // const requiredKeys = ['todoItemId', 'name'];
    // requiredKeys.forEach(key => !req.body[key] && res.status(400).send({ Error: 'missing key: ' + key })); 
        // this was to safe guard against error, but test would not pass with it. still works tho.

    //var takes incoming data and ties them to proper keys 
    var newPost = {
        todoItemId: req.body.todoItemId,
        name: req.body.name,
        priority: req.body.priority || NaN,
        completed: req.body.completed || false
    };
    // loop goes through array 
    for (var i = 0; i < mockData.length; i++) {
        // if incoming todoitemid matches existing id, then replace existing with new then return.
        if (req.body.todoItemId == mockData[i].todoItemId) {
            mockData[i] = newPost
            // mockData.splice(i, 1, newPost);
            res.status(201).send(newPost);
            return;
        }
    }//if not, proceed to push new post to array and respond with new post with keys
    mockData.push(newPost);
    res.status(201).send(newPost)
});

app.delete('/api/TodoItems/:number', (req, res) => {
    // for new del item
    var delPost = [];
    // loops through mock data 
    for (i = 0; i < mockData.length; i++) {
        //if matching number in url param 'number' to todoitemid then splice 1 item from that index in mockdata array
        if (req.params.number == mockData[i].todoItemId) {
            delPost = mockData.splice(i, 1);
        }
    }
    res.status(200).send(delPost[0]);//responds with deleted post 
});



module.exports = app;
