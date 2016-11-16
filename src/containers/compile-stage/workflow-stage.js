/**
 * Created by helen on 2016/11/10.
 */

import React, {PropTypes,Component} from 'react';
import { Button,notification,Icon,Collapse,Steps,Table,Popover,Modal } from 'antd';
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
         // const {actions} = this.props;
         // actions.workflowStage(projectId);
     }

     componentWillReceiveProps(nextProps) {
         const errorMsg = nextProps.error;
         if(errorMsg&& errorMsg != this.props.errorMsg){
             this.errorMessage('获取信息失败！',error);
         }
     }

     stageDetail(text,record){
         console.log("text:",text);
         console.log("record:",record);
         this.setState({visible:true});
     }

     codeChange(text,record){
         console.log("text:",text);
         console.log("record:",record);
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

     render() {

             const pagination = {
                 pageSize: 20,
             };

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

         const data =[{
             "times":"2016/11/15 12:00:00",
             "code_change":"没变更",
             "checkout from git":'1s',
             "compile":"2min",
             "generating_test_case":"1min",
             "code_quality_scan":"20s",
             "unit_test":"50s",
             "package":"1min30s",
             "generated_mirror":"59s",
             "deploy":"5s",
             "auto_test":"30s",
             "status":"success"
         },{
             "times":"2016/11/15 08:00:00",
             "code_change":"10 commits",
             "checkout from git":'1s',
             "compile":"",
             "generating_test_case":"",
             "code_quality_scan":"",
             "unit_test":"",
             "package":"",
             "generated_mirror":"",
             "deploy":"",
             "auto_test":"",
             "status":"failed"
         }];

         const text = "A dog is a type of domesticated animal.";
             
             return (
                 <Box title="编译发布过程一览">
                     <Table columns={this.columns(this)} dataSource={data}
                            bordered
                            size="middle"
                            loading={this.props.loading}
                            pagination={pagination}
                            rowClassName={this.rowClassName}
                    >
                    </Table>

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
        dataIndex: 'times',
        width: '10%',
    },{
        colSpan: 0,
        dataIndex: 'code_change',
        width: '8%',
        render(text,record){
            if(text.indexOf("没变更")!=-1){
                return <span>{text}</span>
            }else{
                return <a onClick={self.codeChange.bind(self,text,record)}>{text}</a>
            }
        }
    },
         {
             title: '更新代码',
             dataIndex: 'checkout from git',
             width: '10%',
             render(text,record){
                 let style={};
                 if (record.status == 'failed') {
                     style={'color':'red'};
                 }
                 return <a style={style} onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
             }
         },
         {
             title: '编译',
             dataIndex: 'compile',
             width: '10%',
             render(text,record){
                 return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
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
             dataIndex: 'deploy',
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
    
    

