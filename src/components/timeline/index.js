/**
 * Created by zhaojp on 2016/10/19.
 */
import React,{PropTypes} from 'react';
import { Timeline,Progress,BackTop , Tooltip ,Button, Modal, notification} from 'antd';

const confirm = Modal.confirm;
export default class TimelineMilestone extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
    }

    getTime(date) {
        return new Date(parseInt(date)).toLocaleDateString();
    }

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
        console.log('点击查看里程碑下问题')
        const projectId = this.props.projectId;
        const id = this.props.id;
        const milestonesDetailPath = this.props.milestonesDetailPath;
        this.context.router.push({
            pathname: milestonesDetailPath,
            state: {milestonesId,projectId,id}
        });
    }

    editMilestone(item){
        const milestoneEditPath = this.props.milestoneEditPath;
        this.context.router.push({
            pathname: milestoneEditPath,
            state: {editType: "update", item: item}
        });

    }

    closeMilestone(item){
        const projectId = this.props.projectId;
        const id = this.props.id;
        const milestoneClose = this.props.milestoneClose;
        if(item.rate == 100) {
            confirm({
                title: '您是否确定要关闭里程碑',
                content: '您是否确定要关闭里程碑',
                onOk() {
                    milestoneClose(item.id,projectId,id);
                },
                onCancel() {
                }
            })
        }else{
            this.errClose();
        }
    }

    errClose(){
        notification.error({
            message: '当前里程碑不能关闭',
            description: "请在当前里程碑的事项全部完成之后再进行关闭操作",
            duration: 2
        });
    }

    viewHis(){
        const {viewHis} = this.props;
        viewHis();
    }

    timelineItemConst(timeLineData){
        let timeLine = [];
        if (timeLineData && timeLineData.length>0){
            for(let i=0; i<timeLineData.length; i++){
                if(i == 0){

                    timeLine.push(
                        <Timeline.Item key={'viewHis'} >
                            <a onClick={this.viewHis.bind(this)}>查看历史</a>
                        </Timeline.Item>)
                }
                //里程碑只能按顺序关闭，若里程碑已关闭，不显示关修改、关闭按钮，
                    let revocable = false;
                    let closable = false;
                    if(timeLineData[i+1] && timeLineData[i-1]){
                        if(timeLineData[i].state!='closed' && timeLineData[i+1].state=='closed' && timeLineData[i-1].state!='closed'){
                            closable = true;
                        }
                    }else if(!timeLineData[i+1] && timeLineData[i].state != 'closed' ){
                        closable = true;
                    }else if(!timeLineData[i-1] && timeLineData[i].state != 'closed' && timeLineData[i+1].state=='closed'){
                        closable = true;
                    }

                    if(timeLineData[i].state != 'closed'){
                        revocable = true;
                    }
                    const timelineColor = this.setMilestoneColor(timeLineData[i].state,timeLineData[i].due_date);
                    const groupId = this.props.id.toString();
                    timeLine.push (
                            <Timeline.Item color={timelineColor}  key={'milestones' + timeLineData[i].id} >
                                <Tooltip placement="rightBottom" title={revocable?"点击可修改":''}>
                                    <a onClick = {revocable?this.editMilestone.bind(this,timeLineData[i]):null}>
                                        <h4 style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑 {timeLineData[i].title}</h4>
                                    </a>
                                </Tooltip>

                                {timeLineData[i].description}
                                <div style={{marginLeft:12}}>
                                    <p>计划发布时间：{this.getTime(timeLineData[i].due_date)}</p>
                                    当前里程碑共有事宜 <span>{timeLineData[i].total}</span> 项,还有待办事宜 <span>{timeLineData[i].unfinished}</span> 项，超时未完成事宜 <span>{timeLineData[i].expired}</span> 项
                                    <Progress percent={timeLineData[i].rate}  /> {/*showInfo={true} status="exception"*/}
                                    <div className="pull-right" >
                                        {groupId?groupId.indexOf("_g")>0?
                                            <div>
                                                {revocable?<a style={{marginRight:15}} onClick = {this.editMilestone.bind(this,timeLineData[i])}>修改</a>:<div/>}
                                                {closable?<a style={{marginRight:20}} onClick = {this.closeMilestone.bind(this,timeLineData[i])}>关闭</a>:<div/>}
                                            </div>:<div></div>:<div></div>}
                                    </div>
                                    <a onClick={this.milestonesDetail.bind(this, timeLineData[i].id)}>查看问题</a>
                                </div>
                            </Timeline.Item>
                    )
                }

        };
        return timeLine;
    }

    render(){
        const timeLine = this.timelineItemConst(this.props.timeLineData);
        const notFoundMsg = this.props.notFoundMsg;
        const loading = this.props.loading;
        const pending = this.props.pending;
        return(
            <div style={{width:"50%"}}>
            {loading?
                (<span className="filter-not-found">
                        <i className="anticon anticon-loading">
                            <span style={{paddingLeft:5}}>{'正在加载数据...'}</span>
                        </i>
                    </span>
                ):(timeLine.length==0?
                    (<span className="filter-not-found">{notFoundMsg?notFoundMsg:'无数据信息'}</span>)
                    :(<Timeline pending={pending}>
                        {timeLine}
                    </Timeline>)
            )}
            <BackTop />
        </div>
        )
    }
}

TimelineMilestone.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

