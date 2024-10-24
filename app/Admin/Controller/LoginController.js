const Validator = require("../../../libs/Middleware/Validator");
const Controller = require("../Controller");

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
            error: req.flash("error")[0] || false,
            old: req.flash("old")[0] || false,
            success: req.flash("success")[0] || false,
        };
        res.render("index", data);
    }
    async postLogin(req, res) {
        try {
            let validate = await Validator.make(req.body, {
                username: "required",
                password: "required",
            });
            let fail = await validate.fails();
            if (fail) {
                req.flash("error", validate.errors);
                req.flash('old', validate.old);
                return res.redirect(req.auth().guard('admin').redirectFail());
            }
            let attempt = await req.auth().guard('admin').attempt({ username: req.body.username, password: req.body.password });
            if (attempt) {
                return res.redirect(req.auth().guard('admin').redirectAuth());
            }
            return res.redirect(req.auth().guard('admin').redirectFail());
        } catch (error) {
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new LoginController().getRouter();
