/**
 * Created by helen on 2016/11/10.
 */

import React, {PropTypes,Component} from 'react';
import { Button,notification,Icon,Collapse,Steps,Table,Popover,Modal,Tooltip } from 'antd';
import Box from '../../components/box';
import * as jenkins from './actions/jenkins-build-action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import './index.less';

const Step = Steps.Step;
const Panel = Collapse.Panel;

 export class StageView extends Component {

     constructor(props) {
         super(props);
         this.state = {visible:false};
     }

     componentWillMount() {
         const {actions} = this.props;
         actions.workflowStage(186);
     }

     componentDidMount() {
         console.log("event:",window.event);
     }

     componentWillReceiveProps(nextProps) {
         const errorMsg = nextProps.error;
         if(errorMsg&& errorMsg != this.props.errorMsg){
             this.errorMessage('获取信息失败！',error);
         }
     }

     errorMessage(info,error){
         notification.error({
             message: info,
             description:error,
             duration:null,
         });
     }

     stageDetail(text,record){
         console.log("text:",text);
         console.log("record:",record);
         this.setState({visible:true});
     }

     codeChange(text,record){
         console.log("text:",text);
         console.log("record:",record);

         this.context.router.push({
             pathname: '/codeChange',
             state: {record: record}
         });
     }

     cancel(e) {
         this.setState({
             visible: false,
         });
     }

     rowClassName(record, index) {
         if (record.status == 'success') {
             return 'success';
         }
         if (record.status == 'failed') {
             return 'failed';
         }
     }

     getBuildList(list){
         const data =[];
         if(list){
             if(list.rows&&list.rows.length>0){
                 for(let i=0;i<list.rows.length;i++){
                     const dataSources ={};
                     dataSources.projectId=list.rows[i].projectId;
                     dataSources.jobName = list.rows[i].jobName;
                     dataSources.key = list.rows[i].buildNumber;
                     if(list.rows[i].buildDetails&&list.rows[i].buildDetails.length>0){
                         dataSources.startTime=list.rows[i].buildDetails[0].startTime;
                         dataSources.gitCommitId=list.rows[i].buildDetails[0].gitCommitId;
                         dataSources.commit = "changes";
                         for(let j=0;j<list.rows[i].buildDetails.length;j++){
                             let stageId = "stageId_"+list.rows[i].buildDetails[j].stageId;
                             let status = stageId + '_status';
                             let errorMsg = stageId + '_errorMsg';
                             dataSources[stageId]=list.rows[i].buildDetails[j].durationDesc;
                             dataSources[status] = list.rows[i].buildDetails[j].status;
                             dataSources[errorMsg] = list.rows[i].buildDetails[j].errorMsg;
                         }
                     }
                     // console.log("dataSources:",dataSources);
                     data.push(dataSources);
                 }
             }
         }
         // console.log('data:',data);
         return data;
     }

     bgColor(status){
         console.log("status:",status);
         let style={};
         if (status == '2') {
             style ={backgroundColor: "#ffb6c1",color:"red"};
         }else if(status == '1'){
             style ={backgroundColor: "#f0fff0"};
         }else if(status == '0'){
             style ={backgroundColor: "#f0fff0"};
         }else{
             style ={backgroundColor: "#e9e9e9"};
         }
         console.log("style:",style);
         return style;
 };

     render() {

         // return(
         //     <Box title="编译发布过程一览">
         //         <Steps size="small" style={{marginTop: 16}}>
         //             <Step status="finish" title="更新代码" />
         //             <Step status="process" title="编译" />
         //             <Step status="wait" title="生成单元测试案例" />
         //             <Step status="wait" title="代码质量扫描"/>
         //             <Step status="wait" title="单元测试" />
         //             <Step status="wait" title="打包" />
         //             <Step status="wait" title="生成镜像"/>
         //             <Step status="wait" title="发布" />
         //             <Step status="wait" title="执行自动化测试"  />
         //         </Steps>
         //     </Box>
         // )

         const data = [{
             "startTime": "2016/11/15 12:00:00",
             "code_change": "没变更",
             "stageId_1": '1s',
             "checkout from git status": '1s',
             "stageId_100": "20s",
             "generating_test_case": "1min",
             "code_quality_scan": "20s",
             "unit_test": "50s",
             "package": "1min30s",
             "generated_mirror": "59s",
             "stageId_200": "5s",
             "auto_test": "30s",
             "status": "success"
         }, {
             "startTime": "2016/11/15 08:00:00",
             "code_change": "10 commits",
             "stageId_1": '1s',
             "stageId_100": "",
             "generating_test_case": "",
             "code_quality_scan": "",
             "unit_test": "",
             "package": "",
             "generated_mirror": "",
             "stageId_200": "",
             "auto_test": "",
             "status": "failed"
         }];

         const buildList = {
             "rows": [
                 {
                     "id": 25,
                     "projectId": 186,
                     "jobName": "devops-wfm-pipeline",
                     "buildNumber": 41,
                     "buildDetails": [
                         {
                             "id": 62,
                             "buildId": 25,
                             "stageId": 1,
                             "stageName": "checkout from git",
                             "status": 1,
                             "errorMsg": null,
                             "gitCommitId": "2587d1002bc2139b46c96b9978ab5f3dfa9f3c17",
                             "startTime": "2016-11-17 14:58:55",
                             "endTime": "2016-11-17 14:58:57",
                             "duration": 2000,
                             "durationDesc": "2秒"
                         },
                         {
                             "id": 63,
                             "buildId": 25,
                             "stageId": 100,
                             "stageName": "build and package",
                             "status": 0,
                             "errorMsg": null,
                             "gitCommitId": "2587d1002bc2139b46c96b9978ab5f3dfa9f3c17",
                             "startTime": "2016-11-17 14:58:57",
                             "endTime": "2016-11-17 14:59:03",
                             "duration": 6000,
                             "durationDesc": ""
                         },
                         {
                             "id": 64,
                             "buildId": 25,
                             "stageId": 200,
                             "stageName": "deploy",
                             "status": 1,
                             "errorMsg": null,
                             "gitCommitId": "2587d1002bc2139b46c96b9978ab5f3dfa9f3c17",
                             "startTime": "2016-11-17 14:59:03",
                             "endTime": "2016-11-17 14:59:04",
                             "duration": 1000,
                             "durationDesc": "1秒"
                         }
                     ]
                 },
                 {
                     "id": 24,
                     "projectId": 186,
                     "jobName": "devops-wfm-pipeline",
                     "buildNumber": 40,
                     "buildDetails": [
                         {
                             "id": 60,
                             "buildId": 24,
                             "stageId": 1,
                             "stageName": "build and package",
                             "status": 2,
                             "errorMsg": "连接超时",
                             "gitCommitId": null,
                             "startTime": "2016-11-17 14:58:39",
                             "endTime": null,
                             "duration": null,
                             "durationDesc": "30s"
                         }
                     ]
                 },
                 {
                     "id": 19,
                     "projectId": 186,
                     "jobName": "devops-wfm-pipeline",
                     "buildNumber": 39,
                     "buildDetails": [
                         {
                             "id": 45,
                             "buildId": 19,
                             "stageId": 1,
                             "stageName": "checkout from git",
                             "status": 1,
                             "errorMsg": null,
                             "gitCommitId": "2587d1002bc2139b46c96b9978ab5f3dfa9f3c17",
                             "startTime": "2016-11-17 12:25:11",
                             "endTime": "2016-11-17 12:25:13",
                             "duration": 2000,
                             "durationDesc": "2秒"
                         },
                         {
                             "id": 46,
                             "buildId": 19,
                             "stageId": 100,
                             "stageName": "build and package",
                             "status": 1,
                             "errorMsg": null,
                             "gitCommitId": "2587d1002bc2139b46c96b9978ab5f3dfa9f3c17",
                             "startTime": "2016-11-17 12:25:13",
                             "endTime": "2016-11-17 12:25:19",
                             "duration": 6000,
                             "durationDesc": "6秒"
                         },
                         {
                             "id": 47,
                             "buildId": 19,
                             "stageId": 200,
                             "stageName": "deploy",
                             "status": 1,
                             "errorMsg": null,
                             "gitCommitId": "2587d1002bc2139b46c96b9978ab5f3dfa9f3c17",
                             "startTime": "2016-11-17 12:25:19",
                             "endTime": "2016-11-17 12:25:21",
                             "duration": 2000,
                             "durationDesc": "2秒"
                         }
                     ]
                 }
             ],
             "total": 3
         };

         const text = "A dog is a type of domesticated animal.";

         // console.log("workflowStage:",this.props.workflowStage);
             
             return (
                 <Box title="编译发布过程一览">
                     <div id="mytable">
                     <Table columns={this.columns(this)} dataSource={this.getBuildList(buildList)}
                            bordered
                            size="middle"
                            loading={this.props.loading}
                            pagination={false}
                            //rowClassName={this.rowClassName}
                    >
                    </Table>
                         </div>

                     <Modal title="Stage Logs" visible={this.state.visible}
                            onCancel={this.cancel.bind(this)}
                            footer=''
                     >
                         <Collapse accordion>
                             <Panel header="This is panel header 1" key="1">
                                 <p>{text}</p>
                             </Panel>
                             <Panel header="This is panel header 2" key="2">
                                 <p>{text}</p>
                             </Panel>
                             <Panel header="This is panel header 3" key="3">
                                 <p>{text}</p>
                             </Panel>
                         </Collapse>
                     </Modal>
                </Box>
             )

         }
 }


StageView.contextTypes = {
         history: PropTypes.object.isRequired,
         router: PropTypes.object.isRequired,
         store: PropTypes.object.isRequired
     };


StageView.prototype.columns = (self)=>[
    {
        // title: '时间',
        colSpan: 2,
        dataIndex: 'startTime',
        width: '10%',
    },{
        colSpan: 0,
        dataIndex: 'commit',
        width: '8%',
        render(text,record){
            // if(text.indexOf("没变更")!=-1){
            //     return <span>{text}</span>
            // }else{
                return <a onClick={self.codeChange.bind(self,text,record)}>{text}</a>
            // }
        }
    },
         {
             title: '更新代码',
             dataIndex: 'stageId_1',
             width: '10%',
             render(text,record){
                 let style={textAlign:"center"};
                 let divStyle={};
                 if (record.stageId_1_status == '2') {
                     style={color:'red'};
                     divStyle ={backgroundColor: "#ffb6c1"}
                 }else if(record.stageId_1_status == '1'){
                     divStyle ={backgroundColor: "#f0fff0"}
                 }else if(record.stageId_1_status == '0'){
                     divStyle ={backgroundColor: "#579FE9"}
                 }else{
                     divStyle ={backgroundColor: "#e9e9e9"}
                 }
                 let errorLog =record?record.stageId_1_errorMsg:'';
                 return <div style={divStyle}>
                         <Tooltip placement="top" title={errorLog}>
                             <span style={style}>{text}</span>
                         </Tooltip>
                 </div>
             }
         },
         {
             title: '编译',
             dataIndex: 'stageId_100',
             width: '10%',
             render(text,record){
                 let divStyle={};
                 if (record.stageId_100_status == '2') {
                     divStyle ={backgroundColor: "#ffb6c1",color:'red'}
                 }else if(record.stageId_100_status == '1'){
                     divStyle ={backgroundColor: "#f0fff0"}
                 }else if(record.stageId_100_status == '0'){
                     divStyle ={backgroundColor: "#579FE9"}
                 }else{
                     divStyle ={backgroundColor: "#e9e9e9"}
                 }
                 let errorLog =record?record.stageId_1_errorMsg:'';
                 return <div style={divStyle}>
                     <Tooltip placement="top" title={errorLog}>
                         <span>{text}</span>
                     </Tooltip>
                 </div>
             }
         }, {
             title: '生成单元测试案例',
             dataIndex: 'generating_test_case',
             width: '10%',
            render(text,record){
                return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            }
         }, {
             title: '代码质量扫描',
             dataIndex: 'code_quality_scan',
             width: '10%',
            render(text,record){
                return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            }
         }, {
             title: '单元测试',
             dataIndex: 'unit_test',
             width: '10%',
            render(text,record){
                return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            }
         }, {
             title: '打包',
             dataIndex: 'package',
             width: '10%',
            render(text,record){
                return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            }
         }, {
             title: '生成镜像',
             dataIndex: 'generated_mirror',
             width: '10%',
            render(text,record){
                return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            }
         }, {
             title: '发布',
             dataIndex: 'stageId_200',
             width: '10%',
            render(text,record){
                return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            }
         }, {
             title: '执行自动化测试',
             dataIndex: 'auto_test',
             width: '10%',
            render(text,record){
                return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            }
         }];

function mapStateToProps(state) {
    return {
        workflowStage:state.stageView.workflowStage,
        loading:state.stageView.loading,
        error:state.stageView.error,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(jenkins,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(StageView);
    
    

