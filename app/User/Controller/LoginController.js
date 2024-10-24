const Controller = require("../Controller");
const Validator = require("../../../libs/Middleware/Validator");

class LoginController extends Controller {
	constructor() {
		super();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.use("guest");
		this.router.get("/", this.getLogin.bind(this));
		this.router.post("/", this.postLogin.bind(this));
	}

	getLogin(req, res) {
		let data = {
			title: "Login",
			error: req.flash("error")[0] || {},
			old: req.flash("old")[0] || {},
		};
		res.render("index", data);
	}
	postLogin(req, res, next) {
		try {
			let validate = Validator.make(req.body, {
				username: "required",
				password: "required",
			});
			if (validate.fails()) {
				req.flash("error", validate.errors);
				req.flash('old', validate.old);
				return res.redirect(req.auth().redirectFail());
			}
			if(req.auth().attempt({ username: req.body.username, password: req.body.password })){
				return res.redirect(req.auth().redirectAuth());
			}
			return res.redirect(req.auth().redirectFail());
		} catch (error) {
			return res.status(500).json({ error: "Internal server error." });
		}
	}

	getRouter() {
		return this.router;
	}
}

module.exports = new LoginController().getRouter();
