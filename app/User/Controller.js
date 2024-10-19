const express = require('express');

class Controller {
  constructor(){
    this.router = express.Router();
    this.user = 'user';
  }
}

module.exports = Controller;