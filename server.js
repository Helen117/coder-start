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
const projectMgr = require('./mockdata/project-mgr');
const groupTree = projectMgr.groupTree;

const milestones_ = require('./mockdata/milestones');
var milestones = milestones_.milestones;

const milestones_detail_ = require('./mockdata/milestonesDetail');
var milestoneDetail = milestones_detail_.milestoneDetail;

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

//  RESTful gitlab
const publicPath = path.resolve(__dirname);
app.use(bodyParser.json({type: 'application/json'}));
app.use(express.static(publicPath));

const port = isProduction ? (process.env.PORT || 80) : 8080;

//以下是模拟服务端请求数据
app.post('/gitlab/login', function (req, res) {
    const credentials = req.body;
    if (credentials.username === login.username && credentials.password === login.password) {
        //res.cookie('uid', '1', {domain: '127.0.0.1'});
        res.json(user);
    } else {
        res.json({success: false, errorMsg:'用户名或者密码错误！'});
    }
});

app.get('/gitlab/user/1', function (req, res) {
    res.json(user);
});

app.post('/gitlab/menu', function (req, res) {
    res.json(menu);
});


app.get('/api/milestones', function (req, res) {
    res.json(milestones);
});

app.get('/api/milestoneDetail', function (req, res) {
    res.json(milestoneDetail);
});

app.post('/api/project-mgr/groupTree', function (req, res) {
    res.json(groupTree);
});

app.get('/api/milestones', function (req, res) {
    res.json(milestones);
});

app.get('/api/milestoneDetail', function (req, res) {
    res.json(milestoneDetail);
});

app.post('/api/project-mgr/groupTree', function (req, res) {
    res.json(groupTree);
});


app.post('/gitlab/milestones', function (req, res) {
    res.json(milestones);
});

app.post('/gitlab/milestoneDetail', function (req, res) {
    res.json(milestoneDetail);
});


app.post('/gitlab/project-mgr/groupTree', function (req, res) {
    res.json(groupTree);
});

app.post('/gitlab/project-mgr/createProject', function (req, res) {
    res.json({success: true,errorCode: null,errorMsg: null,result:1});
});

app.post('/gitlab/project-mgr/createGroup', function (req, res) {
    res.json({success: true,errorCode: null,errorMsg: null,result:1});
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '', 'index.html'))
});

// app.use('/*', express.static(path.resolve(__dirname, '', 'index.html')));

app.listen(port, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Server running on port ' + port);
});
