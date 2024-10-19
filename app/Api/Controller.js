const express = require('express');

class Controller {
  constructor(){
    this.router = express.Router();
    this.user = 'api';
  }
}

module.exports = Controller;