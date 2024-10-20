const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const DatabaseConnection = require('./database/database');
const db = new DatabaseConnection();

app.use(session({
    secret: process.env.MAIN_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,  }
}));

function isEmptyObject(obj) {
    return obj !== null && typeof obj === 'object' && Object.keys(obj).length === 0 && obj.constructor === Object;
}


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
    // req.session.auth.admin.isAuthenticated = false;
    // req.session.auth.admin.id = null;
    // req.session.auth.user.isAuthenticated = false;
    // req.session.auth.user.id = null;
    next();
});

app.set('view engine', 'ejs');

app.use(express.json());

const [adminRouter, adminGuest] = require('./app/Admin/Route/router');
const [userRouter, userGuest] = require('./app/User/Route/router');
const apiRouter = require('./app/Api/Route/router');

function ensureAuthenticated(role = 'user') {
    return (req, res, next) => {
        if (req.session.auth[role].isAuthenticated) {
            return next();
        }
        let path = role === 'user' ? '' : `/${role}`;
        return res.redirect(`${path}/login`);
    };
}

// Guest authentication middleware
function guestAuth(role = 'user') {
    return (req, res, next) => {
        if (!req.session.auth[role].isAuthenticated) {
            return next();
        }
        return res.redirect(`/${role}/dashboard`);
    };
}

app.use((req, res, next) => {
    if (req.path.startsWith('/admin')) {
        app.set('views', path.join(__dirname, 'app', 'Admin', 'View'));
    } else if (!req.path.startsWith('/api')) {
        app.set('views', path.join(__dirname, 'app', 'User', 'View'));
    }
    next();
});

app.use('/admin', guestAuth('admin'), adminGuest);
app.use('/admin', ensureAuthenticated('admin'), adminRouter);

// app.use('/', ensureAuthenticated('user'), userRouter);
// app.use('/', guestAuth('user'), userGuest);

app.use('/api', apiRouter);

app.get('/get-user', (req, res) => {
    res.send(req.session.auth);
});

module.exports = app;
