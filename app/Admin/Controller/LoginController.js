const Controller = require('../Controller');
const Auth = require('../../../libs/Middleware/Auth');
const Validator = require('../../../libs/Middleware/Validator');

class LoginController extends Controller {
    constructor() {
        super();
        this.auth = Auth;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.use('guest');
        this.router.get('/', this.getLogin.bind(this));
        this.router.post('/', this.postLogin.bind(this));
    }

    getLogin(req, res) {
        res.render('login');
    }
    postLogin(req, res, next) {
        try {
            let validate = new Validator(req.body, {
                username: 'required',
                password: 'required',
            });
            if (validate.fails()){
                res.status(422).json(validate.errors);
            }
            let key = 'username';
            if (this.auth.guard(this.user).attempt(req, key)){
                res.redirect('/admin/dashboard');
            } else {
                res.status(403).json('Invalid username or password');
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new LoginController().getRouter();
