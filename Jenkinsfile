/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

def deployTarget = 'root@10.10.152.143'
def deployTargetPath = '/home/devops-web'
def gitUrl = 'ssh://git@10.10.152.146:10022/devops/devops-web.git'
def gitCredentialsId = 'd10d8ad2-c4d7-4ff9-b49b-61302ee43c47'
def sshagentCredentialsId = 'e2687fc3-2b72-4129-8678-e114919d1567'
//notificationUrl = 'http://10.10.152.144:11000/jenkins/stageStatus'
notificationUrl = 'http://10.10.156.153:11000/jenkins/stageStatus'


node (){
    //event = [:]
    def event = [jobName: env.JOB_NAME]
    event.stageName = 'checkout from git'
    event.stageId = '1'
    stage (event.stageName){
        notification(started(event))
        try{
            git url: gitUrl, credentialsId: gitCredentialsId

            def gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
//            echo gitCommit

//            sh 'git rev-parse --abbrev-ref HEAD > GIT_BRANCH'
//            git_branch = readFile('GIT_BRANCH').trim()
//            echo git_branch
//
//            sh 'git rev-parse HEAD > GIT_COMMIT'
//            git_commit = readFile('GIT_COMMIT').trim()
//            echo git_commit
            event.gitCommitId = gitCommit
            success(event)
        }catch (e){
            failed(event, e.toString())
            throw e
        }finally{
            notification(event)
        }
    }

    event.stageName = 'build and package'
    event.stageId = '100'
    stage (event.stageName){
        notification(started(event))
        try{
            sh 'npm install'
            sh 'npm run build'
            sh 'tar czf dist.tar.gz dist'
            success(event)
        }catch (e){
            failed(event, e.toString())
            throw e
        }finally{
            notification(event)
        }
    }

    event.stageName = 'deploy to nginx'
    event.stageId = '200'
    stage (event.stageName){
        notification(started(event))
        try {
            sshagent([sshagentCredentialsId]) {
                sh 'scp -o StrictHostKeyChecking=no dist.tar.gz ' + deployTarget + ':' + deployTargetPath
                sh 'ssh -o StrictHostKeyChecking=no ' + deployTarget + ' "cd ' + deployTargetPath + ';chown devops-web:devops-web dist.tar.gz;tar xzf dist.tar.gz;chmod -R 777 dist"'
                //sh 'ssh -o StrictHostKeyChecking=no xuwz@192.168.198.128 "tar xzf dist.tar.gz"'
                //sh 'ssh -o StrictHostKeyChecking=no xuwz@192.168.198.128 uname -a'
            }
            success(event)
        }catch (e){
            failed(event, e.toString())
            throw e
        }finally{
            notification(event)
        }
    }

}


def notification(event){
    println event
    try {
        def response = httpRequest url:notificationUrl, httpMode:'POST', contentType:'APPLICATION_JSON', requestBody:toJson(event)
        println("Notification Response Status: " + response.status + ", " + "Content: " + response.content)
    }catch (e){
        println '调用notification url出现错误: ' + e
    }
//    echo 'build number=' + env.BUILD_NUMBER
//    echo 'job_name=' + env.JOB_NAME
//    echo 'currentBuild='+currentBuild.toString()
//    echo 'currentBuild='+currentBuild.getProjectName()
//    echo 'currentBuild='+currentBuild.getResult()
//    echo 'currentBuild='+currentBuild.getNumber()
//    echo 'currentBuild='+currentBuild.getDuration()
}

def toJson(input) {
    return groovy.json.JsonOutput.toJson(input)
}

//def toJson = {
//    input ->
//        groovy.json.JsonOutput.toJson(input)
//}


def started(event){
    event.status = 'STARTED'
    event.timestamp = System.currentTimeMillis()
    return event
}

def success(event){
    event.status = 'SUCCESS'
    event.timestamp = System.currentTimeMillis()
}

def failed(event, msg){
    event.status = 'FAILED'
    event.msg = msg
    event.timestamp = System.currentTimeMillis()
}