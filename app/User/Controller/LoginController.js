const Controller = require('../Controller');

class LoginController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getLogin.bind(this));
  }

  getLogin(req, res) {
    res.json({ message: 'this is User' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new LoginController().getRouter();
