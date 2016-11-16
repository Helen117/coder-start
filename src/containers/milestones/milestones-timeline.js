/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress,notification,BackTop,Spin,message,Badge} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getProjectMilestones,putProIdToState,getProjectSetMilestones} from './actions/milestones-action';
import {closeSetMilestone} from './actions/edit-milestones-actions';
import MilestonesCalendar from '../../components/calendar'
//import TimelineMilestone from '../../components/timeline';
import 'pubsub-js';
import './index.less';

class ProjectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('调用componentDidMount',Date.now());
        const {projectId} = this.props;
        if(this.props.milestoneProId != projectId && projectId){
            this.props.putProIdToStateAction(projectId);
            this.distributeActions(projectId,parseInt(Date.now()));

        }
    }

    componentWillReceiveProps(nextProps) {
        const {errMessage,closeSetMsResult,closeSetMsErr,projectId} = nextProps;
        if(this.props.milestoneProId != nextProps.projectId && projectId){
        //点击不同项目，重新加载数据
            this.distributeActions(projectId,parseInt(Date.now()));
            this.props.putProIdToStateAction(projectId);
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
        this.distributeActions(this.props.projectId,parseInt(Date.now()));
    }

    errCallback(errMessage,type){
        notification.error({
            message: type,
            description: errMessage,
            duration: 2
        });
    }


    distributeActions(id,date){
        const itemId = (id.toString().indexOf("_g") > 0 || id.toString().indexOf("_p") > 0)? id.substring(0,id.length-2):id;
        if(id.toString().indexOf("_g") > 0 ){
            this.props.getProjectSetMilestonesAction(itemId,date);
        }else{
            this.props.getProjectMilestonesAction(itemId,date);
        }

    }


    createMilestones(type){
        this.context.router.push({
            pathname: '/projectSetMilestonesEdit',
            state: {editType: type}
        });
    }

    onPanelChange(date,mode){
        if(mode == 'month'){
            this.distributeActions(this.props.projectId,parseInt(date))
        }else{
            //console.log('调用container onPanelChange',date.getYear(),mode)
        }
    }

    render(){
        const {loading,notFoundMsg,milestoneData} = this.props;
        const closeSetMsLoading = this.props.closeSetMsLoading?true:false;
        const id = this.props.projectId?this.props.projectId.toString():'';
        const projectId = id.indexOf("_g") > 0 || id.indexOf("_p") > 0?id.substring(0,id.length-2):id;
        return (

            <Spin spinning={loading} tip="正在加载数据，请稍候..." >

                <div style={{margin:15}}>
                    {id.toString().indexOf("_g") > 0?
                        <Row>
                    <div>
                        <Button type="primary"  onClick={this.createMilestones.bind(this,'add')}>创建里程碑</Button>
                    </div></Row>:<div></div>}

                    <MilestonesCalendar onPanelChange = {this.onPanelChange.bind(this)}
                                        milestoneData = {milestoneData}
                                        milestonesDetailPath="/projectSetMilestonesDetail"
                                        milestoneEditPath="/projectSetMilestonesEdit"/>/>
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
        milestoneData: state.milestones.items,
        loading: state.milestones.loading,
        errMessage: state.milestones.errMessage,
        milestoneProId: state.putMilestonesProId.milestoneProId,
        closeSetMsLoading: state.closeSetMilestone.loading,
        closeSetMsResult: state.closeSetMilestone.result,
        closeSetMsErr: state.closeSetMilestone.errorMsg,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProjectSetMilestonesAction: bindActionCreators(getProjectSetMilestones, dispatch),
        getProjectMilestonesAction: bindActionCreators(getProjectMilestones, dispatch),
        putProIdToStateAction: bindActionCreators(putProIdToState, dispatch),
        closeSetMilestoneAction:  bindActionCreators(closeSetMilestone, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetMilestones);