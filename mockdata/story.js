/**
 * Created by zhaojp on 2017/3/29.
 */
module.exports.story = {
    "success": true,
    "errorCode": null,
    "errorMsg": null,
    "result": [
        {
            "id":"1",
            "title":"story1 title",
            "description":"story1 description",
            "story_status": "ok"
        },
        {
            "id":"2",
            "title":"story2 title",
            "description":"story1 description",
            "story_status": "ok"

        },
        {
            "id":"3",
            "title":"story3 title",
            "description":"story1 description",
            "story_status": "ok"

        }
    ]
}

module.exports.task = {
    "success": true,
    "errorCode": null,
    "errorMsg": null,
    "result": {
        "story_id":2,
        "todo":"todo",
        "doing":"doing",
        "done":"done"
    }
}