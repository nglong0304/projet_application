// All the routes in page home will be here
var express = require("express");
var bodyParser = require('body-parser')
const session = require('express-session');
const app = express();
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const pool = require('../database/database.js');

router.use(session({
    name: 'sid',
    resave: false,
    saveUnitialized: false,
    secret: 'projet_application',
    cookie: {
        maxAge: 10 * 60 * 1000,
        sameSite: true,
    }
}));

router.get("/", async function(req, res) {
    const { userId } = req.session;

    if (!(typeof(userId) == 'undefined'))
    {
        if (!(typeof(userId.username) == 'undefined'))
            res.redirect("/prof");
    }

    var data = await pool.query('SELECT * FROM SECTION');

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

router.get("/logout", async function(req, res) {
    const { userId } = req.session

    req.session.destroy();
    res.redirect("../");
});


router.post("/login", urlencodedParser, async function(req, res) {
    var data = req.body
    var data_sql = await pool.query("SELECT * FROM USERS")
    var input_password = await pool.query("SELECT MD5(?) as md5", data.password)
    data.password = input_password[0].md5

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
                const { userId } = req.session;
                username = data.username;
                var passwd = data_sql[i].USER_PASSWORD;
                var id_user = data_sql[i].ID_USER;
                var user = { username, passwd, id_user };
                req.session.userId = user;
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

router.get("/prof", async function(req, res) {
    const { userId } = req.session;

    if (typeof(userId) == 'undefined')
        res.redirect("../");
    if (typeof(userId.username) == 'undefined')
        res.redirect("../");
    var data_sql = await pool.query("SELECT * FROM USERS")
    var input_password = await pool.query("SELECT MD5(?) as md5", userId.passwd)
    for (var i = 0; i < data_sql.length; i++) 
        if (userId.username == data_sql[i].USER_NAME)
            if (userId.passwd != data_sql[i].USER_PASSWORD)
                res.redirect("/logout");

    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE WHERE ID_USER='+userId.id_user)
    res.render("home/prof", {
        userId: userId,
        data_section: data_section,
        data_module: data_module
    })
})

router.get("/prof/module/:p1", async function(req, res) {
    var param = req.params.p1
    const { userId } = req.session;

    if (typeof(userId) == 'undefined')
        res.redirect("../");
    if (typeof(userId.username) == 'undefined')
        res.redirect("../");
    var data_sql = await pool.query("SELECT * FROM USERS")
    var input_password = await pool.query("SELECT MD5(?) as md5", userId.passwd)
    for (var i = 0; i < data_sql.length; i++) 
        if (userId.username == data_sql[i].USER_NAME)
            if (userId.passwd != data_sql[i].USER_PASSWORD)
                res.redirect("/logout");

    var data_module = await pool.query('SELECT * FROM MODULE');
    if (param < 0 || param >= data_module.length || userId.id_user != data_module[param].ID_USER)
        res.redirect("/prof");
    res.render("home/prof_show_module", {
        userId:userId,
        data_module: data_module
    });
});

router.get("/admin", async function(req, res) {
    var id = req.query.id;
    res.render("home/admin")
})

router.get("/delegue", async function(req, res) {
    var id = req.query.id;
    var data = await pool.query("SELECT ID_RESP,REPONSE,NAME_MODULE,QUESTION,TYPE FROM REPONSES JOIN MODULE USING(ID_MODULES) LEFT JOIN QUESTIONS USING(ID_QUESTION) WHERE VALIDE=0")

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

    var data_ret = await pool.query("SELECT ID_RESP,REPONSE,NAME_MODULE,QUESTION,TYPE FROM REPONSES JOIN MODULE USING(ID_MODULES) LEFT JOIN QUESTIONS USING(ID_QUESTION) WHERE VALIDE=0")

    res.render("home/delegue", {
        data: data_ret
    })
})


router.get("/admin/comments", async function(req, res) {
    var id = req.query.id;
    var data = await pool.query("SELECT ID_RESP,REPONSE,NAME_MODULE,QUESTION,TYPE FROM REPONSES JOIN MODULE USING(ID_MODULES) LEFT JOIN QUESTIONS USING(ID_QUESTION) WHERE VALIDE=0")

    res.render("home/delegue", {
        data: data
    })
})

router.post("/admin/comments", urlencodedParser, async function(req, res) {
    var data = req.body
    var sql_query_update = "UPDATE REPONSES SET VALIDE=1 WHERE ID_RESP=?"
    var sql_query_del = "DELETE FROM REPONSES WHERE ID_RESP=?"
    if (data.ret_value == "Accept") {
        var ret = await pool.query(sql_query_update, data.id_resp)
    } else if (data.ret_value == "Refuse") {
        var ret = await pool.query(sql_query_del, data.id_resp)
    }

    var data_ret = await pool.query("SELECT ID_RESP,REPONSE,NAME_MODULE,QUESTION,TYPE FROM REPONSES JOIN MODULE USING(ID_MODULES) LEFT JOIN QUESTIONS USING(ID_QUESTION) WHERE VALIDE=0")

    res.render("home/delegue", {
        data: data_ret
    })
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

router.get("/questionnaire/:p1", async function(req, res) {
    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE')
    var data_users = await pool.query('SELECT * FROM USERS')
    var data_question = await pool.query('SELECT * FROM QUESTIONS')
    var data_quest_mod = await pool.query('SELECT * FROM QUESTION_MODULE')
    var param = req.params.p1
    const { userId } = req.session

    if (typeof(userId) == 'undefined')
        res.redirect("../");
    else if (userId.param != param)
        res.redirect("../");
    else if (!(data_module[param].CLE == userId.key_user))
        res.redirect("../");

    res.render("home/question", {
        data_section: data_section,
        param: param,
        data_module: data_module,
        data_users: data_users,
        data_question: data_question,
        data_quest_mod: data_quest_mod
    });
});

router.post("/questionnaire/:p1", urlencodedParser, async function(req, res) {
    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE')
    var data_question = await pool.query('SELECT * FROM QUESTIONS')
    var data_quest_mod = await pool.query('SELECT * FROM QUESTION_MODULE')
    var data_reponse = await pool.query('SELECT * FROM REPONSES')
    var data_max_reponse = await pool.query('SELECT MAX(ID_RESP) AS max FROM REPONSES')
    var param = req.params.p1
    var reponses = req.body
    const { userId } = req.session

    if (param < 0 || param >= data_module.length)
        res.redirect("home");

    if (typeof(userId) == 'undefined')
        res.redirect("../");
    else if (userId.param != param)
        res.redirect("../");
    else if (!(data_module[param].CLE == userId.key_user))
        res.redirect("../");

    var input_name = "";
    var count = 1;
    for (var i = 0; i < data_quest_mod.length; i++) {
        if (data_quest_mod[i].ID_MODULES == param) {
            input_name = "reponse_" + i.toString();
            pool.query('INSERT INTO REPONSES VALUE(' + (data_max_reponse[0].max + count) + ',' + data_quest_mod[i].ID_QUESTION + ',"' + reponses[input_name] + '",' + data_quest_mod[i].ID_MODULES + ', 1, 0)');
            count++;
        }
    }
    req.session.destroy();
    res.render("home/valid_reponse", {
        data_section: data_section,
        data_module: data_module,
        param: param
    });
});

router.get("/admin/add_user", async function(req, res) {

    res.render("home/add_user", {
        warn_username: false,
        warn_password: false
    })
})

router.post("/admin/add_user", urlencodedParser, async function(req, res) {
    var data = req.body
    var data_users = await pool.query('SELECT * FROM USERS')
    var warn_username = false
    var warn_password = false

    var password_md5 = await pool.query("SELECT MD5(?) as md5", data.password)
    password_md5 = password_md5[0].md5


    for (var i = 0; i < data_users.length; i++)
        if (data.username == data_users[i].USER_NAME)
            warn_username = true

    if (data.password != data.confirm_password)
        warn_password = true

    if (!warn_username && !warn_password) {
        pool.query('INSERT INTO USERS VALUE(' + (data_users.length) + ',"' + data.username + '","' + password_md5 + '",' + data.type + ')');
    }


    res.render("home/add_user", {
        warn_username: warn_username,
        warn_password: warn_password
    })


})

router.get("/module/:p1", async function(req, res) {
    var data_module = await pool.query('SELECT * FROM MODULE')
    var param = req.params.p1

    res.render("home/ask_key", {
        data_module: data_module,
        param: param
    });
});

router.post("/module/:p1", urlencodedParser, async function(req, res) {
    var data_module = await pool.query('SELECT * FROM MODULE')
    var param = req.params.p1
    var reponses = req.body
    var key_user = await pool.query("SELECT MD5(?) as md5", reponses.key)
    key_user = key_user[0].md5
    const { userId } = req.session

    if (param < 0 || param >= data_module.length)
        res.redirect("home");
    if (data_module[param].CLE == key_user) {
        var clef = { param, key_user };
        req.session.userId = clef;
        res.redirect("../questionnaire/" + param)
    } else {
        res.redirect("../module/" + param)
    }
});

router.get("/source", function(req, res) {
    res.render("home/source");
});

module.exports = router;