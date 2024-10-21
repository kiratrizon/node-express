const express = require('express');

class BaseController {
    allowedAuths = ['auth', 'guest'];
    constructor() {
        this.router = express.Router();
    }

    // authentications
    auth(role){
        return (req, res, next)=>{
            if (req.session.auth[role].isAuthenticated) {
                next();
                return;
            }
            res.redirect(`${role === 'user' ? '' : `/${role}`}/login`);
        }
    }
    guest(role){
        return (req, res, next)=>{
            if (!req.session.auth[role].isAuthenticated) {
                next();
                return;
            }
            res.redirect(`${role === 'user' ? '' : `/${role}`}/dashboard`);
        }
    }
    // end of auitentications
}

module.exports = BaseController;