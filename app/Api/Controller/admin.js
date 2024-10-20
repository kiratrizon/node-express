const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../../../libs/Model/Admin');
const Validator = require('../../../libs/Middleware/Validator');

class AdminApi {
  constructor() {
    this.router = express.Router();
    this.adminModel = new Admin();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/create', this.createAdmin.bind(this));
  }

  async createAdmin(req, res) {
    const data = req.body;
    let rules = {
      username: 'required|unique:admins',
      email: 'required|email|unique:admins',
      password: 'required|min:6|confirmed',
    };
    let validate = new Validator(data, rules);
    const ruleKeys = Object.keys(rules);
    let newData = {};
    for (const key of ruleKeys) {
      newData[key] = data[key];
    }
    let fails = await validate.fails();
    if (fails) {
      res.status(400).json({ message: fails, inputOld: data });
    } else {
      try {
        const id = await this.adminModel.create(data);
        if (id) {
          res.status(201).json({ message: 'Admin created successfully.', id: id });
        } else {
          res.status(400).json({ message: 'Admin not created.' });
        }
      } catch (e) {
        res.status(500).json({ message: e.message });
      }
    }

  }

  getRouter() {
    return this.router; // Return the configured router
  }
}

module.exports = new AdminApi().getRouter();
