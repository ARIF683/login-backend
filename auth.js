const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    try {
        const token = await  req.headers.authorization.split(" ")[1];

        const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

        const user = await decodedToken;

        request.user = user;

        next();
    } catch (error) {
        res.send(400).json({error: new Error("Invalid request")})
    }
}