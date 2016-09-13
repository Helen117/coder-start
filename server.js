require('babel-register');

const webpack = require('webpack');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./webpack.config');

const isProduction = process.env.NODE_ENV === 'production';
const isDeveloping = !isProduction;

// const {menu} = require('./mockdata/menu');
// const {login, user} = require('./mockdata/user');
const menu_ = require('./mockdata/menu');
var menu = menu_.menu;
const user_ = require('./mockdata/user');
var login = user_.login;
var user = user_.user;

const app = express();

// Webpack developer
if (isDeveloping) {
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}

//  RESTful API
const publicPath = path.resolve(__dirname);
app.use(bodyParser.json({type: 'application/json'}));
app.use(express.static(publicPath));

const port = isProduction ? (process.env.PORT || 80) : 8080;

//以下是模拟服务端请求数据
app.post('/api/login', function (req, res) {
    const credentials = req.body;
    if (credentials.username === login.username && credentials.password === login.password) {
        res.cookie('uid', '1', {domain: '127.0.0.1'});
        res.json(user);
    } else {
        res.status('500').send({'message': 'Invalid user/password'});
    }
});

app.get('/api/user/1', function (req, res) {
    res.json(user);
});

app.get('/api/user/1/menu', function (req, res) {
    res.json(menu);
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '', 'index.html'))
});


app.listen(port, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Server running on port ' + port);
});
