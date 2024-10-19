const bcrypt = require('bcryptjs');
const service = require('../Service/AppServiceProvider');

class Auth {
    #authenticated = false;
    #userId = null;
    useType;
    constructor(usertype = 'user') {
        if (!type || !(type in service)) {
            throw new Error(`Please register ${type} first in libs/Service/AppServiceProvider.js`);
        }
        this.useType = usertype;
    }

    async attempt(params = {}) {
        let newParams = {
            conditions: {
            }
        };
        if (params.email && 'email' in params) {
            newParams.conditions.email = params.email;
        } else {
            newParams.conditions.username = params.username;
        }
        let user = await service[this.useType].find('first', params);
        if (!user) {
            return {error: 'User not found.', input: params, success: false};
        }
        if (user && bcrypt.compareSync(params.password, user.password)) {
            this.#authenticated = true;
            this.#userId = user.id;
            return {auth_data: user, success: true};
        } else {
            return {error: 'Password is incorrect.', input: params, success: false};
        }
    }

    isAuthenticated() {
        return this.#authenticated && !this.#userId;
    }
    id() {
        return this.#userId;
    }

    logout() {
        this.#authenticated = false;
        this.#userId = null;
    }
}

module.exports = Auth;
