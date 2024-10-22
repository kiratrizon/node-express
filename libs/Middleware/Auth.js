const bcrypt = require('bcryptjs');
const service = require('../Service/AppServiceProvider');

class Auth {
    authenticated = false;
    userId = null;
    useType;
    model;
    constructor(type) {
        if (type && type !== null) {
            this.setUser(type);
        }
    }

    setUser(type) {
        if (!type || !(type in service)) {
            throw new Error(`Please register ${type} first in libs/Service/AppServiceProvider.js`);
        }
        this.useType = type;
        this.model = service[type];
    }
    attempt(params = {}) {
        let newParams = {
            conditions: {
            }
        };
        if (params.email && 'email' in params) {
            newParams.conditions.email = ['=', params.email];
        } else {
            newParams.conditions.username = ['=', params.username];
        }
        let user = this.model.find('first', newParams);
        if (!user) {
            return {error: 'User not found.', input: params, success: false};
        }
        if (user && bcrypt.compareSync(params.password, user.password)) {
            this.authenticated = true;
            this.userId = user.id;
            return {auth_data: user, success: true};
        } else {
            return {error: 'Password is incorrect.', input: params, success: false};
        }
    }

    isAuthenticated() {
        return this.authenticated;
    }
    id() {
        return this.userId;
    }

    logout() {
        this.authenticated = false;
        this.userId = null;
    }
    user() {
        return this.model.find('first', {conditions: {id: this.userId}});
    }
}

module.exports = Auth;
