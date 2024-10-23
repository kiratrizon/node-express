require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const flash = require('connect-flash');
const Configure = require('../../libs/Service/Configure');
const Auth = require('../../libs/Middleware/Auth');


app.use(session({
    secret: process.env.MAIN_KEY || 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.set('view engine', 'ejs');
app.use((req, res, next) => {
    res.locals.config = (value) => Configure.read(value);
    res.locals.auth = () => new Auth(req);
    req.auth = () => new Auth(req);
    next();
});


module.exports = app;