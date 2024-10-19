const User = require('../Model/User');
const Admin = require('../Model/Admin');
const services = {
    'user': new User(),
    'admin': new Admin(),
};

module.exports = services;