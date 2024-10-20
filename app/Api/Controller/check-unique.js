const Controller = require('../Controller');

class CheckUniqueController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/email', this.getCheckUniqueEmail.bind(this));
  }

  async getCheckUniqueEmail(req, res) {
    let get = req.query;
    
    try {
      let data = await req.db.runQuery(`SELECT ${get['key']} from ${get['table']} where ${get['key']} = ?`, [get['email']]);
      if (data){
        res.json({ isUnique: false })
      } else {
        res.json({ isUnique: true })
      }
    } catch {
      res.json({ message: 'Error' });
    }
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new CheckUniqueController().getRouter();
