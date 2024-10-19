const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const DatabaseConnection = require('./database/database');
const db = new DatabaseConnection();
const Auth = require('./libs/Middleware/Auth');

function ensureAuthenticated(role = 'user') {
    return (req, res, next) => {
        if (!req.session[role]){
            req.session[role] = new Auth();
        }
        if (req.session[role].isAuthenticated()){

        }
    };
}

function guestAuth(role = 'user') {
    return (req, res, next) => {
        req.auth.guarded(role);
        if (!req.auth.isAuthenticated()) {
            return next();
        }
        if (role === 'admin') {
            return res.redirect('/admin/dashboard');
        }
        return res.redirect('/dashboard');
    };
}

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.MAIN_KEY, // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.json());

app.use((req, res, next) => {
    if (!req.session['user']){
        req.session['user'] = new Auth();
    }
    if (!req.session['admin']){
        req.session['admin'] = new Auth('admin');
    }
    if (!req.db){
        req.db = db;
    }
    next();
});

app.use((req, res, next) => {
    // Set the views directory dynamically
    if (req.path.startsWith('/admin')) {
        app.set('views', path.join(__dirname, 'app', 'Admin', 'View'));
    } else if (!req.path.startsWith('/api')) {
        app.set('views', path.join(__dirname, 'app', 'User', 'View'));
    }
    next();
});

const [adminRouter, adminGuest] = require('./app/Admin/Route/router');
const [userRouter, userGuest] = require('./app/User/Route/router');
const apiRouter = require('./app/Api/Route/router');

// Middleware for admin routes
app.use('/admin', ensureAuthenticated('admin'), adminRouter);
app.use('/admin', guestAuth('admin'), adminGuest);

// Middleware for user routes
app.use('/', ensureAuthenticated('user'), userRouter);
app.use('/', guestAuth('user'), userGuest);

app.use('/api', apiRouter);


module.exports = app;
