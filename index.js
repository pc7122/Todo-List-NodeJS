const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

//local modules
const connectDb = require('./components/db');
const router = require('./routes/route');
const passport = require('passport');
const flash = require('express-flash');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', router);

app.set('view engine', 'ejs');

connectDb()
    .then(() => {
        console.log('database connected.');
        app.listen(3000, () => console.log('server is listening...'));
    })
    .catch(err => console.log(err))
