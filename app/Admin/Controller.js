const express = require('express');

class Controller {
  constructor(){
    this.router = express.Router();
    this.user = 'admin';
  }
}

module.exports = Controller;