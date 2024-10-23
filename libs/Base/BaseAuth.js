const Core = require("../Main/CoreClone");

class BaseAuth {
    provider;
    #forFind;
    constructor(){

    }

    attempt(params){
        let user = null;
        if (this.provider.driver === 'database'){
            this.#forFind = new Core(this.provider.table);
            user = this.#forFind.find(params);
        }else if (this.provider.driver === 'eloquent'){
            user = this.provider.model.find('first', params);
        }
        return user;
    }
}

module.exports = BaseAuth;