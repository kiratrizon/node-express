const Core = require('./Core');

class Model extends Core {
    constructor(tableName) {
        super(tableName);
    }
    setAlias(alias) {
        super.setAlias(alias);
    }

    async find(type = 'all', options) {
        console.log(options);
        return await super.find(type, options);
    }

}

module.exports = Model;