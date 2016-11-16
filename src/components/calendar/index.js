/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */
import React ,{PropTypes}from 'react';
import { Calendar,Tooltip ,Progress,Icon,Badge} from 'antd';
import './index.less';


export default class MilestonesCalendar extends React.Component{
    constructor (props) {
        super(props);
    }



    getTime(date) {
        return new Date(parseInt(date)).toLocaleDateString();
    }

    editMilestone(item,value){
        const milestoneEditPath = this.props.milestoneEditPath;
        this.context.router.push({
            pathname: milestoneEditPath,
            state: {editType: "update", item: item, date: value.time}
        });

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

    tooltip(milestoneData){

        return(
            <div>
                <a>
                    <h4>里程碑 {milestoneData.title}</h4>
                </a>
                {milestoneData.description}
                <div style={{marginLeft:12}}>
                    <p>计划发布时间：{this.getTime(milestoneData.due_date)}</p>
                    当前里程碑共有事宜 <a onClick={this.milestonesDetail.bind(this, milestoneData.id)}>{milestoneData.total}</a> 项,还有待办事宜 <span>{milestoneData.unfinished}</span> 项，超时未完成事宜 <span>{milestoneData.expired}</span> 项
                    <Progress percent={milestoneData.rate}  />
                </div>
            </div>
        )
    }

    setMilestoneType(state,due_date,unfinished){
        let type = {};
        if (state == 'closed'){
            type="success"
        }else if(state == 'active' && due_date <= Date.now() && unfinished>0){
            type="error"
        }else{
            type="processing"
        }
        return type;
    }

    getListData(milestoneData,value) {
        const type = this.setMilestoneType(milestoneData.state,milestoneData.due_date,milestoneData.unfinished);
        const tooltip = this.tooltip(milestoneData);
        let revocable = false;
        if(milestoneData.state != 'closed'){
            revocable = true;
        }
        const calendarTime = this.getTime(value.time);
        const due_date = this.getTime(milestoneData.due_date);
        return(
            calendarTime==due_date?<Tooltip placement="top" title={tooltip}>

                <div style={{height:'100%'}}>
                    <a onClick = {revocable?this.editMilestone.bind(this,milestoneData,value):null} >
                        <Badge className="pull-right" count={milestoneData.expired}>
                        </Badge>
                        <ol className="events">
                                <h4 > <Badge status={type} />{milestoneData.title}</h4>
                            <li>{milestoneData.description}</li>
                        </ol>

                    </a>

                </div>

            </Tooltip>:<div></div>
        )


    }
    dateCellRender(milestoneData,value) {
        if(milestoneData) {
            for (let i = 0; i < milestoneData.length; i++) {
                const colorId = i%6;
                const calendarTime = value.getDayOfMonth();
                const due_date = new Date(milestoneData[i].due_date).getDate();
                if(value.time<milestoneData[i].due_date+60*60*24*1000){
                    const dateCellData = this.getListData(milestoneData[i],value);
                    return <div className={`background-${colorId}`} >{dateCellData}</div>;
                }

            }
        }
        //return <div style={{backgroundColor:'red'}} >11111</div>
    }



    getMonthData(milestoneData,value) {
        if (value.getMonth() === 8) {
            return 1394;
        }
    }

    monthCellRender(milestoneData,value) {
        let num = this.getMonthData(milestoneData,value);
        return num ? <div className="notes-month">
            <section>{num}</section>
            <span>待办事项数</span>
        </div> : null
    }


    onPanelChange(date,mode){
        const onPanelChange = this.props.onPanelChange;
        onPanelChange(date.time,mode);
    }


    render(){
        const milestoneData = this.props.milestoneData
        return (
            <Calendar dateCellRender={this.dateCellRender.bind(this,milestoneData)}
                      monthCellRender={this.monthCellRender.bind(this,milestoneData)}
                      onPanelChange = {this.onPanelChange.bind(this)}/>);
    }
}

MilestonesCalendar.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};




