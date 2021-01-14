const jwt = require('jsonwebtoken');
module.exports = (user) => {
    const jwtToken = jwt.sign({
        email: user.email,
        _id: user._id
    }, process.env.SECRETKEY, {
        expiresIn: "24h"
    });
    return jwtToken;
}