const Model = require("../Main/Model");

class Subject extends Model {
    constructor() {
        super('subjects');
        this.setAlias(this.constructor.name);
    }
}

module.exports = Subject;
