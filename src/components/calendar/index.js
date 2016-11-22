/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */
import React ,{PropTypes}from 'react';
import { Calendar,Tooltip ,Progress,Icon,Badge} from 'antd';
//import zhCN from 'antd/lib/calendar/locale/en_US';
import './index.less';
import moment from 'moment';
import ReactDOM from 'react-dom'

let setMode = 'month'
export default class MilestonesCalendar extends React.Component{
    constructor (props) {
        super(props);
    }


    getTime(date) {
        return new Date(parseInt(date)).toLocaleDateString();
    }

    editMilestone(item,date){
        const milestoneEditPath = this.props.milestoneEditPath;
        console.log('edit   setMode',setMode)
        this.context.router.push({
            pathname: milestoneEditPath,
            state: {editType: "update", item: item, date: this.props.defaultValue,mode: setMode}
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
        const type = this.setMilestoneType(milestoneData.state,milestoneData.due_date,milestoneData.unfinished)
        let milestoneState='';
        if(type == 'success'){
            milestoneState = "已完成"
        }else if(type == 'error'){
            milestoneState = "已超时"
        }else{
            milestoneState = "正常"
        }
        return(
            <div>
                <a>
                    <h4>里程碑 {milestoneData.title}</h4>
                </a>
                {milestoneData.description}
                <div style={{marginLeft:12}}>
                    <p>状态：{milestoneState}</p>
                    <p>计划发布时间：{this.getTime(milestoneData.due_date)}</p>
                    当前里程碑共有事宜 <a onClick={this.milestonesDetail.bind(this, milestoneData.id)}>{milestoneData.total}</a> 项,还有待办事宜 <span>{milestoneData.unfinished}</span> 项，超时未完成事宜 <span>{milestoneData.expired}</span> 项
                    <Progress percent={milestoneData.rate}  />
                </div>
            </div>
        )
    }

    setMilestoneType(state,due_date){
        let type = {};
        if (state == 'closed'){
            type="success"
        }else if(state == 'active' && due_date <= Date.now() || state=='expired'){
            type="error"
        }else{
            type="default"
        }
        return type;
    }

    isRevocable(state,id){
        let revocable = false;
        if(state != 'closed' && id.indexOf('_g')>0){
            revocable = true;
        }
        return revocable;
    }

    titleDecorate(milestoneData,calendarTime){
        const id = this.props.id

        const revocable = this.isRevocable(milestoneData.state,id);
        const type = this.setMilestoneType(milestoneData.state,milestoneData.due_date,milestoneData.unfinished);

        if(revocable){
            return <a onClick = {this.editMilestone.bind(this,milestoneData,calendarTime)} >
                <h4 style={{color:type=="error"?"red":""}}>
                    <Badge status={type}/>{milestoneData.title}   <Icon type="edit" />
                </h4>
            </a>
        }else{
            return <div><Badge status={type}/>{milestoneData.title}</div>
        }
    }

    getMilestoneData(milestoneData,calendarTime) {
        const tooltip = this.tooltip(milestoneData);
        return(
                <div>
                    <Tooltip placement="top" title={tooltip}>
                        <ol className="events">
                             {this.titleDecorate(milestoneData,calendarTime)}
                            <li>{milestoneData.description}</li>
                        </ol>
                    </Tooltip>
{/*
                    <div style={{textAlign:"right", marginRight:0}}>
                        <Tooltip placement="top" title={"点击查看超时任务"}>
                        <Badge className="pull-right" onClick={this.milestonesDetail.bind(this, milestoneData.id)} count={milestoneData.expired}/>
                        </Tooltip>
                    </div>*/}
                </div>
         )
    }

    getIssuesData(issueList){
        return <ul className="events">
            {
                issueList.map((item, index) =>
                    <div style={{paddingTop:5}} key={index} >
                        <Badge status={this.setMilestoneType(item.state,item.dueDate,0)} />
                        <div>{item.title}</div>
                    </div>
                )
            }
        </ul>
    }

    dateCellRender(milestoneData,value) {
        const calendarTime = new Date(value).getTime();

        if(milestoneData) {
            for (let i = 0; i < milestoneData.length; i++) {
                const milestoneTime = milestoneData[i].due_date+60*60*24*1000;
                const colorId = i%6;
                if(calendarTime < milestoneTime){
                    let milestoneMount = null,issuesMount = null;
                    let issuesList = [];
                    if(this.getTime(calendarTime) == this.getTime(milestoneData[i].due_date)){
                        milestoneMount = this.getMilestoneData(milestoneData[i],calendarTime);
                    }
                    /*for(let j=0; j<milestoneData[i].issues.length; j++ ){
                        if(this.getTime(calendarTime) == this.getTime(milestoneData[i].issues[j].dueDate)){
                            issuesList.push(milestoneData[i].issues[j])
                        }
                    }
                    issuesMount = this.getIssuesData(issuesList);*/
                    const dateCellMount =<div className={`background-${colorId}`} > {milestoneMount}{issuesMount}</div>
                    return dateCellMount
                }

            }
        }
    }


    getMonthData(milestoneList,calendarTime) {
        return <ul className="events">
            {
                milestoneList.map((item, index) => {
                    const type = this.setMilestoneType(item.state, item.due_date, item.unfinished)
                       return <div style={{paddingTop: 5}} key={index}>
                            <Tooltip key={index} placement="top" title={this.tooltip(item)}>
                                {this.titleDecorate(item,calendarTime)}
                            </Tooltip>
                        </div>
                    }
                )
            }
        </ul>

    }

    monthCellRender(milestoneData,value){
        if(milestoneData) {
            let milestoneList = [];
            for (let i = 0; i < milestoneData.length; i++) {
                if (value.month() == new Date(milestoneData[i].due_date).getMonth()) {
                    milestoneList.push(milestoneData[i]);
                }
            }
            const monthCellData = this.getMonthData(milestoneList, value.month());
            return monthCellData;
        }
    }

    onPanelChange(date,mode){
        setMode = mode;
        console.log('setMode',setMode)
        const calendarTime = new Date(date).getTime();
        const {onPanelChange} = this.props;
        onPanelChange(calendarTime,date,mode);
    }


    render(){
        //locale={zhCN}
        //console.log('this.props.defaultValue',this.props.defaultValue)
        const milestoneData = this.props.milestoneData;
        return (
            <Calendar
                      dateCellRender={this.dateCellRender.bind(this,milestoneData)}
                      monthCellRender={this.monthCellRender.bind(this,milestoneData)}
                      onPanelChange = {this.onPanelChange.bind(this)}
                      defaultValue={this.props.defaultValue}
                      mode={this.props.mode}/>)
    }
}

MilestonesCalendar.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};




