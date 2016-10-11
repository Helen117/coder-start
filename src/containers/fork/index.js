/**
 * Created by helen on 2016/10/9.
 */
import React, {PropTypes,Component} from 'react';
import { Input, Button, message} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fork from '../project-list/actions/fork-project-action';

class Fork extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const {forkResult} = nextProps;

        if (forkResult.forkProject&&this.props.forkResult.forkProject != forkResult.forkProject){
            PubSub.publish("evtRefreshGroupTree",{});
        }else if(forkResult.errors && this.props.forkResult.errors != forkResult.errors){
            message.error('Fork失败!'+forkResult.errors);
        }

    }

    fork(){
        const {actions,projectInfo,loginInfo} = this.props;
        console.log('actions:',actions);
        actions.forkProject(projectInfo.projectInfo.gitlabProject.id,loginInfo.username);
    }

    render() {
        const { projectInfo } = this.props;
        console.log('projectInfo:',projectInfo);

        return (
            <div>
                <h1>
                    {projectInfo.projectInfo.name}
                </h1>
                <p>
                    {projectInfo.projectInfo.gitlabProject.description}
                </p>

                <Button type="ghost" onClick={this.fork.bind(this)} loading={this.props.forkResult.loading}>Fork</Button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectInfo:state.getProjectInfo,
        loginInfo:state.login.profile,
        forkResult:state.forkProject
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(fork,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Fork);