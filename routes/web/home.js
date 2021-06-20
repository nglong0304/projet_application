// All the routes in page home will be here
var express = require("express");

var router = express.Router();
const pool = require('../database/database.js');


router.get("/", async function(req, res) {
    var ID_MODULES = await pool.query('SELECT ID_MODULES FROM MODULE')
    var ID_USER = await pool.query('SELECT ID_USER FROM MODULE')
    var NAME_MODULE = await pool.query('SELECT NAME_MODULE FROM MODULE')
    var DESCRIPTION = await pool.query('SELECT DESCRIPTION FROM MODULE')
    var CLE = await pool.query('SELECT CLE FROM MODULE')
    var MOYEN_NOTE = await pool.query('SELECT MOYEN_NOTE FROM MODULE')

    res.render("home/index", {
        ID_MODULES: ID_MODULES,
        ID_USER: ID_USER,
        NAME_MODULE: NAME_MODULE,
        DESCRIPTION: DESCRIPTION,
        CLE: CLE,
        MOYEN_NOTE: MOYEN_NOTE
    });
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