/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress,notification,BackTop} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestones} from './actions/milestones-action';
import {getMoreMilestones} from './actions/more-milestones-actions';

import './index.less';



class Milestones extends React.Component {
    constructor(props) {
        super(props);
        this.isMoreData=false;
        this.page =1;
        this.data = [];
        console.log('调用构造函数');
    }


    componentDidMount() {
        //首页初始化数据
        if(this.props.getProjectInfo) {
            const {moreMilestoneData} = this.props;
            const projectId = this.props.getProjectInfo.gitlabProject.id;
            this.data =[];
            this.props.getMilestones(projectId,this.page);
        }else{
            const {router} = this.context;
            router.goBack();
            this.errChoosePro();
        }

    }

    errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在“代码管理“中选择一个项目！',
            duration: 2
        });
    }


    componentWillReceiveProps(nextProps) {
        const actionType = this.props.actionType;
        const acquireData = nextProps.acquireData;
        const {errMessage } = nextProps;
        //点击查看更多无新数据时提醒
        if(this.props.milestoneData =='' && nextProps.milestoneData=='' && this.page != 1 && acquireData){
            this.warnCallback();
        }
        //切换项目时首页初始化数据
        if(this.page == 1) {

            if (this.props.getProjectInfo) {
                const {moreMilestoneData} = this.props;
                const projectId = this.props.getProjectInfo.gitlabProject.id;
                this.data = [];console.log()
                console.log('切换项目时首页初始化数据');
                this.props.getMilestones(projectId, this.page);
            } else {
                const {router} = this.context;
                router.goBack();
                this.errChoosePro();
            }
        }
        //将新获取到的数据拼接合并
        if(this.props.milestoneData != nextProps.milestoneData ) {
            const moreMilestoneData = nextProps.milestoneData;
            for(let i=0; i<moreMilestoneData.length; i++) {
                    this.data.push(moreMilestoneData[i]);
            }
            this.props.getMoreMilestones(this.data);
        }
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }
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
            description: '无更多数据!',
            duration: 2
        });
    }

    moreMilestones(){
        const projectId = this.props.getProjectInfo.gitlabProject.id;
        this.page ++;
        this.props.getMilestones(projectId,this.page);

    }

    //时间戳转换成日期
    getTime(date) {
        return new Date(parseInt(date)).toLocaleDateString();
    }

    //根据状态及完成情况设置时间轴颜色
    setMilestoneColor(state,due_date){
        let timelineColor = '';
        if (state == 'closed'){
            timelineColor="green";
        }else if(state == 'active' && due_date <= Date.now()){
            timelineColor="red";
        }else{
            timelineColor="blue";
        }
        return timelineColor;
    }

    milestonesDetail(milestonesId){
        const projectId = this.props.getProjectInfo.gitlabProject.id;
        this.context.router.push({
            pathname: '/milestonesDetail',
            state: {milestonesId,projectId}
        });
    }

    createMilestones(){
        this.context.router.push({
            pathname: '/createMilestones',
            //state: {}
        });
    }

    timelineItemConst(){
        const {moreMilestoneData} = this.props;
        if (moreMilestoneData){
            var timeLine = moreMilestoneData.map((item) => {
                const timelineColor = this.setMilestoneColor(item.gitlabMilestone.state,item.gitlabMilestone.due_date);
                let i = 0;
                return (
                    <Timeline.Item color={timelineColor}  key={'milestones' + item.gitlabMilestone.id} >
                        <h4 style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑 {item.gitlabMilestone.title}</h4>
                        <p>{item.gitlabMilestone.description}</p>
                        <div style={{marginLeft:12,width:"70%"}}>
                            <p >计划发布时间：{this.getTime(item.gitlabMilestone.due_date)}</p>
                            <p>创建人：{item.owner}</p>
                            <span>待解决的问题：</span>
                            {item.issues.length>0?item.issues.map((node) => {
                                i++;
                                return (<p style={{marginLeft:12}} key={i} >{i}.{node}</p>)}):<span>无</span>
                            }
                            <Progress percent={item.rate} />
                            <a onClick={this.milestonesDetail.bind(this, item.gitlabMilestone.id)}>查看更多</a>
                        </div>
                    </Timeline.Item>)
            })
        }else{
            var timeLine ='';
        };
        return timeLine;
    }

    render(){
        this.timeline =[];
        const {loading, loadingMsg,notFoundMsg} = this.props;
        const timeLine = this.timelineItemConst();
        return (
            <div style={{marginTop:5,marginLeft:5}}>
                <div style={{marginBottom: 16}}>
                    <Button onClick={this.createMilestones.bind(this,'add',null)}>新建里程碑</Button>
                </div>

                {loading?(
                    <span className="filter-not-found">
                        <i className="anticon anticon-loading"><span style={{paddingLeft:5}}>{loadingMsg?loadingMsg:'正在加载数据...'}</span></i>
                    </span>
                ):(
                    timeLine.length==0?
                        (<span className="filter-not-found">{notFoundMsg?notFoundMsg:'该项目下无里程碑数据'}</span>)
                        :(<Timeline pending={<a onClick={this.moreMilestones.bind(this)}>查看更多</a>}>{timeLine}</Timeline>)
                )}
                <BackTop />

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
        moreMilestoneData: state.moreMilestonesData.moreData,
        milestoneData: state.milestones.items,
        acquireData: state.milestones.acquireData,
        loading: state.milestones.loading,
        loadErrors: state.milestones.loadErrors,
        actionType: state.moreMilestonesData.actionType,
        getProjectInfo: state.getProjectInfo.projectInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestones: bindActionCreators(getMilestones, dispatch),
       getMoreMilestones: bindActionCreators(getMoreMilestones, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Milestones);