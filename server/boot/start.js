const express = require('express');
const path = require('path');
const session = require('express-session');
// const SQLiteStore = require('connect-sqlite3')(session);
const flash = require('connect-flash');
const Configure = require('../../libs/Service/Configure');
const Auth = require('../../libs/Middleware/Auth');

const app = express();

app.use(session({
    // store: new SQLiteStore({
    //     db: path.join('sessions.sqlite'),
    //     dir: 'database',
    // }),
    secret: '272b1a3a2b5c03402b70d18fa93555fcc1d53c583b32258b8ae5bf4be6414d2e339232704e2270fe30bcf1860bb68e507c304ae4d49024d52c4cbc8871d38b2d',
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
