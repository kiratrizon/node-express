class LoadModel {
    constructor() {
    }

    init(model){
        const Model = require(`../Model/${model}`);
        returnModel = new Model();
        return returnModel;
    }
}

module.exports = new LoadModel();