
var db = require('oracledb')
var dbconfig = require('./dbconfig.js')
db.autoCommit = true;

exports.userInsert = (user, req, res) => {
    db.getConnection(dbconfig, function (err, con) {
        if (err) throw err;
        var sql = "insert into member values(";
        sql += " member_seq.nextval,:name,:userid,:pwd,:email,:hp,:post,:addr1,:addr2,sysdate,1000,0)";
        con.execute(sql, user, function (err, result) {
            if (err) throw err;
            con.close(function (err) {
                if (err) throw err;
                console.log(JSON.stringify(result));
                var n = parseInt(result.rowsAffected);
                var data = {};

                if (n > 0) {
                    data.msg = '회원가입 성공';
                    data.loc = '/'
                } else {
                    data.msg = '회원가입 실패';
                    data.loc = 'javascript:history.back()';
                }
                res.render('message', data);
                //views/message.ejs
            })//con.close();
        })//con.execute();
    })//db.getConnect()
}//userInsert()

exports.idcheck = function (data, req, res) {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = 'select idx from member where userid=:userid';
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                console.dir(result);
                var n = result.rows.length;
                var obj = {};
                if (n > 0) {
                    obj.isUse = false;
                    obj.userid = data.userid;
                } else {
                    obj.isUse = true;
                    obj.userid = data.userid;
                }

                res.json(obj)
            })
        })
    })
}

exports.getTotalCount = function (callback) {
    db.getConnection(dbconfig, function (err, con) {
        if (err) throw err;
        var sql = "select count(idx) from node_member";
        con.execute(sql, function (err, result) {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var obj = { total: result.rows[0][0] };
                callback(obj);
            })
        })
    })
}

exports.listUser = function (req, res) {
    this.getTotalCount(function (cnt) {
        var total = cnt.total;
        var display = 5;
        var pageCount = Math.ceil(total / display);
        var cpage = parseInt(req.query.cpage);
        if (!cpage || cpage < 0) {
            cpage = 1;
        }
        if (cpage > pageCount) {
            cpage = pageCount;
        }

        var end = cpage * display;
        var start = end - (display - 1);

        var data = [start, end];

        db.getConnection(dbconfig, (err, con) => {
            if (err) throw err;
            var sql = "select * from ( "
                + " select idx,name,userid,pwd,email, to_char(indate,'yyyy-mm-dd') indate, "
                + " row_idxber() over(order by idx desc) rn"
                + " from member)"
                + " where rn between :1 and :2";
            con.execute(sql, data, (err, result) => {
                if (err) throw err;
                con.close((err) => {
                    if (err) throw err;
                    console.dir(result);

                    var obj = {
                        total: total,
                        pageCount: pageCount,
                        cpage: cpage,
                        userData: result.rows
                    };
                    res.render('user/list', obj);

                }) // con.close() end
            }) // con.excute() end
        }); // db.getConnection() end
    })
}

exports.deleteUser = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = "delete from member where idx=:idx";
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var n = parseInt(result.rowsAffected);
                var obj = {};
                if (n > 0) {
                    obj.msg = '삭제 성공';
                    obj.loc = '/users';
                } else {
                    obj.msg = '삭제 실패';
                    obj.loc = 'javascript:history.back';
                }
                res.render('message', obj);
            })
        })
    })
}

exports.selectUser = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = 'select * from member where idx =:idx';
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var obj = { userData: result.rows };
                res.render('user/edit.ejs', obj);
            });
        })
    })
}

exports.editUser = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = 'update member set name=:name, userid=:userid, pwd=:pwd, email=:email where idx=:idx';
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;

                var n = parseInt(result.rowsAffected);
                var obj = {};
                if (n > 0) {
                    obj.msg = '수정 성공';
                    obj.loc = '/users';
                } else {
                    obj.msg = '수정 실패';
                    obj.loc = 'javascript:history.back';
                }
                res.render('message', obj);
            });
        })
    })
}

exports.loginCheck = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = "select * from member where userid= :userid and pwd= :pwd";
        // var sql = "select m.idx, m.name, m.userid, m.email, (select count(c.userid) from cart) cartNum from member m left outer join cart c on m.idx = c.idx where m.userid=:userid and m.pwd=:pwd"
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var obj = {};
                if (result.rows.length == 0) {
                    var tmpUser = {
                        idx: '',
                        name: '',
                        userid: '',
                        email: ''
                        //cart: ''
                    }
                } else {
                    obj.isLogin = true;
                    var userData = result.rows;

                    var tmpUser = {
                        idx: userData[0][0],
                        name: userData[0][1],
                        userid: userData[0][2],
                        email: userData[0][3]
                        //cart: userData[0][4]
                    }
                    obj.loginUser = tmpUser;
                }
                req.session.loginData = obj;
                console.dir(obj);
                req.session.save((err) => {
                    if (err) throw err;
                    res.render('user/loginResult', obj);
                })

            }) // close() end--

        }) // excute() end--

    }) // getConnection() end--
}