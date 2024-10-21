const Controller = require('../Controller');
const Auth = require('../../../libs/Middleware/Auth');

class LoginController extends Controller {
  constructor() {
    super();
    this.auth = new Auth();
    this.initializeRoutes();
    this.auth.setUser(this.user);
  }

  initializeRoutes() {
    this.use('guest');
    this.router.get('/', this.getLogin.bind(this));
    this.router.post('/', this.postLogin.bind(this));
  }

  getLogin(req, res) {
    res.json({ message: 'this is Admin' });
  }
  async postLogin(req, res) {
    let params = req.body;
    let data = await this.auth.attempt(params);
    if (data.success) {
      req.session.auth[this.user].isAuthenticated = this.auth.isAuthenticated();
      req.session.auth[this.user].id = this.auth.id();
      res.status(201).json({ message: 'Login successfully.', data: data.auth_data });
    } else {
      res.status(403).json(data);
    }
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new LoginController().getRouter();
