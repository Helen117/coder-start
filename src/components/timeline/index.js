/**
 * Created by zhaojp on 2016/10/19.
 */
import React,{PropTypes} from 'react';
import { Timeline,Progress,BackTop  } from 'antd';


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
        const milestonesDetailPath = this.props.milestonesDetailPath;
        this.context.router.push({
            pathname: milestonesDetailPath,
            state: {milestonesId,projectId}
        });
    }

    timelineItemConst(timeLineData){
        let timeLine = [];
        if (timeLineData && timeLineData.length>0){
            timeLine = timeLineData.map((item) => {
            const timelineColor = this.setMilestoneColor(item.state,item.due_date);
                let i = 0;
                return (

                        <Timeline.Item color={timelineColor}  key={'milestones' + item.id} >
                            <h4 style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑 {item.title}</h4>
                            <p>{item.description}</p>
                            <div >
                                <p >计划发布时间：{this.getTime(item.due_date)}</p>
                                {/*<p>创建人：{item.owner}</p>*/}
                                <p>当前里程碑共有事宜 <span>{item.total}</span> 项,还有待办事宜 <span>{item.unfinished}</span> 项，超时未完成事宜 <span>{item.expired}</span> 项</p>
                                <Progress percent={item.rate} />
                                <a onClick={this.milestonesDetail.bind(this, item.id)}>查看问题</a>
                            </div>
                        </Timeline.Item>)
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
                    (<span className="filter-not-found">{notFoundMsg?notFoundMsg:'该项目下无里程碑数据'}</span>)
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
