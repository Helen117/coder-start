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

let hisPage = 1;
class projectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
        this.page =1;
        this.timeLineData = [];
        this.state = {
            id:''
        }
    }

    componentDidMount() {
        const {getProjectInfo,selectedProjectSet} = this.props;
        if(this.props.currentTwoInfo.link) {
            if (this.props.currentTwoInfo.link.indexOf('projectSetTree') > 0 && selectedProjectSet) {
                this.setState({id: selectedProjectSet.id})
                if (!this.props.timeLineData || this.props.milestoneProId != selectedProjectSet.id && this.props.timeLineData) {
                    this.distributeActions(selectedProjectSet.id, this.page, this.timeLineData);
                    this.props.putProIdToStateAction(selectedProjectSet.id);
                }
            } else if (this.props.currentTwoInfo.link.indexOf('project-mgr') > 0 && getProjectInfo) {
                this.setState({id: getProjectInfo.id})
                if (!this.props.timeLineData || this.props.milestoneProId != getProjectInfo.id && this.props.timeLineData) {
                    this.distributeActions(getProjectInfo.id, this.page, this.timeLineData);
                    this.props.putProIdToStateAction(getProjectInfo.id);
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {acquireData,errMessage,closeSetMsResult,closeSetMsErr} = nextProps;
        let thisProId ,nextProId;
        if(this.props.currentTwoInfo.link == '/projectSetTree/projectSetMilestones'){
             thisProId = this.props.selectedProjectSet?this.props.selectedProjectSet.id:'';
             nextProId = nextProps.selectedProjectSet?nextProps.selectedProjectSet.id:'';
        }else if(this.props.currentTwoInfo.link == '/project-mgr/milestones'){
            thisProId = this.props.getProjectInfo?this.props.getProjectInfo.id:'';
            nextProId = nextProps.getProjectInfo?nextProps.getProjectInfo.id:'';
        }

        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            this.setState({id: nextProId});
            this.page =1;
            hisPage = 1;
            this.timeLineData = [];
            this.distributeActions(nextProId,this.page,this.timeLineData);
            this.props.putProIdToStateAction(nextProId);
        }
        //点击查看更多无新数据时提醒
        if(this.props.milestoneData =='' && nextProps.milestoneData=='' && this.page > 1 && acquireData){
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
        this.page =1;
        this.timeLineData = [];
        const {getProjectInfo,selectedProjectSet} = this.props;
        //const id = selectedProjectSet?selectedProjectSet.id:getProjectInfo?getProjectInfo.id:'';
        this.distributeActions(this.state.id,this.page,this.timeLineData);
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
        const {getProjectInfo,selectedProjectSet} = this.props;
        //const id = selectedProjectSet?selectedProjectSet.id:getProjectInfo?getProjectInfo.id:'';
        this.page ++;
        this.distributeActions(this.state.id,this.page,this.props.timeLineData);
        //this.props.getProjectMilestonesAction(id,this.page,this.props.timeLineData);
    }

    viewHis(){
        const {getProjectInfo,selectedProjectSet} = this.props;
        //const id = selectedProjectSet?selectedProjectSet.id:getProjectInfo?getProjectInfo.id:'';
        console.log(hisPage);
        hisPage --;
        console.log("查看历史第",hisPage,"页")
        //this.distributeActions(id,this.hisPage,this.props.timeLineData);
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
        const {loading,notFoundMsg,timeLineData,selectedProjectSet,getProjectInfo} = this.props;
        //const id = selectedProjectSet?selectedProjectSet.id:getProjectInfo?getProjectInfo.id:'';
        const closeSetMsLoading = this.props.closeSetMsLoading?true:false;
        const id = this.state.id.toString();
        const projectId = id.indexOf("_g") > 0 || id.indexOf("_p") > 0?id.substring(0,this.state.id.length-2):id;
        return (
            <Spin spinning={closeSetMsLoading} tip="正在关闭里程碑，请稍候..." >
                <div style={{margin:15}}>
                    {this.state.id.toString().indexOf("_g") > 0?
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
                                       viewHis= {this.viewHis.bind(this)}/>
                </div>
            </Spin>
        )
    }
}

projectSetMilestones.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

projectSetMilestones.propTypes = {
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
        getProjectInfo:state.getProjectInfo.projectInfo,
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
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

export default connect(mapStateToProps, mapDispatchToProps)(projectSetMilestones);