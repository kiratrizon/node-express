const path = require('path');

const env = () => {
    const config = {
        database: 'sqlite',
        config: {
            mysql: {
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'node_app',
            },
            sqlite: {
                file: path.join(__dirname, './database/database.sqlite')
            }
        },

        /* input more constant here */
        debugger: 0,
    };
    return config;
};

const config = env();

module.exports = config;
