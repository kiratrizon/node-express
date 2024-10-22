const fs = require('fs');
const path = require('path');

class Configure {
    #path;
    constructor() {
        this.#path = path.join(__dirname, '..', '..', 'config');
    }

    read(name) {
        let filePathArr = name.split('.');
        let objectKey = filePathArr.pop();
        const constant = require(path.join(this.#path, ...filePathArr));
        return constant[objectKey];
    }
    get(name){
        const constant = require(path.join(this.#path, ...name.split('.')));
        return constant;
    }
}

module.exports = new Configure();
