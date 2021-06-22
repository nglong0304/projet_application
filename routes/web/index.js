var express = require("express");

var router = express.Router();

router.use(function(req,res, next){
    res.locals.currentUser = req.query.user;
    res.locals.currentId = req.query.id;
    next();
    console.log(res.locals.currentId);
});

router.use("/", require("./home"));


module.exports = router;