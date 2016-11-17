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

    editMilestone(item,date){
        const milestoneEditPath = this.props.milestoneEditPath;
        this.context.router.push({
            pathname: milestoneEditPath,
            state: {editType: "update", item: item, date: date}
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
            type="default"
        }
        return type;
    }

    getListData(milestoneData,calendarTime) {
        const type = this.setMilestoneType(milestoneData.state,milestoneData.due_date,milestoneData.unfinished);
        const tooltip = this.tooltip(milestoneData);
        let revocable = false;
        if(milestoneData.state != 'closed'){
            revocable = true;
        }
        return(
            <Tooltip placement="top" title={tooltip}>
             <div style={{height:'100%'}}>
                 <a onClick = {revocable?this.editMilestone.bind(this,milestoneData,calendarTime):null} >
                     {milestoneData.expired>0?<Badge className="pull-right" count={milestoneData.expired}>
                     </Badge>:<div></div>}
                     <ol className="events">
                     <h4 style={{color:type=="error"?"red":"default"}}> <Badge status={type} />{milestoneData.title}</h4>
                     <li>{milestoneData.description}</li>
                     </ol>
                 </a>
             </div>
         </Tooltip>)
    }

    dateCellRender(milestoneData,value) {
        if(milestoneData) {
            for (let i = 0; i < milestoneData.length; i++) {
                const calendarTime = new Date(value).getTime();
                const milestoneTime = milestoneData[i].due_date+60*60*24*1000;
                const colorId = i%6;
                if(calendarTime < milestoneTime){
                    //console.log(calendarTime,milestoneTime,this.getTime(calendarTime),this.getTime(milestoneTime))
                    const dateCellData = this.getListData(milestoneData[i],calendarTime);
                    return <div className={`background-${colorId}`} >{this.getTime(calendarTime)==this.getTime(milestoneData[i].due_date) ?dateCellData:null}</div>;
                }

            }
        }
        //return <div style={{backgroundColor:'red'}} >11111</div>
    }


    getMonthData(milestoneList,calendarTime) {
        return <ul className="events">
            {
                milestoneList.map((item, index) =>
                    <Tooltip key={index} placement="left" title={this.tooltip(item)}>
                        <li key={index} >
                            <Badge status={this.setMilestoneType(item.state,item.due_date,item.unfinished)} />{item.title}
                        </li>
                    </Tooltip>
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
        const calendarTime = new Date(date).getTime();
        const onPanelChange = this.props.onPanelChange;
        onPanelChange(calendarTime,mode);
    }


    render(){
        const milestoneData = this.props.milestoneData;
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




