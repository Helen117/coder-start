require('babel-register');

const webpack = require('webpack');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./webpack.config');

const isProduction = process.env.NODE_ENV === 'production';
const isDeveloping = !isProduction;

const menu_ = require('./mockdata/menu');
var menu = menu_.menu;
const user_ = require('./mockdata/user');
var login = user_.login;
var user = user_.user;
const mygroup = require('./mockdata/mygroup.json');

//const projectList = require('./mockdata/project');
const group = require('./mockdata/group.json');

const projectMgr = require('./mockdata/project-mgr');
const groupTree = projectMgr.groupTree;

const group_ = require('./mockdata/group');
var dataSource = group_.assign;
var issueNotes = group_.notes;

const issueList_ =require('./mockdata/issueList');
var issueList = issueList_.issueList;

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
app.post('/gitlab/login', function (req, res) {
    const credentials = req.body;
    console.log('username:',credentials.username);
    if (credentials.username === login.username && credentials.password === login.password) {
        //res.cookie('uid', '1', {domain: '127.0.0.1'});
        res.json(user);
    } else {
        res.json({success: false, errorMsg:'用户名或者密码错误！'});
    }
});

app.post('/gitlab/user/add', function (req, res) {
        res.json({success: true,errorCode: null,errorMsg: null});
});

app.get('/gitlab/userExists', function (req, res) {
    res.json(user);
});

app.post('/gitlab/project/assign', function (req, res) {
    const credentials = req.body;
    console.log('projectId:',credentials.projectId);
    if (credentials) {
        res.json(dataSource);
    } else {
        res.status('500').send({'errorMsg': 'Invalid projectId'});
    }
});

app.post('/gitlab/project/add-issue', function (req, res) {
        res.json({success: true,errorCode: null,errorMsg: null});
});

app.post('/gitlab/issue/notes', function (req, res) {
        res.json(issueNotes);
});

app.post('/gitlab/project/issues', function (req, res) {
    res.json(issueList);
});

app.post('/gitlab/issue/add-note', function (req, res) {
    res.json({success: true,errorCode: null,errorMsg: null,result:1});
});

// app.get('/gitlab/user/1', function (req, res) {
//     res.json(user);
// });
app.post('/gitlab/group', function (req, res) {
    res.json(group);
});

app.post('/gitlab/mygroup', function (req, res) {
    res.json(mygroup);
});


app.get('/gitlab/user/1', function (req, res) {

    res.json(user);
});

app.post('/gitlab/menu', function (req, res) {
    res.json(menu);
});

app.post('/gitlab/groups/all', function (req, res) {
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