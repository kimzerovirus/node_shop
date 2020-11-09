var cartdb = require('../../model/cartdb.js')

exports.listCart = (req, res) => {
    if (req.session.loginData) {
        var sesObj = req.session.loginData;
        var _idx = sesObj.loginUser.idx;
        var data = {
            idx: _idx
        };
        console.dir(data);
        cartdb.cartList(data, req, res);
    } else {
        var data = {};
        data.msg = '로그인이 필요한 서비스입니다.';
        data.loc = '/login'
        res.render('message', data);
    }
}

// exports.addCartEnd = (req, res) => {
//     var sesObj = req.session.loginData;
//     var _userid = sesObj.loginUser.userid;
//     var data = {
//         userid: _userid,
//         pwd: '1'
//     };
//     console.dir('des');
//     req.session.destroy((err) => {
//         if (err) throw err;
//         console.dir('destroy');
//     })
//     cartdb.cartAddEnd(data, req, res);
// }

// exports.AlertCart = (req, res) => {
//     console.dir('Alert');
//     if (req.session.loginData) {
//         var sesObj = req.session.loginData;
//         var _idx = sesObj.loginUser.idx;
//         var data = {
//             idx: _idx
//         };
//         console.dir(data);
//         cartdb.cartAlert(data, req, res);
//     }
// }

exports.addCart = (req, res) => {
    if (req.session.loginData) {
        var _idx = req.body.idx;
        var _uid = req.body.userid;
        var _pnum = req.body.pnum;
        var _oqty = req.body.oqty;
        var data = {
            oqty: _oqty,
            idx: _idx,
            pnum: _pnum,
            userid: _uid
        };
        console.dir(data);
        cartdb.cartAdd(data, req, res);
    } else {
        var data = {};
        data.msg = '로그인이 필요한 서비스입니다.';
        data.loc = '/login'
        res.render('message', data);
    }
}

exports.delCart = (req, res) => {
    var _cnum = req.body.cnum;
    console.log('del' + _cnum);
    var data = {
        cnum: _cnum
    }
    cartdb.cartDel(data, req, res);
}

exports.checkCart = function (req, res) {
    var data = { userid: req.query.userid };
    cartdb.cartCheck(data, req, res);
}