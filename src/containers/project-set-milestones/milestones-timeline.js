/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress,notification,BackTop,Spin} from 'antd';
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
    }

    componentDidMount() {
        if (this.props.selectedProjectSet ) {
            const selectedItemId = this.props.selectedProjectSet.id;
            if(!this.props.timeLineData || this.props.milestoneProId!=selectedItemId && this.props.timeLineData){
                this.distributeActions(selectedItemId, this.page, this.timeLineData);
                //this.props.getProjectMilestonesAction(id, this.page, this.timeLineData);
                this.props.putProIdToStateAction(selectedItemId);
            }
        } /*else {
            const {router} = this.context;
            //router.goBack();
            this.errChoosePro();
        }*/
    }

    componentWillReceiveProps(nextProps) {
        const {acquireData,errMessage,closeSetMsResult,closeSetMsErr} = nextProps;
        const thisProId = this.props.selectedProjectSet?this.props.selectedProjectSet.id:'';
        const nextProId = nextProps.selectedProjectSet?nextProps.selectedProjectSet.id:'';
        //点击不同项目，重新加载数据
        if(thisProId != nextProId){
            this.page =1;
            hisPage = 1;
            this.timeLineData = [];
            this.distributeActions(nextProId,this.page,this.timeLineData);
            //this.props.getProjectMilestonesAction(nextProId,this.page,this.timeLineData);
            this.props.putProIdToStateAction(nextProId);
        }
        //点击查看更多无新数据时提醒
        if(this.props.milestoneData =='' && nextProps.milestoneData=='' && this.page > 1 && acquireData){
            this.warnCallback();
        }
        //数据加载错误提示
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage,'数据加载');
        }
        if(this.props.closeSetMsResult != closeSetMsResult && closeSetMsResult){
            this.sucCallback('里程碑关闭');
        }else if(this.props.closeSetMsErr != closeSetMsErr && closeSetMsErr){
            this.errCallback(closeSetMsErr,'里程碑关闭');
        }
    }

    errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在左侧项目树中选择一个项目或项目集合',
            duration: 2
        });
    }

    sucCallback(type){
        notification.success({
            message: type+'成功',
            description: type+'成功',
            duration: 2
        });
        this.page =1;
        this.timeLineData = [];
        this.distributeActions(this.props.selectedProjectSet.id,this.page,this.timeLineData);
    }

    errCallback(errMessage,type){
        notification.error({
            message: type+'失败',
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
        const selectedItemId = id.substring(0,id.length-2);
        if(id.indexOf("_g") > 0 ){
            this.props.getProjectSetMilestonesAction(selectedItemId,page,timeLineData);
        }else{
            this.props.getProjectMilestonesAction(selectedItemId,page,timeLineData);
        }

    }

    moreMilestones(){
        const id = this.props.selectedProjectSet.id;
        this.page ++;
        this.distributeActions(id,this.page,this.props.timeLineData);
        //this.props.getProjectMilestonesAction(id,this.page,this.props.timeLineData);
    }

    viewHis(){
        const id = this.props.selectedProjectSet.id;
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
        if(id.indexOf("_g") > 0 ){
            this.props.closeSetMilestoneAction(milestonesId,projectId);
        }else{
            this.props.closeMilestoneAction(milestonesId,projectId);

        }
        this.props.closeSetMilestoneAction(milestonesId,projectId);
    }

    render(){
        const {loading,notFoundMsg,timeLineData,selectedProjectSet} = this.props;
        const id = selectedProjectSet?selectedProjectSet.id:'';
        const selectedItemId = selectedProjectSet?selectedProjectSet.selectedItemId:'';
        const closeSetMsLoading = this.props.closeSetMsLoading?true:false;
        return (
            <Spin spinning={closeSetMsLoading} tip="正在关闭里程碑，请稍候..." >
                <div style={{margin:15}}>
                    {id.indexOf("_g") > 0?
                    <div >
                        <Button className="pull-right" type="primary"  onClick={this.createMilestones.bind(this,'add')}>创建里程碑</Button>
                    </div>:<div></div>}

                    <TimelineMilestone timeLineData={timeLineData}
                                       loading = {loading}
                                       notFoundMsg = {notFoundMsg}
                                       pending = {<a onClick={this.moreMilestones.bind(this)}>查看更多</a>}
                                       projectId = {selectedItemId}
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
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
        milestoneProId: state.putMilestonesProId.milestoneProId,
        closeSetMsLoading: state.closeSetMilestone.loading,
        closeSetMsResult: state.closeSetMilestone.result,
        closeSetMsErr: state.closeSetMilestone.errorMsg
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