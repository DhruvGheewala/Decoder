module.exports = (message, res, errorCode = 200) => {
    if (200 <= errorCode && errorCode <= 299)
        return res.status(errorCode).send({ result: message });
    res.status(errorCode).send({ err: message });
};