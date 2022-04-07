const User=require("../modals/user")
exports.createOrUpdateUser = async (req, res) => {
    const { name, picture, email } = req.user;
    const user = await User.findOneAndUpdate({ email }, { name, picture }, { new: true });
    if (user) {
        res.json(user); 
    } else {
        const newUser = await new User(req.user).save();
        res.json(newUser)
    }
}

exports.currentUser = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();
    res.json(user);
}
