// index.js
var product = require('./product/product.js');
var cart = require('./cart/cart.js');
exports.index = function (req, res) {
    product.listProd(req, res);
    // cart.AlertCart(req, res);
    // res.render('main', data, (err, html) => {
    //     if (err) throw err;
    //     res.send(html);
    // });
    console.dir('index.js');
}
