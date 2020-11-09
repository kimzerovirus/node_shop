
var db = require('oracledb')
var dbconfig = require('./dbconfig.js')
db.autoCommit = true;

exports.cartList = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = "select cartNum, c.pnum, p.pname, p.pimage1, p.price, c.oqty, p.point, (price * oqty) totalPrice, (point * oqty) totalPoint from cart c join product p on c.pnum = p.pnum where idx = :idx order by cartNum desc";
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var obj = {
                    cartData: result.rows
                };
                console.dir(result);
                res.render('cart/cartView.ejs', obj);
            })
        })
    })
}

// exports.cartAlert = (data, req, res) => {
//     db.getConnection(dbconfig, (err, con) => {
//         if (err) throw err;
//         var sql = "select count(*) from cart where idx= :idx";
//         con.execute(sql, data, (err, result) => {
//             if (err) throw err;
//             con.close((err) => {
//                 if (err) throw err;
//                 var obj = {
//                     cartData: result.rows
//                 };
//                 console.dir(result);
//                 res.render('main', obj);
//             })
//         })
//     })
// }

// exports.cartAdd = (req, res, data) => {
//     console.dir('cartAdd1');
//     db.getConnection(dbconfig, (err, con) => {
//         if (err) throw err;
//         console.dir('cartAdd2');
//         // var sql = "insert into cart values(cart_seq.nextval,:oqty,sysdate,:idx,:pnum)";
//         // var sql = "insert into cart(cartNum,oqty,indate,idx,pnum,userid) values(cart_seq.nextval,1, sysdate,1,6,'admin')"
//         con.execute(sql, data, function (err, result) {
//             console.dir('cartAdd3');
//             if (err) throw err;
//             con.close(function (err) {
//                 console.dir('cartAdd4');
//                 if (err) throw err;
//                 console.log(JSON.stringify(result));
//                 var n = parseInt(result.rowsAffected);
//                 var data = {};
//                 console.dir('cartAdd5');
//                 if (n > 0) {
//                     data.msg = '장바구니 추가 성공';
//                     data.loc = '/cartView'
//                 } else {
//                     data.msg = '장바구니 추가 실패';
//                     data.loc = 'javascript:history.back()';
//                 }
//                 res.render('message', data);
//                 //views/message.ejs
//             })//con.close();
//         })//con.execute();
//     })//db.getConnect()
// }

exports.cartAdd = (data, req, res) => {
    // console.dir('cartAdd1');
    db.getConnection(dbconfig, (err, con) => {
        // console.dir('cartAdd2');
        console.dir(data);
        if (err) throw err;
        var sql = "insert into cart(cartNum,oqty,indate,idx,pnum,userid) values(cart_seq.nextval,:oqty,sysdate,:idx,:pnum,:userid)";
        con.execute(sql, data, (err, result) => {
            // console.dir('cartAdd3');
            if (err) throw err;
            con.close((err) => {
                // console.dir('cartAdd4');
                if (err) throw err;
                console.log(JSON.stringify(result));
                var n = parseInt(result.rowsAffected);
                var data = {};
                // console.dir('cartAdd5');
                if (n > 0) {
                    data.msg = '장바구니 추가 성공';
                    data.loc = '/cartView'
                } else {
                    data.msg = '장바구니 추가 실패';
                    data.loc = 'javascript:history.back()';
                }
                res.render('message', data);
            })
        })
    })
}

exports.cartDel = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = "delete from cart where cartnum=:cnum";
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var n = parseInt(result.rowsAffected);
                var obj = {};
                if (n > 0) {
                    obj.msg = '삭제 성공';
                    obj.loc = '/cartView';
                } else {
                    obj.msg = '삭제 실패';
                    obj.loc = 'javascript:history.back';
                }
                res.render('message', obj);
            })
        })
    })
}

// exports.cartAddEnd = (data, req, res) => {
//     db.getConnection(dbconfig, (err, con) => {
//         if (err) throw err;
//         // var sql = "select * from member where userid= :userid and pwd= :pwd";
//         var sql = "select m.idx, m.name, m.userid, m.email, (select count(c.userid) from cart) cartNum from member m left outer join cart c on m.idx = c.idx where m.userid=:userid"
//         con.execute(sql, data, (err, result) => {
//             if (err) throw err;
//             con.close((err) => {
//                 if (err) throw err;

//                 var obj = {};
//                 obj.isLogin = true;
//                 var cartData = result.rows;

//                 var tmpUser = {
//                     idx: cartData[0][0],
//                     name: cartData[0][1],
//                     userid: cartData[0][2],
//                     email: cartData[0][3],
//                     cart: cartData[0][4]
//                 }
//                 obj.loginUser = tmpUser;
//                 console.dir(obj);
//                 req.session.loginData = obj;
//                 req.session.save((err) => {
//                     if (err) throw err;
//                     res.redirect('/cartView', obj);
//                 })

//             }) // close() end--

//         }) // excute() end--

//     }) // getConnection() end--
// }


exports.cartCheck = function (data, req, res) {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = 'select count(userid) from cart where userid=:userid';
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                // console.dir(result);
                var n = result.rows.length;
                var obj = {};
                if (n > 0) {
                    // console.dir(result.rows);
                    obj.cartNum = result.rows;
                } else {
                    obj.cartNum = 0;
                }
                res.json(obj)
            })
        })
    })
}