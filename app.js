
var http = require('http'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    static = require('serve-static'),
    bodyParser = require('body-parser');


var routes = require('./routes');
var user = require('./routes/user/member.js');
var product = require('./routes/product/product.js');
var cart = require('./routes/cart/cart.js')

var session = require('express-session'),
    fileStore = require('session-file-store')(session);

var app = express();

app.set('port', 3333);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'nodememberasdf12',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}))
app.use(bodyParser.urlencoded({ extended: true }));

// 로그인 여부를 체크하는 미들웨어
app.use(function (req, res, next) {
    var sesObj = req.session.loginData;
    //console.dir(sesObj);
    if (sesObj && sesObj.loginUser != null && sesObj.loginUser.userid != '') {
        res.locals.isLogin = true;
        res.locals.loginUser = sesObj.loginUser;
    } else {
        obj = {
            idx: '',
            userid: '',
            name: '',
            email: ''
            // cart: ''
        };
        res.locals.isLogin = false;
        res.locals.loginUser = obj;
    }
    next();
})

// 라우팅 처리
app.get('/', routes.index);
app.get('/join', user.join);
app.post('/join', user.joinEnd);
app.get('/idcheck', user.idcheck);
app.get('/users', user.list);

app.get('/users/delete/:idx', user.delete);
app.get('/users/:idx', user.edit)
app.post('/users/edit', user.editEnd);

// 로그인
app.get('/login', user.loginForm);
app.post('/login', user.loginEnd);
app.get('/logout', user.logOut);

//상품
app.get('/product/:pnum', product.selectProd);
app.get('/category/:cg_code', product.listCategoryProd);

//카트
app.get('/cartView', cart.listCart);
app.get('/cartCheck', cart.checkCart);
app.post('/addCart', cart.addCart);
app.post('/delCart', cart.delCart);
////////////////////////////////////////////

http.createServer(app).listen(app.get('port'), () => {
    console.log('http://localhost:' + app.get('port'));
})

