const bcrypt = require('bcryptjs');
const Configure = require('../Service/Configure');
const BaseAuth = require('../Base/BaseAuth');
class Auth extends BaseAuth {
    constructor(type) {
        super();
        if (type && type !== null) {
            this.guard(type);
        }
    }

    guard(type) {
        if (type && !(type in Configure.read('auth.guards'))){
            throw new Error(`Please register ${type} first in config/auth.js in guards`);
        }
        this.useType = type;
        this.typeQuery = Configure.read('auth.providers')[Configure.read('auth.guards')[type].provider];
        return this;
    }
    attempt(req, key = ''){
        if (key === ''){
            throw new Error('Column of model/database is required');
        }
        let data = {};
        data['conditions'] = {
            [key]: ['=', req.body[key]]
        };
        let user = super.attempt('first', data);
        if (!user){
            return false;
        }
        if (bcrypt.compareSync(req.body.password, user.password)){
            req.session.auth[this.useType].isAuthenticated = true;
            req.session.auth[this.useType].id = user.id;
            return true;
        }
        return false;
    }
    logout(req){
        req.session.auth[this.useType].isAuthenticated = false;
        req.session.auth[this.useType].id = null;
    }
}

module.exports = new Auth(Configure.read('auth.default').guard);
