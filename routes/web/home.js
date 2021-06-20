// All the routes in page home will be here
var express = require("express");

var router = express.Router();



router.get("/", function(req, res) {
    res.render("home/index");
});

router.get("/home", function(req, res) {
    res.render("home/home");
});

router.get("/about", function(req, res) {
    res.render("home/about");
});

router.get("/login", function(req, res) {
    res.render("home/login");
});

module.exports = router;