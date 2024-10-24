// ensure that all keys are in lowercase
const constant = {
    default: {
        guard: "user"
    },
    guards: {
        user: {
            driver: 'session',
            provider: 'users',
        },
        admin: {
            driver: 'session',
            provider: 'admins',
        }
    },
    providers: {
        users: {
            driver: 'database',
            table: 'users',
            passed: '/dashboard',
            failed: '/login',
        },
        admins: {
            driver: 'database',
            table: 'admins',
            passed: '/admin/dashboard',
            failed: '/admin/login',
        }
    },
};

module.exports = constant;