/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress,notification,BackTop} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getProjectMilestones,putProIdToState,getProjectSetMilestones} from './actions/milestones-action';
import TimelineMilestone from '../../components/timeline';
import 'pubsub-js';
import './index.less';

class projectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
        this.page =1;
        this.timeLineData = [];
        /*const id = this.props.selectedProjectSet.selectedItemId;
        console.log('id');*/
    }

    componentDidMount() {
        if (this.props.selectedProjectSet ) {
            const selectedItemId = this.props.selectedProjectSet.id;
            if(!this.props.timeLineData || this.props.milestoneProId!=selectedItemId && this.props.timeLineData){
                this.distributeActions(selectedItemId, this.page, this.timeLineData);
                //this.props.getProjectMilestones(id, this.page, this.timeLineData);
                this.props.putProIdToState(selectedItemId);
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
        const thisProId = this.props.selectedProjectSet.id;
        const nextProId = nextProps.selectedProjectSet.id;
        //点击不同项目，重新加载数据
        if(thisProId != nextProId){
            this.page =1;
            this.timeLineData = [];
            this.distributeActions(nextProId,this.page,this.timeLineData);
            //this.props.getProjectMilestones(nextProId,this.page,this.timeLineData);
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
            description:'请先在左侧项目树中选择一个项目或虚拟组',
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

    distributeActions(id,page,timeLineData){
        const selectedItemId = id.substring(0,id.length-2);
        if(id.indexOf("_g") > 0 ){

            this.props.getProjectSetMilestones(selectedItemId,page,timeLineData);
        }else{
            this.props.getProjectMilestones(selectedItemId,page,timeLineData);
        }

    }

    moreMilestones(){
        const id = this.props.selectedProjectSet.id;
        this.page ++;
        this.distributeActions(id,this.page,this.props.timeLineData);
        //this.props.getProjectMilestones(id,this.page,this.props.timeLineData);
    }

    createMilestones(){
        this.context.router.push({
            pathname: '/projectSetMilestonesCreate',
        });
    }

    render(){
        const {loading,notFoundMsg,timeLineData,selectedProjectSet} = this.props;
        const id = selectedProjectSet?selectedProjectSet.id:'';
        const selectedItemId = selectedProjectSet?selectedProjectSet.selectedItemId:'';
        return (
            <div style={{margin:15}}>
                {id.indexOf("_g") > 0?
                <div >
                    <Button className="pull-right" type="primary"  onClick={this.createMilestones.bind(this,'add',null)}>创建里程碑</Button>
                </div>:<div></div>}
                <TimelineMilestone timeLineData={timeLineData}
                                   loading = {loading}
                                   notFoundMsg = {notFoundMsg}
                                   pending = {<a onClick={this.moreMilestones.bind(this)}>查看更多</a>}
                                   projectId = {selectedItemId}
                                   milestonesDetailPath="/projectSetMilestonesDetail"/>
            </div>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProjectSetMilestones: bindActionCreators(getProjectSetMilestones, dispatch),
        getProjectMilestones: bindActionCreators(getProjectMilestones, dispatch),
        putProIdToState: bindActionCreators(putProIdToState, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(projectSetMilestones);