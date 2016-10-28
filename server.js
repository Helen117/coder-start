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

const project_ = require('./mockdata/project');
const project = project_.projectList.result;

const virtual_project_ = require('./mockdata/project_set_tree');
const virtual_project = virtual_project_.projectSetTree.result;

const projectMgr = require('./mockdata/project-mgr');
const groupTree = projectMgr.groupTree;


const milestones_ = require('./mockdata/milestones');
var milestones = milestones_.milestones;

const milestones_issues_ = require('./mockdata/milestonesIssues');
var milestoneIssues = milestones_issues_.milestoneIssues;

const group_ = require('./mockdata/issueDataSource');
var dataSource = group_.assign;
var issueNotes = group_.notes;

const issueList_ =require('./mockdata/issueList');
var issueList = issueList_.issueList;

const forks =require('./mockdata/forks.json');

const star_list =require('./mockdata/start_list.json');

const userInfo =require('./mockdata/userInfo.json');

const projectInfo = require('./mockdata/projectInfo.json');

const projectMembers = require('./mockdata/projectMembers.json');

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
    //console.log('username:',credentials.username);
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
    //console.log('projectId:',credentials.projectId);
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

app.post('/gitlab/project', function (req, res) {
    res.json(project);
});

app.post('/gitlab/projectSetTree', function (req, res) {
    res.json(virtual_project);
});

app.post('/gitlab/menu', function (req, res) {
    res.json(menu);
});

app.post('/gitlab/project/info', function (req, res) {
    res.json(projectInfo);
});

app.post('/gitlab/project/members', function (req, res) {
    res.json(projectMembers);
});


app.post('/gitlab/milestone/project', function (req, res) {
    res.json(milestones);
});

app.post('/gitlab/milestone/issues', function (req, res) {
    res.json(milestoneIssues);
});

app.post('/api/project-mgr/groupTree', function (req, res) {
    res.json(groupTree);
});

app.post('/gitlab/project/fork-list', function (req, res) {
    res.json(forks);
});

app.post('/gitlab/user/all', function (req, res) {
    res.json(userInfo);
});

app.post('/gitlab/project/star-list', function (req, res) {
    res.json(star_list);
});

app.post('/gitlab/groups/user', function (req, res) {
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