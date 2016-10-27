/**
 * Created by Administrator on 2016-10-26.
 */
module.exports.filetree ={
    "success": true,
    "errorCode": null,
    "errorMsg": null,
    "result": [
        {name:"dist",type:"-d",children:[
            {name:"index.html",type:"--",children:[]},
            {name:"bundle.js",type:"--",children:[]}
        ]},
        {name:"src",type:"-d",children:[
            {name:"api",type:"-d",children:[
                {name:"api.js",type:"--",children:[]},
                {name:"index.js",type:"--",children:[]}
            ]},
            {name:"containers",type:"-d",children:[
                {name:"code-files",type:"-d",children:[
                    {name:"actions",type:"-d",children:[
                        {name:"code-files-actions.js",type:"--",children:[]},
                    ]},
                    {name:"index.js",type:"--",children:[]}
                ]},
                {name:"app",type:"-d",children:[
                    {name:"index.js",type:"--",children:[]},
                    {name:"index.css",type:"--",children:[]}
                ]}
            ]}
        ]}
    ]
};