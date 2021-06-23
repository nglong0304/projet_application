// All the routes in page home will be here
var express = require("express");
var bodyParser = require('body-parser')
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const pool = require('../database/database.js');

router.get("/", async function(req, res) {
    var data = await pool.query('SELECT * FROM SECTION')

    res.render("home/index", {
        data: data
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

    var data_sql = await pool.query("SELECT * FROM USERS")


    var flag = false

    for (var i = 0; i < data_sql.length; i++) {
        if (data.username == data_sql[i].USER_NAME && data.password == data_sql[i].USER_PASSWORD) {

            var id = encodeURIComponent(data_sql[i].ID_USER);
            var username = encodeURIComponent(data_sql[i].USER_NAME);
            if (data_sql[i].TYPE == 0) {
                res.redirect("/?user=" + username + "&id=" + id)
                flag = true
                break
            }

            if (data_sql[i].TYPE == 1) {
                res.redirect("/delegue/?user=" + username + "&id=" + id)
                flag = true
                break
            }

            if (data_sql[i].TYPE == 2) {
                res.redirect("/prof/?user=" + username + "&id=" + id)
                flag = true
                break
            }

        }
    }
    if (!flag) {
        res.render("home/login");
    }

})

router.get("/prof", async function(req, res) {
    var id = req.query.id;
    res.render("home/prof")
})

router.get("/admin", async function(req, res) {
    var id = req.query.id;
    res.render("home/admin")
})

router.get("/delegue", async function(req, res) {
    var id = req.query.id;
    var data = await pool.query("SELECT * FROM REPONSES JOIN MODULE USING(ID_MODULES) WHERE VALIDE=0")

    res.render("home/delegue", {
        data: data
    })
})

router.post("/delegue", urlencodedParser, async function(req, res) {
    var data = req.body
    var sql_query_update = "UPDATE REPONSES SET VALIDE=1 WHERE ID_RESP=?"
    var sql_query_del = "DELETE FROM REPONSES WHERE ID_RESP=?"
    if (data.ret_value == "Accept") {
        var ret = await pool.query(sql_query_update, data.id_resp)
    } else if (data.ret_value == "Refuse") {
        var ret = await pool.query(sql_query_del, data.id_resp)
    }

    var data_ret = await pool.query("SELECT * FROM REPONSES JOIN MODULE USING(ID_MODULES) WHERE VALIDE=0")

    res.render("home/delegue", {
        data: data_ret
    })
})

router.get("/logout", async function(req, res) {
    res.redirect("home")
})

router.get("/section/:p1", async function(req, res) {
    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE')
    var data_users = await pool.query('SELECT * FROM USERS')
    var param = req.params.p1

    res.render("home/section", {
        data_section: data_section,
        param: param,
        data_module: data_module,
        data_users: data_users
    });
});

router.get("/module/:p1", async function(req, res) {
    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE')
    var data_users = await pool.query('SELECT * FROM USERS')
    var data_question = await pool.query('SELECT * FROM QUESTIONS')
    var data_quest_mod = await pool.query('SELECT * FROM QUESTION_MODULE')
    var param = req.params.p1

    res.render("home/question", {
        data_section: data_section,
        param: param,
        data_module: data_module,
        data_users: data_users,
        data_question: data_question,
        data_quest_mod: data_quest_mod
    });
});

router.post("/module/:p1", urlencodedParser, async function(req, res) {
    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE')
    var data_question = await pool.query('SELECT * FROM QUESTIONS')
    var data_quest_mod = await pool.query('SELECT * FROM QUESTION_MODULE')
    var data_reponse = await pool.query('SELECT * FROM REPONSES')
    var param = req.params.p1
    var reponses = req.body

    if (param < 0 || param >= data_module.length)
        res.redirect("home");
    var input_name = "";
    var count=0;
    for (var i=0; i < data_quest_mod.length; i++)
    {
        if (data_quest_mod[i].ID_MODULES == param)
        {
            input_name = "reponse_" + i.toString();
            pool.query('INSERT INTO REPONSES VALUE('+(data_reponse.length+count)+','+data_quest_mod[i].ID_QUESTION+',"'+reponses[input_name]+'",'+data_quest_mod[i].ID_MODULES+', 1, 0)');
            count++;
        }
    }

    res.render("home/valid_reponse", {
        data_section: data_section,
        data_module: data_module,
        param: param
    });
});

module.exports = router;