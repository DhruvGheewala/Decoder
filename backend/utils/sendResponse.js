module.exports = (message, res, errorCode = 200) => {
    console.log(message);
    if(errorCode == 200) {
        res.status(200).json({
            message
          });
    }else{
        res.status(errorCode).json({
            error: message
        });
    }
  };