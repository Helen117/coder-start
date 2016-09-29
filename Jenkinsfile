/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

node (){
    stage 'checkout from git'
    //git url:"https://github.com/ciandcd/simple-maven-project-with-tests.git"
    echo 'checkout from git'

    stage 'build and package'
    echo 'build and package'
    //sh 'npm install'
    //sh 'npm run build'
    //sh 'tar czf dist.tar.gz dist'

    stage 'deploy'
    echo 'deploy'
    //sshagent(['RemoteCredentials']) {
    //    sh 'ssh -o StrictHostKeyChecking=no -l remoteusername remotetarget uname -a'
    //}




}

def notifyStarted(){
    def response = httpRequest url:'http://localhost:8080/jenkins/api/json?pretty=true',
                               httpMode:'POST',
                               contentType:'APPLICATION_JSON'
    println("Status: "+response.status)
    println("Content: "+response.content)
}

def notifySuccessful(){

}

def notifyFailed(){

}
