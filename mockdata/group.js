/**
 * Created by helen on 2016/9/19.
 */
module.exports.group = [{'members':[{
    'userName': 'admin',
    'name': '张三',
    'uid': 1
},{
    'userName': 'helen',
    'name': '李斯',
    'uid': 2
},{
    'userName': 'candy',
    'name': '旺儿',
    'uid': 3
}]},{'mileStones':[{
    'id': 1,
    'title': '里程碑1',
},{
    'id': 2,
    'title': '里程碑2',
},{
    'id': 3,
    'title': '里程碑3',
}]}];


module.exports.notes={
    "success": true,
    "errorCode": null,
    "errorMsg": null,
    "result": [{
        "id": 302,
        "body": "Status changed to closed",
        "attachment": null,
        "author": {
            "id": 1,
            "username": "pipin",
            "email": "admin@example.com",
            "name": "Pip",
            "state": "active",
            "created_at": "2013-09-30T13:46:01Z"
        },
        "created_at": "2013-10-02T09:22:45Z",
        "updated_at": "2013-10-02T10:22:45Z",
        "system": true,
        "upvote": false,
        "downvote": false,
        "noteable_id": 377,
        "noteable_type": "Issue"
    },
    {
        "id": 305,
        "body": "Text of the comment\r\n",
        "attachment": null,
        "author": {
            "id": 1,
            "username": "pipin",
            "email": "admin@example.com",
            "name": "Pip",
            "state": "active",
            "created_at": "2013-09-30T13:46:01Z"
        },
        "created_at": "2013-10-02T09:56:03Z",
        "updated_at": "2013-10-02T09:56:03Z",
        "system": true,
        "upvote": false,
        "downvote": false,
        "noteable_id": 121,
        "noteable_type": "Issue"
    }
]};
