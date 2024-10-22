const Controller = require('../Controller');
const Auth = require('../../../libs/Middleware/Auth2');

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
    res.json({ message: 'this is Admin' });
  }
  postLogin(req, res, next) {
    try {
        // Call the attempt middleware
        this.auth.guard(this.user).attempt()(req, res, next);
    } catch (error) {
        // Handle any errors that occurred in the middleware
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

  getRouter() {
    return this.router;
  }
}

module.exports = new LoginController().getRouter();
