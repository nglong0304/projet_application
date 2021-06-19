var express = require("express");

var router = express.Router();


router.get("/", function(req, res) {
    res.render("page_accueil");
});

module.exports = router;