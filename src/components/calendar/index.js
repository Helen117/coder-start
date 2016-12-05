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
        this.context.router.push({
            pathname: milestoneEditPath,
            state: {editType: "update", item: item, date: this.props.defaultValue,mode: setMode}
        });

    }

    milestonesDetail(milestonesId, state,due_end){
        const id = this.props.id;
        let setId=null,projectId=null;
        if(id.indexOf('_g')>0){
            setId = this.props.projectId;
        }else{
            projectId = this.props.projectId;
        }
        const milestonesDetailPath = this.props.milestonesDetailPath;

        this.context.router.push({
            pathname: milestonesDetailPath,
            state: {milestonesId,setId,projectId,state,due_end}
        });
    }

    milestoneTooltip(milestoneData){
        const type = this.setMilestoneType(milestoneData.state,milestoneData.due_date)
        let milestoneState='';
        if(type == 'success'){
            milestoneState = "已完成"
        }else if(type == 'error'){
            milestoneState = "已超时"
        }else{
            milestoneState = "新建"
        }
        return(
            <div>
                <h4>{milestoneData.title}</h4>
                <div style={{marginLeft:8}}>
                    {milestoneData.description}
                    <p>状态：{milestoneState}</p>
                    <p>计划发布时间：{this.getTime(milestoneData.due_date)}</p>
                    当前里程碑共有事宜 <a onClick={this.milestonesDetail.bind(this, milestoneData.id,null,null)}>{milestoneData.total}</a> 项,
                    还有待办事宜 <a onClick={this.milestonesDetail.bind(this, milestoneData.id,'opened',null)}>{milestoneData.unfinished}</a> 项，
                    超时未完成事宜 <a onClick={this.milestonesDetail.bind(this, milestoneData.id,'opened',Date.parse(new Date()))}>{milestoneData.expired}</a> 项
                    <Progress percent={milestoneData.rate}  />
                </div>
            </div>
        )
    }


    issueTooltip(issue){
        const type = this.setMilestoneType(issue.state,Date.now())
        let issueState='';
        if(type == 'success'){
            issueState = "已完成"
        }else if(type == 'error'){
            issueState = "已超时"
        }else{
            issueState = "新建"
        }
        return(
            <div>
                <h4>{issue.title}</h4>
                <div style={{marginLeft:8}}>
                    {issue.description}
                    {/*<p>指派给：{issue.assigne}</p>*/}
                    <p>状态：{issueState}</p>
                    <p>计划完成时间：{issue.dueDate? this.getTime(issue.dueDate):"未设置"}</p>
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
        const type = this.setMilestoneType(milestoneData.state,milestoneData.due_date);
        if(revocable){
            return <a onClick = {this.editMilestone.bind(this,milestoneData,calendarTime)} >
                <h4 style={{color:type=="error"?"red":""}}>
                    <Badge status={type}/>{milestoneData.title} <Icon type="edit" />
                </h4>
            </a>
        }else{
            return <h4 style={{color:type=="error"?"red":""}}>
                <Badge status={type}/>{milestoneData.title}
            </h4>
        }
    }

    getMilestoneData(milestoneData,calendarTime) {
        const tooltip = this.milestoneTooltip(milestoneData);
        return(
            <div style={{marginLeft:3}}>
                <Tooltip placement="top" title={tooltip}>
                    <ul className="events">
                         <li>{this.titleDecorate(milestoneData,calendarTime)}</li>
                         <li>{milestoneData.description}</li>
                    </ul>
                </Tooltip>
            </div>
         )
    }

    getIssuesData(issueList){
        return <ul className="events">
            {
                issueList.map((item, index) =>{
                    const type =  this.setMilestoneType(item.state,Date.now());
                    const issueTooltip = this.issueTooltip(item)
                    return  <Tooltip placement="top" title={issueTooltip} key={index}>
                        <li key={index} >
                            <div>
                            <span className={`event-${type}`}>● </span>
                            {item.title}
                            </div>
                        </li>
                    </Tooltip>
                }

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
                    console.log()
                    for(let j=0; j<milestoneData[i].issues.length; j++ ){
                        if(this.getTime(calendarTime) == this.getTime(milestoneData[i].issues[j].dueDate)){
                            issuesList.push(milestoneData[i].issues[j])
                        }else if(milestoneData[i].issues[j].dueDate == null){
                            if(this.getTime(calendarTime) == this.getTime(milestoneData[i].due_date)){
                                issuesList.push(milestoneData[i].issues[j])
                            }
                        }
                    }
                    issuesMount = this.getIssuesData(issuesList);
                    const dateCellMount =<div className={`background-${colorId}`} > {milestoneMount}{issuesMount}</div>
                    return dateCellMount
                }

            }
        }
    }


    getMonthData(milestoneList,calendarTime) {
        return <ul  style={{marginLeft:3}} className="events">
            {
                milestoneList.map((item, index) => {
                    const type = this.setMilestoneType(item.state, item.due_date)
                       return <li style={{paddingTop: 5}} key={index}>
                            <Tooltip key={index} placement="top" title={this.milestoneTooltip(item)}>
                                {this.titleDecorate(item,calendarTime)}
                            </Tooltip>
                        </li>
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




