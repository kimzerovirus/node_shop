var productdb = require('../../model/productdb.js')

exports.listProd = function (req, res) {
    productdb.listProduct(req, res);
}

exports.selectProd = function (req, res) {
    var data = {};
    data.pnum = req.params.pnum;
    productdb.selectProduct(data, req, res);
}

exports.listCategoryProd = function (req, res) {
    var data = {};
    data.cg_code = req.params.cg_code;
    productdb.listCategoryProduct(data, req, res);
}