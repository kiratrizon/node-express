const app = require('./boot/start');
const path = require('path');
require('dotenv').config();

// your session here
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

const adminRouter = require('../app/Admin/Route/router');
const userRouter = require('../app/User/Route/router');
const apiRouter = require('../app/Api/Route/router');

app.use('/admin', adminRouter);

app.use('/', userRouter);

app.use('/api', apiRouter);

app.get('/debug', (req, res) => {
    if ((process.env.SESSION_DEBUG || 'false') === 'true') {
        return res.send(req.session.auth);
    }
    return res.status(403).send('Debug mode is disabled.');
});

module.exports = app;
