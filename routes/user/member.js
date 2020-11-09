var userdb = require('../../model/userdb.js')

exports.join = function (req, res) {
    res.render('user/join');
}

exports.joinEnd = function (req, res) {
    var name = req.body.name;
    var uid = req.body.userid;
    var pwd = req.body.pwd;
    var email = req.body.email;
    var hp = req.body.hp;
    var post = req.body.post;
    var addr1 = req.body.addr1;
    var addr2 = req.body.addr2;


    var user = {
        name: name,
        userid: uid,
        pwd: pwd,
        email: email,
        hp: hp,
        post: post,
        addr1: addr1,
        addr2: addr2
    }
    userdb.userInsert(user, req, res);

}

exports.idcheck = function (req, res) {
    var data = { userid: req.query.userid };
    userdb.idcheck(data, req, res);
}

exports.list = function (req, res) {
    userdb.listUser(req, res);
}

exports.delete = (req, res) => {
    console.log("삭제할 회원번호: " + req.params.idx);
    var data = { idx: req.params.idx };
    userdb.deleteUser(data, req, res);
}

exports.edit = function (req, res) {
    var data = { idx: req.params.idx };
    userdb.selectUser(data, req, res);
}

exports.editEnd = function (req, res) {
    var data = {
        idx: req.body.idx,
        name: req.body.name,
        userid: req.body.userid,
        pwd: req.body.pwd,
        email: req.body.email
    }
    userdb.editUser(data, req, res);
}

exports.loginForm = (req, res) => {
    res.render('user/login');
}

exports.loginEnd = (req, res) => {
    var uid = req.body.userid;
    var upwd = req.body.pwd;

    var data = {
        userid: uid,
        pwd: upwd
    }
    userdb.loginCheck(data, req, res);
}

exports.logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    })
}