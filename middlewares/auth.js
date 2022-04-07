const admin = require("../firebase");
const User = require("../modals/user");
exports.checkUser = async (req, res, next) => {
    try {
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        req.user = firebaseUser;
        next();
    } catch (err) {
        console.log(err)
        res.status(401).send("Invalid or expired token")
    }
}

exports.checkAdmin = async (req, res, next) => {
    try {
        const adminUser = await User.findOne({ email: req.user.email, role: "admin" }).exec()
        if (adminUser) {
            next();
        } else {
            res.status(401).send("You are not authorized to perform this action")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("Something wents wrong")
    }
}