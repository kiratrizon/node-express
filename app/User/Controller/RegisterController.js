const Controller = require('../Controller');

class RegisterController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getRegister.bind(this));
  }

  getRegister(req, res) {
    res.json({ message: 'this is User' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new RegisterController().getRouter();
