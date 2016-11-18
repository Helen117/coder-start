/**
 * Created by helen on 2016/11/15.
 */

import React, {PropTypes,Component} from 'react';
import {notification,Spin  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as jenkins from './actions/jenkins-build-action';
import Box from '../../components/box';
// import styles from './index.css';

class CodeChangesList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const gitCommitId = this.props.location.state.gitCommitId;
        const {actions} = this.props;
        actions.codeChanges(gitCommitId);
    }

    componentWillReceiveProps(nextProps) {
        const errorMsg = nextProps.error;
        if(errorMsg&& errorMsg != this.props.errorMsg){
            this.errorMessage('获取commit列表信息失败！',error);
        }
    }

    errorMessage(info,error){
        notification.error({
            message: info,
            description:error,
            duration:null,
        });
    }

    render() {
        const { commits,loading } = this.props;

        const pending = loading?true:false;

        const list =commits?commits.map(data => <li key={data.id}>
            <div>
                <span>{data.author_name}/{data.project_name}</span>
                <p>
                    {data.description}
                </p>
            </div>
        </li>):[];

        return (
            <Spin spinning={pending}>
                <h1>代码变更</h1>
                <h2>概要</h2>
                    <div>
                        <ol>
                            {list}
                        </ol>
                    </div>
            </Spin>
        )
    }
}

function mapStateToProps(state) {
    return {
        commits:state.codeChange.codeCommit,
        loading:state.codeChange.loading,
        error:state.codeChange.error,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(jenkins,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeChangesList);