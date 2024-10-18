const express = require('express');
const path = require('path');
const app = express();
const DatabaseConnection = require('./database/database');
const db = new DatabaseConnection();

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    let [,r] = req.path.split('/');
    if (r === 'admin') {
        app.set('views', path.join(__dirname, 'app', 'Admin', 'View'));
    } else if (r === 'api') {
    } else {
        app.set('views', path.join(__dirname, 'app', 'User', 'View'));
    }
    req.db = db;
    next();
});

app.use(express.json());

const adminRouter = require('./app/Admin/Route/router');
const userRouter = require('./app/User/Route/router');
const apiRouter = require('./app/Api/Route/router');

app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/', userRouter);

module.exports = app;