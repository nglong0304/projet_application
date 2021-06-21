// All the routes in page home will be here
var express = require("express");
var bodyParser = require('body-parser')
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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

router.post("/login", urlencodedParser, async function(req, res) {
    var data = req.body

    var username = await pool.query('SELECT USER_NAME FROM USERS')
    var password = await pool.query('SELECT USER_PASSWORD FROM USERS')
    var user_type = await pool.query('SELECT TYPE FROM USERS')

    var flag = false

    for (var i = 0; i < username.length; i++) {
        if (data.username == username[i].USER_NAME && data.password == password[i].USER_PASSWORD) {

            if (user_type[i].TYPE == 0) {
                res.redirect("/admin")
                flag = true
                break
            }

            if (user_type[i].TYPE == 1) {
                res.redirect("/delegue")
                flag = true
                break
            }

            if (user_type[i].TYPE == 2) {
                res.redirect("/prof")
                flag = true
                break
            }

        }
    }
    if (!flag) {
        res.render("home/login");
    }

})


module.exports = router;