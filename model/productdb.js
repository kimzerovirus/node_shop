
var db = require('oracledb')
var dbconfig = require('./dbconfig.js')
db.autoCommit = true;

exports.listProduct = function (req, res) {
    db.getConnection(dbconfig, function (err, con) {
        if (err) throw err;
        var sql = "select * from (select * from product order by pnum asc) where rownum <=8";
        con.execute(sql, function (err, result) {
            if (err) throw err;
            con.close(function (err) {
                if (err) throw err;
                var data = {
                    prodData: result.rows
                }
                // console.dir(result);
                res.render('main', data);
            })
        })
    })
}

exports.selectProduct = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = "select * from product where pnum=:pnum";
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var obj = {
                    prodData: result.rows
                };
                //console.dir(result);
                res.render('product/prodView.ejs', obj);
            })
        })
    })
}

exports.listCategoryProduct = (data, req, res) => {
    db.getConnection(dbconfig, (err, con) => {
        if (err) throw err;
        var sql = "select * from product where cg_code=:cg_code  order by pnum asc";
        con.execute(sql, data, (err, result) => {
            if (err) throw err;
            con.close((err) => {
                if (err) throw err;
                var obj = {
                    prodData: result.rows
                };
                //console.dir(result);
                res.render('product/prodCategory.ejs', obj);
            })
        })
    })
}