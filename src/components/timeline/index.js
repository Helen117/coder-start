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

    timelineItemConst(timeLineData){
        let timeLine = [];
        if (timeLineData && timeLineData.length>0){
            timeLine = timeLineData.map((item) => {
                const timelineColor = this.setMilestoneColor(item.state,item.due_date);
                const groupId = this.props.id;
                //item.due_date = this.getTime(item.due_date);
                let i = 0;
                return (
                    <Timeline.Item color={timelineColor}  key={'milestones' + item.id} >
                        <Tooltip placement="rightBottom" title="点击可修改">
                            <a onClick = {this.editMilestone.bind(this,item)}>
                                <h4 style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑 {item.title}</h4>
                            </a>
                        </Tooltip>

                        {item.description}
                        <div style={{marginLeft:12}}>
                            <p>计划发布时间：{this.getTime(item.due_date)}</p>
                            当前里程碑共有事宜 <span>{item.total}</span> 项,还有待办事宜 <span>{item.unfinished}</span> 项，超时未完成事宜 <span>{item.expired}</span> 项
                            <Progress percent={item.rate} />
                            <div className="pull-right" >
                                {groupId?groupId.indexOf("_g")>0?
                                   <a style={{marginRight:15}} onClick = {this.editMilestone.bind(this,item)}>修改</a>
                                    :<div></div>:<div></div>}
                                <a style={{marginRight:20}} onClick = {this.closeMilestone.bind(this,item)}>关闭</a>

                            </div>

                            <a onClick={this.milestonesDetail.bind(this, item.id)}>查看问题</a>
                        </div>
                    </Timeline.Item>
                    )
            })
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

