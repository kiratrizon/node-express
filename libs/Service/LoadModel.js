class LoadModel {
    constructor() {
        this.model = null;
    }

    init(model){
        const Model = require(`../Model/${model}`);
        this.model = new Model();
        return this.model;
    }
}

module.exports = new LoadModel();