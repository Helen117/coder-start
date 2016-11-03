/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress,notification,BackTop} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestones,putProIdToState} from './actions/milestones-action';
import TimelineMilestone from '../../components/timeline';
import 'pubsub-js';
import './index.less';

class Milestones extends React.Component {
    constructor(props) {
        super(props);
        this.page =1;
        this.timeLineData = [];
    }

    componentDidMount() {
        if (this.props.getProjectInfo ) {
            const projectId = this.props.getProjectInfo.id;
            if(!this.props.timeLineData || this.props.milestoneProId!=projectId && this.props.timeLineData){
                this.props.getMilestones(projectId, this.page, this.timeLineData);
                this.props.putProIdToState(projectId);
            }
        } else {
            const {router} = this.context;
            router.goBack();
            this.errChoosePro();
        }
    }

    componentWillReceiveProps(nextProps) {
        const acquireData = nextProps.acquireData;
        const errMessage = nextProps.errMessage;
        const thisProId = this.props.getProjectInfo?this.props.getProjectInfo.id:'';
        const nextProId = nextProps.getProjectInfo?nextProps.getProjectInfo.id:'';
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            this.page =1;
            this.timeLineData = [];
            this.props.getMilestones(nextProId,this.page,this.timeLineData);
            this.props.putProIdToState(nextProId);
        }
        //点击查看更多无新数据时提醒
        if(this.props.milestoneData =='' && nextProps.milestoneData=='' && this.page > 1 && acquireData){
            this.warnCallback();
        }
        //数据加载错误提示
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }
    }

    errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在左侧项目树中选择一个项目',
            duration: 2
        });
    }

    errCallback(errMessage){
        notification.error({
            message: '数据加载失败',
            description: errMessage,
            duration: 2
        });
    }

    warnCallback(){
        notification.warning({
            message: '无更多数据',
            description: '该项目的全部里程碑都已展示',
            duration: 2
        });
    }

    moreMilestones(){
        const projectId = this.props.getProjectInfo.id;
        this.page ++;
        this.props.getMilestones(projectId,this.page,this.props.timeLineData);
        let obj =  document.getElementById("里程碑");
        let x= obj.offsetLeft;
        let y= obj.offsetHeight;
        console.log(x,y);
        window.scrollTo(x ,y);
    }

    render(){
        const {loading,notFoundMsg,timeLineData} = this.props;
        const projectId=this.props.getProjectInfo?this.props.getProjectInfo.id:null;
        return (
            <div style={{margin:15}} id="里程碑">
                <TimelineMilestone timeLineData={timeLineData}
                               loading = {loading}
                               notFoundMsg = {notFoundMsg}
                               pending = {<a onClick={this.moreMilestones.bind(this)}>查看更多</a>}
                               projectId = {projectId}
                               milestonesDetailPath = '/milestonesDetail'
                ></TimelineMilestone>
            </div>
        )
    }
}

Milestones.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

Milestones.propTypes = {
    loadingMsg: PropTypes.string,
    notFoundMsg: PropTypes.string,
    loading: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        timeLineData: state.milestones.timeLineData,
        milestoneData: state.milestones.items,
        acquireData: state.milestones.acquireData,
        loading: state.milestones.loading,
        errMessage: state.milestones.errMessage,
        getProjectInfo: state.getProjectInfo.projectInfo,
        milestoneProId: state.putMilestonesProId.milestoneProId,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestones: bindActionCreators(getMilestones, dispatch),
        putProIdToState: bindActionCreators(putProIdToState, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Milestones);