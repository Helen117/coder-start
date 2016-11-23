/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress,notification,BackTop,Spin,message,Badge} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {putProIdToState,getProjectSetMilestones} from './actions/milestones-action';
import {closeSetMilestone} from './actions/edit-milestones-actions';
import MilestonesCalendar from '../../components/calendar'
//import TimelineMilestone from '../../components/timeline';
import moment from 'moment'
import 'pubsub-js';
import './index.less';

let defaultDate=moment();
let setMode = 'month'
class ProjectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {projectId} = this.props;
        if(this.props.milestoneProId != projectId && projectId){
            this.props.putProIdToStateAction(projectId);
            this.props.getProjectSetMilestonesAction(projectId,defaultDate.valueOf(),setMode);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {errMessage,closeSetMsResult,closeSetMsErr,projectId} = nextProps;
        if(this.props.projectId != nextProps.projectId && projectId){
        //点击不同项目，重新加载数据
            //console.log('点击不同项目，重新加载数据',this.props.milestoneProId,nextProps.projectId)
            this.props.getProjectSetMilestonesAction(projectId,defaultDate.valueOf(),setMode);
            this.props.putProIdToStateAction(projectId);
        }
        //数据加载错误提示
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage,'数据加载失败');
        }
        /*if(this.props.closeSetMsResult != closeSetMsResult && closeSetMsResult){
            this.sucCallback('里程碑关闭成功');
        }else if(this.props.closeSetMsErr != closeSetMsErr && closeSetMsErr){
            this.errCallback(closeSetMsErr,'里程碑关闭失败');
        }*/
    }

    /*sucCallback(type){
        message.success(type);
        this.props.getProjectSetMilestonesAction(this.props.projectId,Date.now(),'year');

    }*/

    errCallback(errMessage,type){
        notification.error({
            message: type,
            description: errMessage,
            duration: 2
        });
    }

    createMilestones(type){
        this.context.router.push({
            pathname: '/projectSetMilestonesEdit',
            state: {editType: type, mode:setMode, date:defaultDate}
        });
    }

    onPanelChange(calendarTime,date,mode){
        defaultDate=date;
        setMode = mode;
        this.props.getProjectSetMilestonesAction(this.props.projectId,calendarTime,mode);
    }

    render(){
        const {milestoneData} = this.props;
        const isSpinning = this.props.loading? this.props.loading :false;
        const id = this.props.projectId?this.props.projectId.toString():'';
        const projectId = id.indexOf("_g") > 0 || id.indexOf("_p") > 0?id.substring(0,id.length-2):id;
        return (
            <Spin spinning={isSpinning} tip="正在加载数据，请稍候..." >
                <div id="mycalender" style={{margin:5}}>
                    {id.toString().indexOf("_g") > 0?
                        <Row>
                            <div style={{textAlign:"right"}}>
                                <Button type="primary"  onClick={this.createMilestones.bind(this,'add')}>创建里程碑</Button>
                            </div>
                        </Row>:<div></div>}
                    <MilestonesCalendar onPanelChange = {this.onPanelChange.bind(this)}
                                        milestoneData = {milestoneData}
                                        milestonesDetailPath="/projectSetMilestonesDetail"
                                        milestoneEditPath="/projectSetMilestonesEdit"
                                        projectId = {projectId}
                                        id = {id}
                                        defaultValue = {defaultDate}
                                        mode = {setMode}/>
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
        putProIdToStateAction: bindActionCreators(putProIdToState, dispatch),
        closeSetMilestoneAction:  bindActionCreators(closeSetMilestone, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetMilestones);