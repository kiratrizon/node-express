const Admin = require("../libs/Model/Admin");

const constant = {
    default: {
        guard: "user"
    },
    guards:{
        user: {
            driver: 'session',
            provider: 'users',
        },
        admin: {
            driver: 'session',
            provider: 'admins',
        }
    },
    providers:{
        users: {
            driver: 'database',
            table: 'users',
        },
        admins: {
            driver: 'database',
            table: 'admins',
        }
    }
};

module.exports = constant;