const app = require('./boot/start');
const path = require('path');
const fs = require('fs');

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

function checkViewPathExists(type, reqPath) {
    const viewPath = path.join(__dirname, '..', 'app', type, 'View', reqPath);

    return fs.existsSync(viewPath);
}

function view(type = 'User') {
    return (req, res, next) => {
        let reqPath = ucFirst(req.path.split('/')[1]);
        let viewPath;
        if (checkViewPathExists(type, reqPath)) {
            viewPath = path.join(__dirname, '..', 'app', type, 'View', reqPath);
        } else {
            viewPath = path.join(__dirname, '..', 'app', type, 'View', 'Defaults');
        }
        app.set('views', viewPath);
        next();
    };
}

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const adminRouter = require('../app/Admin/Route/router');
const userRouter = require('../app/User/Route/router');
const apiRouter = require('../app/Api/Route/router');

app.use('/admin', view('Admin'), adminRouter);

app.use('/', view(), userRouter);

app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});
app.get('/admin', (req, res) => {
    res.redirect('/admin/dashboard');
});

app.get('/debug', (req, res) => {
    if (true) {
        return res.send(req.session.auth);
    }
    return res.status(403).send('Debug mode is disabled.');
});

module.exports = app;
