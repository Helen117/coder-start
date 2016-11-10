/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress,notification,BackTop,Spin,message} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getProjectMilestones,putProIdToState,getProjectSetMilestones} from './actions/milestones-action';
import {closeSetMilestone} from './actions/edit-milestones-actions'
import TimelineMilestone from '../../components/timeline';
import 'pubsub-js';
import './index.less';

class ProjectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',
            page: 1,
            timeLineData:[],
            hisPage: 1
        }
    }

    componentDidMount() {
        const {projectId} = this.props;
        this.setState({id:projectId})
        this.props.putProIdToStateAction(projectId);
        if(this.props.milestoneProId != projectId && projectId){
            this.setState({ timeLineData:[]})
            this.distributeActions(projectId,1,[]);
            this.props.putProIdToStateAction(projectId);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {acquireData,errMessage,closeSetMsResult,closeSetMsErr,projectId} = nextProps;
        if(this.props.milestoneProId != nextProps.projectId && projectId){
        //点击不同项目，重新加载数据
            this.setState({id:projectId, timeLineData:[], page:1})
            this.distributeActions(projectId,1,[]);
            this.props.putProIdToStateAction(projectId);
        }
        //点击查看更多无新数据时提醒
        if(this.props.milestoneData =='' && nextProps.milestoneData=='' && this.state.page > 1 && acquireData){
            this.warnCallback();
        }
        //数据加载错误提示
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage,'数据加载失败');
        }
        if(this.props.closeSetMsResult != closeSetMsResult && closeSetMsResult){
            this.sucCallback('里程碑关闭成功');
        }else if(this.props.closeSetMsErr != closeSetMsErr && closeSetMsErr){
            this.errCallback(closeSetMsErr,'里程碑关闭失败');
        }
    }

    sucCallback(type){
        message.success(type);
        this.setState={
            page: 1,
            timeLineData: [],
        }
        this.distributeActions(this.props.projectId,this.state.page,this.state.timeLineData);
    }

    errCallback(errMessage,type){
        notification.error({
            message: type,
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

    distributeActions(id,page,timeLineData){
        const itemId = (id.toString().indexOf("_g") > 0 || id.toString().indexOf("_p") > 0)? id.substring(0,id.length-2):id;
        if(id.toString().indexOf("_g") > 0 ){
            this.props.getProjectSetMilestonesAction(itemId,page,timeLineData);
        }else{
            this.props.getProjectMilestonesAction(itemId,page,timeLineData);
        }

    }

    moreMilestones(){
        this.setState={
            page: this.state.page++,
        }
        this.distributeActions(this.state.id,this.state.page,this.props.timeLineData);
    }

    hisMilestones(){
        console.log(this.state.hisPage);
        this.setState={
            hisPage: this.state.hisPage--,
        }
        console.log("查看历史第",this.state.hisPage,"页");
        //this.distributeActions(this.state.id,this.state.page,this.props.timeLineData);
    }

    createMilestones(type){
        this.context.router.push({
            pathname: '/projectSetMilestonesEdit',
            state: {editType: type}
        });
    }

    closeMilestone(milestonesId,projectId,id){
        this.props.closeSetMilestoneAction(milestonesId,projectId);
    }

    render(){
        const {loading,notFoundMsg,timeLineData} = this.props;
        const closeSetMsLoading = this.props.closeSetMsLoading?true:false;
        const id = this.props.projectId?this.props.projectId.toString():'';
        const projectId = id.indexOf("_g") > 0 || id.indexOf("_p") > 0?id.substring(0,id.length-2):id;
        //console.log('timeLineData',timeLineData)
        return (
            <Spin spinning={closeSetMsLoading} tip="正在关闭里程碑，请稍候..." >
                <div style={{margin:15}}>
                    {id.toString().indexOf("_g") > 0?
                    <div >
                        <Button className="pull-right" type="primary"  onClick={this.createMilestones.bind(this,'add')}>创建里程碑</Button>
                    </div>:<div></div>}

                    <TimelineMilestone timeLineData={projectId==''? [] :timeLineData}
                                       loading = {loading}
                                       notFoundMsg = {notFoundMsg}
                                       pending = {<a onClick={this.moreMilestones.bind(this)}>查看更多</a>}
                                       projectId = {projectId}
                                       id = {id}
                                       milestonesDetailPath="/projectSetMilestonesDetail"
                                       milestoneEditPath="/projectSetMilestonesEdit"
                                       milestoneClose = {this.closeMilestone.bind(this)}
                                       viewHis= {this.hisMilestones.bind(this)}/>
                </div>
            </Spin>
        )
    }
}

ProjectSetMilestones.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectSetMilestones.propTypes = {
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
        milestoneProId: state.putMilestonesProId.milestoneProId,
        closeSetMsLoading: state.closeSetMilestone.loading,
        closeSetMsResult: state.closeSetMilestone.result,
        closeSetMsErr: state.closeSetMilestone.errorMsg,
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProjectSetMilestonesAction: bindActionCreators(getProjectSetMilestones, dispatch),
        getProjectMilestonesAction: bindActionCreators(getProjectMilestones, dispatch),
        putProIdToStateAction: bindActionCreators(putProIdToState, dispatch),
        //closeMilestoneAction: bindActionCreators(closeMilestone, dispatch),
        closeSetMilestoneAction:  bindActionCreators(closeSetMilestone, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetMilestones);