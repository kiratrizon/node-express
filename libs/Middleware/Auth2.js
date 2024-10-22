const bcrypt = require('bcryptjs');
const service = require('../Service/AppServiceProvider');

class Auth {
    useType;
    constructor(){
    }
    guard(role){
        if (!role || !(role in service)) {
            throw new Error(`Please register ${role} first in libs/Service/AppServiceProvider.js`);
        }
        this.modelUsed = service[role];
        this.useType = role;
        return this;
    }

    attempt(){
        return (req, res, next) => {
            let newParams = {
                conditions: {
                }
            };
            let params = req.body;
            if (params.email && 'email' in params) {
                newParams.conditions.email = ['=', params.email];
            } else {
                newParams.conditions.username = ['=', params.username];
            }
            let user = this.modelUsed.find('first', newParams);
            if (!user) {
                res.status(403).json('hello world');
            }
            if (user && bcrypt.compare(params.password, user.password)) {
                req.session.auth[this.useType].isAuthenticated = true;
                req.session.auth[this.useType].id = user.id;
                res.status(201).json(true);
            } else {
                res.status(403).json('yeah');
            }
        }
    }
}

module.exports = new Auth();
