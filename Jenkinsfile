/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

node (){
    stage 'checkout from git'
    //git url:"https://github.com/ciandcd/simple-maven-project-with-tests.git"
    echo 'checkout from git'

    stage 'build and package'
    //echo 'build and package'
    //sh 'npm install'
    //sh 'npm run build'
    //sh 'tar czf dist.tar.gz dist'

    stage 'deploy'
    //echo 'deploy'
    sshagent(['709aac15-a8eb-4d00-af53-2d01a01c7277']) {
        sh 'ssh -o StrictHostKeyChecking=no -l devops-web 10.10.152.143 uname -a'
    }




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
