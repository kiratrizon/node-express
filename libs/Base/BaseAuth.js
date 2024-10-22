const Core = require("../Main/Core");

class BaseAuth {
    authenticated = false;
    userId = null;
    useType;
    choice;
    queryType;
    typeQuery = {};
    constructor() {
        // this.useType = type;
    }
    attempt(type = 'first', options = {}) {
        let user;
        if (this.typeQuery.driver === 'database'){
            this.queryType = new Core(this.typeQuery.table);
            user = this.queryType.attemptFind(type, options);
        } else {
            user = this.typeQuery.model.find(type, options);
        }
        return !user ? null : user;
    }
}

module.exports = BaseAuth;