require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const DatabaseConnection = require('../database/database');
const db = new DatabaseConnection();
const adminRouter = require('../app/Admin/Route/router');
const userRouter = require('../app/User/Route/router');
const apiRouter = require('../app/Api/Route/router');
const Configure = require('../libs/Service/Configure');

app.use(session({
    secret: process.env.MAIN_KEY || 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,  }
}));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
    if (!req.session['auth']) {
        req.session['auth'] = {};
    }

    if (!req.session['auth']['user']) {
        req.session['auth']['user'] = {
           isAuthenticated: false,
           id: null,
        };
    }
    if (!req.session['auth']['admin']) {
        req.session['auth']['admin'] = {
            isAuthenticated: false,
            id: null,
        };
    }

    req.db = db;
    next();
});


app.use((req, res, next) => {
    // req.session.auth.admin.isAuthenticated = true;
    // req.session.auth.admin.id = 1;
    // req.session.auth.user.isAuthenticated = false;
    // req.session.auth.user.id = null;
    next();
});

app.use((req, res, next) => {
    if (req.path.startsWith('/admin')) {
        app.set('views', path.join(__dirname, '..', 'app', 'Admin', 'View'));
    } else if (!req.path.startsWith('/api')) {
        app.set('views', path.join(__dirname, '..', 'app', 'User', 'View'));
    }
    next();
});

app.use(userRouter);

function ensureAuthenticated(role = 'user') {
    return (req, res, next) => {
        if (req.session.auth[role].isAuthenticated) {
            next();
            return;
        }
        let path = role === 'user' ? '' : `/${role}`;
        res.redirect(`/guest-${role}/login`);
    };
}

function guestAuth(role = 'user') {
    return (req, res, next) => {
        if (!req.session.auth[role].isAuthenticated) {
            next();
            return;
        }
        let path = role === 'user' ? '' : `/${role}`;
        res.redirect(`${path}/dashboard`);
    };
}

app.use('/admin', adminRouter);

app.use('/user', userRouter);

app.use('/api', apiRouter);

app.get('/get-user', (req, res) => {
    res.send(req.session.auth);
});

module.exports = app;
