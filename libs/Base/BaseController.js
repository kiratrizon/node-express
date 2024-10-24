const express = require('express');

class BaseController {
    allowedAuths = ['auth', 'guest'];
    data = {};
    constructor() {
        this.router = express.Router();
    }

    // authentications
    auth(role) {
        return (req, res, next) => {
            if (req.session.auth[role].isAuthenticated) {
                next();
                return;
            }
            return res.redirect(`${role === 'user' ? '' : `/${role}`}/login`);
        }
    }
    guest(role) {
        return (req, res, next) => {
            if (!req.session.auth[role].isAuthenticated) {
                next();
                return;
            }
            return res.redirect(`${role === 'user' ? '' : `/${role}`}/dashboard`);
        }
    }
    // end of auitentications
    set(key, value) {
        this.data[key] = value;
    }
}

module.exports = BaseController;