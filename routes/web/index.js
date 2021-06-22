var express = require("express");

var router = express.Router();

router.use(function(req,res, next){
    res.locals.currentUser = req.query.user;
    next();
});

router.use("/", require("./home"));


module.exports = router;