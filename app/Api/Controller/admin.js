const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../../../libs/Model/Admin');

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
    const data = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };

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

  getRouter() {
    return this.router; // Return the configured router
  }
}

module.exports = new AdminApi().getRouter();
