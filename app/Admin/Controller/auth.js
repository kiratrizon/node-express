const Controller = require('../Controller');

class AuthController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAuth.bind(this));
  }

  getAuth(req, res) {
    res.json({ message: 'this is Admin wew' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new AuthController().getRouter();
