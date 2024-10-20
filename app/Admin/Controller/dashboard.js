const Controller = require('../Controller');

class DashboardController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getDashboard.bind(this));
  }

  getDashboard(req, res) {
    res.json({ message: 'this is Admin wew' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new DashboardController().getRouter();
