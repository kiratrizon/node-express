const Model = require("../Main/Model");

class Admin extends Model {
    constructor() {
        super('admins');
        this.setAlias(this.constructor.name);
    }

    helloWorld() {
        console.log('Hello World');
    }
}

module.exports = Admin;