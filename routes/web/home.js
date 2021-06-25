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
        maxAge: 30 * 60 * 1000,
        sameSite: true,
    }
}));

//GET and POST for PAGE ACCUEIL
router.get("/", async function(req, res) {
    const { userId } = req.session;

    if (!(typeof(userId) == 'undefined')) {
        if (!(typeof(userId.type) == 'undefined')) {
            var type_user = userId.type
            if (!(typeof(userId.type) == 'undefined') && userId.type == 0)
                res.redirect("/admin/comments");
            if (!(typeof(userId.type) == 'undefined') && userId.type == 2)
                res.redirect("/prof");
            if (!(typeof(userId.type) == 'undefined') && userId.type == 1)
                res.redirect("/delegue");
        } else {
            req.session.destroy();
            var type_user = null
            var data = await pool.query('SELECT * FROM SECTION')

            res.render("home/index", {
                data: data,
                type_user: type_user
            });
        }
    } else {
        var type_user = null
        var data = await pool.query('SELECT * FROM SECTION')

        res.render("home/index", {
            data: data,
            type_user: type_user
        });
    }
});

router.get("/home", function(req, res) {
    res.render("home/home", {
        type_user: null
    });
});

router.get("/about", function(req, res) {
    const { userId } = req.session;
    if (!(typeof(userId) == 'undefined')) {
        if (!(typeof(userId.type) == 'undefined')) {
            var type_user = userId.type
        } else
            var type_user = null
    } else
        var type_user = null
    res.render("home/about", {
        type_user: type_user
    });
});


router.get("/logout", async function(req, res) {
    req.session.destroy();
    res.redirect("/")
});


router.get("/login", function(req, res) {
    res.render("home/login", {
        type_user: null
    });
});

router.post("/login", urlencodedParser, async function(req, res) {
    const { userId } = req.session
    var data = req.body
    var data_sql = await pool.query("SELECT * FROM USERS")
    var input_password = await pool.query("SELECT MD5(?) as md5 ", data.password)
    data.password = input_password[0].md5

    var flag = false

    for (var i = 0; i < data_sql.length; i++) {
        if (data.username == data_sql[i].USER_NAME && data.password == data_sql[i].USER_PASSWORD) {

            var id = encodeURIComponent(data_sql[i].ID_USER);
            var username = encodeURIComponent(data_sql[i].USER_NAME);
            if (data_sql[i].TYPE == 0) {
                const { userId } = req.session;
                username = data.username;
                var passwd = data_sql[i].USER_PASSWORD;
                var id_user = data_sql[i].ID_USER;
                var type = 0;
                var user = { username, passwd, id_user, type };
                req.session.userId = user;
                res.redirect("/admin/comments/?user=" + username + "&id=" + id)
                flag = true
                break
            }

            if (data_sql[i].TYPE == 1) {
                const { userId } = req.session;
                username = data.username;
                var passwd = data_sql[i].USER_PASSWORD;
                var id_user = data_sql[i].ID_USER;
                var type = 1;
                var user = { username, passwd, id_user, type };
                req.session.userId = user;
                res.redirect("/delegue/?user=" + username + "&id=" + id)
                flag = true

                break
            }

            if (data_sql[i].TYPE == 2) {
                const { userId } = req.session;
                username = data.username;
                var passwd = data_sql[i].USER_PASSWORD;
                var id_user = data_sql[i].ID_USER;
                var type = 2;
                var user = { username, passwd, id_user, type };
                req.session.userId = user;
                res.redirect("/prof")
                flag = true
                break
            }

        }
    }
    if (!flag) {
        res.render("home/login", {
            type_user: null
        });
    }

});

//GET and POST for PROF

router.get("/prof", async function(req, res) {
    const { userId } = req.session;

    if (typeof(userId) == 'undefined')
        res.redirect("../");
    else if (typeof(userId.username) == 'undefined')
        res.redirect("../");
    else {
        var data_sql = await pool.query("SELECT * FROM USERS")
        var input_password = await pool.query("SELECT MD5(?) as md5", userId.passwd)
        for (var i = 0; i < data_sql.length; i++)
            if (userId.username == data_sql[i].USER_NAME)
                if (userId.passwd != data_sql[i].USER_PASSWORD)
                    res.redirect("/logout");

        var data_section = await pool.query('SELECT * FROM SECTION')
        var data_module = await pool.query('SELECT * FROM MODULE WHERE ID_USER=' + userId.id_user)
        res.render("home/prof", {
            userId: userId,
            data_section: data_section,
            data_module: data_module,
            type_user: userId.type
        })
    }

});

router.get("/prof/module/:p1", async function(req, res) {
    var param = req.params.p1
    const { userId } = req.session;

    if (typeof(userId) == 'undefined')
        res.redirect("../");
    else if (typeof(userId.username) == 'undefined')
        res.redirect("../");
    else {
        var data_sql = await pool.query("SELECT * FROM USERS")
        var input_password = await pool.query("SELECT MD5(?) as md5", userId.passwd)
        for (var i = 0; i < data_sql.length; i++)
            if (userId.username == data_sql[i].USER_NAME)
                if (userId.passwd != data_sql[i].USER_PASSWORD)
                    res.redirect("/logout");

        var data_module = await pool.query('SELECT * FROM MODULE');

        if (param < 0 || param >= data_module.length || userId.id_user != data_module[param].ID_USER)
            res.redirect("/prof");

        var data_question = await pool.query('SELECT * FROM QUESTIONS')
        var data_quest_mod = await pool.query('SELECT * FROM QUESTION_MODULE WHERE ID_MODULES=' + param)
        var data_reponse = await pool.query('SELECT * FROM REPONSES WHERE ID_MODULES=' + param)

        res.render("home/prof_show_module", {
            userId: userId,
            data_module: data_module,
            param: param,
            data_question: data_question,
            data_quest_mod: data_quest_mod,
            data_reponse: data_reponse,
            type_user: userId.type
        });
    }
});


router.get("/prof/module/:p1/:p2", async function(req, res) {
    var id_module = req.params.p1;
    var id_question = req.params.p2;
    const { userId } = req.session;

    if (typeof(userId) == 'undefined')
        res.redirect("../../");
    else if (typeof(userId.username) == 'undefined')
        res.redirect("../../");
    else {
        var data_sql = await pool.query("SELECT * FROM USERS")
        var input_password = await pool.query("SELECT MD5(?) as md5", userId.passwd)
        for (var i = 0; i < data_sql.length; i++)
            if (userId.username == data_sql[i].USER_NAME)
                if (userId.passwd != data_sql[i].USER_PASSWORD)
                    res.redirect("/logout");

        var data_module = await pool.query('SELECT * FROM MODULE');

        if (id_module < 0 || id_module >= data_module.length || userId.id_user != data_module[id_module].ID_USER)
            res.redirect("/prof");

        var data_reponse = await pool.query('SELECT * FROM REPONSES WHERE ID_MODULES=' + id_module + ' AND ID_QUESTION=' + id_module)
        var data_question = await pool.query('SELECT * FROM QUESTIONS')

        res.render("home/prof_show_reponses", {
            userId: userId,
            data_reponse: data_reponse,
            data_question: data_question,
            id_question: id_question,
            id_module: id_module,
            type_user: userId.id_user
        });
    }
});

//GET and POST for DELEGUE
router.get("/delegue", async function(req, res) {

    const { userId } = req.session;
    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            res.redirect("../");
        } else if (userId.type != 1) {
            res.redirect("/");
        } else {
            var type_user = userId.type
            var data = await pool.query("SELECT ID_RESP,REPONSE,NAME_MODULE,QUESTION,TYPE FROM REPONSES JOIN MODULE USING(ID_MODULES) LEFT JOIN QUESTIONS USING(ID_QUESTION) WHERE VALIDE=0")

            res.render("home/delegue", {
                data: data,
                userId: userId,
                type_user: type_user
            })

        }
    } else {
        res.redirect("/")
    }

});

router.post("/delegue", urlencodedParser, async function(req, res) {
    const { userId } = req.session;
    var type_user = userId.type
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
        data: data_ret,
        userId: userId,
        type_user: type_user
    })
});

router.get("/prof/profil", async function(req, res) {
    const { userId } = req.session;

    if (typeof(userId) == 'undefined')
        res.redirect("../../");
    else if (typeof(userId.username) == 'undefined')
        res.redirect("../../");
    else {
        var data_sql = await pool.query("SELECT * FROM USERS")
        var input_password = await pool.query("SELECT MD5(?) as md5", userId.passwd)
        for (var i = 0; i < data_sql.length; i++)
            if (userId.username == data_sql[i].USER_NAME)
                if (userId.passwd != data_sql[i].USER_PASSWORD)
                    res.redirect("/logout");

        res.render("home/prof_profile", {
            userId: userId,
            type_user: userId.type
        });
    }
});

router.post("/prof/profil", urlencodedParser, async function(req, res) {
    var data = req.body
    const { userId } = req.session

    if (typeof(userId) == 'undefined')
        res.redirect("../../");
    else if (typeof(userId.username) == 'undefined')
        res.redirect("../../");
    else {
        var data_sql = await pool.query("SELECT * FROM USERS")
        var input_password = await pool.query("SELECT MD5(?) as md5", userId.passwd)
        for (var i = 0; i < data_sql.length; i++)
            if (userId.username == data_sql[i].USER_NAME)
                if (userId.passwd != data_sql[i].USER_PASSWORD)
                    res.redirect("/logout");

        if (data.password == data.cpassword) {
            var pass = await pool.query("SELECT MD5(?) as md5", data.password);
            var sql_query_update = "UPDATE USERS SET USER_PASSWORD='" + pass[0].md5 + "' WHERE ID_USER=?";
            var ret = await pool.query(sql_query_update, userId.id_user);
            res.redirect("../..");
        } else
            res.redirect("");
    }
});


router.get("/section/:p1", async function(req, res) {
    const { userId } = req.session;

    if (!(typeof(userId) == 'undefined')) {

        if (!(typeof(userId.type) == 'undefined')) {
            var type_user = userId.type
        } else
            var type_user = null
    } else
        var type_user = null

    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE')
    var data_users = await pool.query('SELECT * FROM USERS')
    var param = req.params.p1

    res.render("home/section", {
        data_section: data_section,
        param: param,
        data_module: data_module,
        data_users: data_users,
        type_user: type_user
    });
});

router.get("/questionnaire/:p1", async function(req, res) {
    const { userId } = req.session;
    if (!(typeof(userId) == 'undefined')) {
        if (!(typeof(userId.type) == 'undefined')) {
            var type_user = userId.type
        } else
            var type_user = null
    } else
        var type_user = null

    var data_section = await pool.query('SELECT * FROM SECTION')
    var data_module = await pool.query('SELECT * FROM MODULE')
    var data_users = await pool.query('SELECT * FROM USERS')
    var data_question = await pool.query('SELECT * FROM QUESTIONS')
    var data_quest_mod = await pool.query('SELECT * FROM QUESTION_MODULE')
    var param = req.params.p1

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
        data_quest_mod: data_quest_mod,
        type_user: type_user
    });
});

router.post("/questionnaire/:p1", urlencodedParser, async function(req, res) {
    const { userId } = req.session;
    if (!(typeof(userId) == 'undefined')) {
        if (!(typeof(userId.type) == 'undefined')) {
            var type_user = userId.type

        } else {
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
            if (reponses.note >= 0 && reponses.note <= 10) {
                pool.query('INSERT INTO REPONSES VALUE(' + (data_max_reponse[0].max + count) + ', NULL,"' + reponses.note + '",' + param + ', 2, 1)');
                var data_moyen = await pool.query('SELECT * FROM REPONSES WHERE ID_MODULES=' + param + ' AND TYPE=2');
                var moyenne = 0;
                count = 0;
                for (var i = 0; i < data_moyen.length; i++) {
                    moyenne = moyenne + parseFloat(data_moyen[i].REPONSE);
                    count++;
                }
                if (count > 0)
                    moyenne = moyenne / count;
                await pool.query("UPDATE MODULE SET MOYEN_NOTE=? WHERE ID_MODULES=?", [moyenne, param]);
            }
            req.session.destroy();
            res.render("home/valid_reponse", {
                data_section: data_section,
                data_module: data_module,
                param: param,
                type_user: type_user
            });
            var type_user = null

        }
    } else {
        var type_user = null
        res.redirect("../");
    }
});

// GET and POST for ADMIN

router.get("/admin/list_prof", async function(req, res) {

    const { userId } = req.session;
    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            res.redirect("../");
        } else if (userId.type != 0) {
            res.redirect("/");
        } else {
            var type_user = userId.type

            if (type_user == 0) {
                var data_prof = await pool.query('SELECT * FROM USERS WHERE TYPE = 2');

                res.render("home/list_prof", {
                    data: data_prof,
                    type_user: type_user
                })
            } else {
                res.render("home/login", {
                    type_user: type_user
                })
            }

        }
    } else {
        res.redirect("/")
    }
});

router.get("/admin/comments", async function(req, res) {
    const { userId } = req.session;
    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            res.redirect("../");
        } else if (userId.type != 0) {
            res.redirect("/");
        } else {
            var type_user = userId.type

            var id = req.query.id;
            var data = await pool.query("SELECT ID_RESP,REPONSE,NAME_MODULE,QUESTION,TYPE FROM REPONSES JOIN MODULE USING(ID_MODULES) LEFT JOIN QUESTIONS USING(ID_QUESTION) WHERE VALIDE=0")

            res.render("home/delegue", {
                data: data,
                type_user: type_user
            })
        }
    } else {
        res.redirect("/")
    }
});

router.get("/admin/list_delegate", async function(req, res) {
    const { userId } = req.session;
    if (typeof(userId) == 'undefined')
        return res.redirect("../");

    const type_user = userId.type;
    if (type_user == 0) {
        var data_delegues = await pool.query('SELECT * FROM USERS WHERE TYPE = 1');

        res.render("home/list_delegate", {
            data: data_delegues,
            type_user: type_user
        })
    } else {
        res.render("home/login", {
            type_user: type_user
        })
    }

});

router.get("/admin/delete/:id", async function(req, res) {
    const { userId } = req.session;
    if (typeof(userId) == 'undefined')
        return res.redirect("../");

    const type_user = userId.type;
    if (type_user == 0) {
        var id = req.params.id;
        var data = await pool.query('SELECT TYPE FROM USERS WHERE ID_USER =?', id);
        var type_delete = data[0].TYPE;

        await pool.query("DELETE FROM USERS WHERE ID_USER = ? ", id);
        var new_data = await pool.query('SELECT * FROM USERS WHERE TYPE = ?', type_delete);

        if (type_delete == 2) {
            res.render("home/list_prof", {
                data: new_data,
                type_user: type_user
            })
        } else {
            res.render("home/list_prof", {
                data: new_data,
                type_user: type_user
            })
        }
    } else {
        res.render("home/login", {
            type_user: type_user
        })
    }
});

router.post("/admin/comments", urlencodedParser, async function(req, res) {
    const { userId } = req.session;
    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            res.redirect("../");
        } else if (userId.type != 0) {
            res.redirect("/");
        } else {
            var type_user = userId.type

            var data = req.body;
            var sql_query_update = "UPDATE REPONSES SET VALIDE=1 WHERE ID_RESP=?"
            var sql_query_del = "DELETE FROM REPONSES WHERE ID_RESP=?"
            if (data.ret_value == "Accept") {
                var ret = await pool.query(sql_query_update, data.id_resp)
            } else if (data.ret_value == "Refuse") {
                var ret = await pool.query(sql_query_del, data.id_resp)
            }

            var data_ret = await pool.query("SELECT ID_RESP,REPONSE,NAME_MODULE,QUESTION,TYPE FROM REPONSES JOIN MODULE USING(ID_MODULES) LEFT JOIN QUESTIONS USING(ID_QUESTION) WHERE VALIDE=0")

            res.render("home/delegue", {
                data: data_ret,
                type_user: type_user
            })
        }
    } else {
        res.redirect("/")
    }

});

router.get("/admin/add_user", async function(req, res) {
    const { userId } = req.session;
    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            res.redirect("../");
        } else if (userId.type != 0) {
            res.redirect("/");
        } else {
            var type_user = userId.type

            res.render("home/add_user", {
                warn_username: false,
                warn_password: false,
                type_user: type_user
            })
        }
    } else {
        res.redirect("/")
    }
});

router.post("/admin/add_user", urlencodedParser, async function(req, res) {
    const { userId } = req.session;
    var type_user = userId.type

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
        return res.redirect("/")
    }

    res.render("home/add_user", {
        warn_username: warn_username,
        warn_password: warn_password,
        type_user: type_user
    })


});

router.get("/admin/add_module", async function(req, res) {
    const { userId } = req.session;

    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            return res.redirect("/");
        } else if (userId.type != 0) {
            return res.redirect("/");
        } else {
            var type_user = userId.type

            var data_user = await pool.query("SELECT * FROM USERS")
            res.render("home/admin_add_module", {
                warn_module: false,
                data_user: data_user,
                type_user: type_user
            })

        }
    } else {
        return res.redirect("/")
    }
})

router.post("/admin/add_module", urlencodedParser, async function(req, res) {
    const { userId } = req.session;
    var data = req.body
    var data_user = await pool.query("SELECT * FROM USERS")
    var data_modules = await pool.query('SELECT * FROM MODULE')
    var data_max_module = await pool.query('SELECT MAX(ID_MODULES) AS max FROM MODULE')
    data_max_module = data_max_module[0].max
    var warn_module = false


    var password_md5 = await pool.query("SELECT MD5(?) as md5", data.password)
    password_md5 = password_md5[0].md5


    for (var i = 0; i < data_modules.length; i++)
        if (data.module == data_modules[i].NAME_MODULE)
            warn_module = true


    if (!warn_module) {
        pool.query('INSERT INTO MODULE VALUE(' + (data_max_module + 1) + ',"' + parseInt(data.prof_id) + '" ,"' + data.module + '","' + data.description + '","' + data.type + '","' + password_md5 + '",0)');
        return res.redirect("/")
    }


    res.render("home/admin_add_module", {
        warn_module: warn_module,
        data_user: data_user,
        type_user: userId.type
    })


})

router.get("/module/:p1", async function(req, res) {
    const { userId } = req.session;

    if (!(typeof(userId) == 'undefined')) {
        if (!(typeof(userId.type) == 'undefined')) {
            var type_user = userId.type
        } else
            var type_user = null
    } else
        var type_user = null
    var data_module = await pool.query('SELECT * FROM MODULE')
    var param = req.params.p1

    res.render("home/ask_key", {
        data_module: data_module,
        param: param,
        type_user: type_user
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


router.get("/prof/add_module", async function(req, res) {
    const { userId } = req.session;

    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            res.redirect("../");
        } else if (userId.type != 2) {
            res.redirect("/");
        } else {
            var type_user = userId.type

            res.render("home/add_module", {
                warn_module: false,
                type_user: type_user
            })

        }
    } else {
        res.redirect("/")
    }

})

router.post("/prof/add_module", urlencodedParser, async function(req, res) {
    const { userId } = req.session;
    var data = req.body
    var data_modules = await pool.query('SELECT * FROM MODULE')
    var data_max_module = await pool.query('SELECT MAX(ID_MODULES) AS max FROM MODULE')
    data_max_module = data_max_module[0].max
    var warn_module = false


    var password_md5 = await pool.query("SELECT MD5(?) as md5", data.password)
    password_md5 = password_md5[0].md5


    for (var i = 0; i < data_modules.length; i++)
        if (data.username == data_modules[i].NAME_MODULE)
            warn_module = true


    if (!warn_module) {
        pool.query('INSERT INTO MODULE VALUE(' + (data_max_module + 1) + ',"' + parseInt(userId.id_user) + '" ,"' + data.username + '","' + data.description + '","' + data.type + '","' + password_md5 + '",0)');
    }


    res.render("home/add_module", {
        warn_module: warn_module
    })


})

router.get("/change_password", async function(req, res) {
    const { userId } = req.session;
    if (typeof(userId) != 'undefined') {
        if (typeof(userId.type) == 'undefined') {
            res.redirect("/");
        } else {
            var type_user = userId.type

            res.render("home/change_password", {
                warn_old_password: false,
                warn_confirm_password: false,
                type_user: type_user
            })

        }
    } else {
        res.redirect("/")
    }
})

router.post("/change_password", urlencodedParser, async function(req, res) {
    const { userId } = req.session;
    var data = req.body
    var warn_old_password = false
    var warn_confirm_password = false

    var old_password_md5 = await pool.query("select MD5(?) AS md5", data.old_password)
    old_password_md5 = old_password_md5[0].md5

    var database_old_pass = await pool.query("SELECT USER_PASSWORD FROM USERS WHERE ID_USER=" + parseInt(userId.id_user))
    database_old_pass = database_old_pass[0].USER_PASSWORD
    if (old_password_md5 != database_old_pass)
        warn_old_password = true

    if (data.new_password != data.confirm_password)
        warn_confirm_password = true

    if (!warn_old_password && !warn_confirm_password) {
        var password_md5 = await pool.query("select MD5(?) AS md5", data.new_password)
        password_md5 = password_md5[0].md5
        await pool.query("UPDATE USERS SET USER_PASSWORD=? WHERE ID_USER=?", [password_md5, userId.id_user])
        res.redirect("/logout")
    } else {
        res.render("home/change_password", {
            warn_old_password: warn_old_password,
            warn_confirm_password: warn_confirm_password,
            type_user: userId.type
        })

    }
})

module.exports = router;