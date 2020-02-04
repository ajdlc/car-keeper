const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        // Make sure the token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        // Make sure the user exists
        if (!user) {
            throw new Error("User does not exist")
        }

        req.user = user;
        req.token = token;

        next();
        
    } catch (e) {
        res.status(401).send({ error: "Please authenticate." })
    }
}

module.exports = auth;