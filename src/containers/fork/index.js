/**
 * Created by helen on 2016/10/9.
 */
import React, {PropTypes,Component} from 'react';
import {notification,Spin  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fork from '../project-list/actions/fork-project-action';
import Box from '../../components/box';
import styles from './index.css';

class ForkList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const projectId = this.props.location.state.projectId;
        const {actions} = this.props;
        actions.getForkList(projectId);
    }

    componentWillReceiveProps(nextProps) {
        // const errorMsg = nextProps.error;
        // if(errorMsg&& errorMsg != this.props.errorMsg){
        //     this.errorMessage('获取Fork列表信息失败！',error);
        // }
    }

    // errorMessage(info,error){
    //     notification.error({
    //         message: info,
    //         description:error,
    //         duration:null,
    //     });
    // }

    render() {
        const { forkList,loading } = this.props;
        //console.log('fork-list:',forkList);

        const pending = loading?true:false;

        const list =forkList?forkList.map(data => <li key={data.id}>
            <div className={styles.forks_list} >
                <span>{data.path} #forked at {new Date(parseInt(data.forked_at)).toLocaleDateString()} by {data.author_name}</span>
                <p>
                    {data.description}
                </p>
            </div>
        </li>):[];

        return (
            <Spin spinning={pending}>
                <Box title="Fork信息">
                    <div>
                        <ul>
                            {list}
                        </ul>
                    </div>
                </Box>
            </Spin>
        )
    }
}

function mapStateToProps(state) {
    return {
        forkList:state.forkProject.forksInfo,
        loading:state.forkProject.pending,
        error:state.forkProject.error,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(fork,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ForkList);