// Whenever you need a module - use require and get that module variable
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('assets'));

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to Mongoose
mongoose.connect('mongodb://localhost/videojot-dev', {
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Middleware - this middle ware will be called on every request. This req.name is available on every route. This is how you can put user from session(after login) to here and use it wherever needed.
app.use(function (req, res, next) {
    req.name = 'Swapnil';
    next();
});

// Handle Bars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index Route - Reason for get is coz we are doing a GET request (Going to a Route or typing a URL is a get request) - we can use POST when we are submitting a form. (Similarly for PUT and DELETE)
// app.get('/', (req, res) => {
//     res.send('INDEX');
// });

// Index Route with Handlebars
app.get('/', (req, res) => {
    const title = 'Welcome User';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    console.log(req.name);
    res.render('about');
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process Form
app.post('/ideas', (req, res) => {
    // console.log(req.body);
    // res.send('ok');
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        res.send('passed');
    }
});

const port = 5000;

app.listen(port, () => {
    // ES6 way of doing console.log('Server starterd on port ' + port);
    console.log(`Server starterd on port ${port}`);
});

// Template renderers
// 1. HandleBar.js - Easy to use, uses regular html.
// 2. ejs - Embedded JS
// 3. pug - doesn't use regular html - there is no ending tags, just works with indentation
