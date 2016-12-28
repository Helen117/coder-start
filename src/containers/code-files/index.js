/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Breadcrumb, Row, Select, Col, Alert} from 'antd';
import {getCodeFile, getCodeContent} from './actions/code-files-actions';
import styles from "./index.css";
import 'pubsub-js';
import FileTree from './file-tree';
import CodeView from './code-view';
import {fetchBranchesData} from '../branches/branches-action';

const Option = Select.Option;

class CodeFiles extends React.Component {
    constructor(){
        super();
        this.state = {
            pathData:[],
            activeKey:0,
            brand:"dev",
            showFileTree:true,
            showCodeView:false,
            filePath:'',
            pathName:'',
        }
    }

    componentWillMount(){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(!this.isEmptyObject(projectInfo)){
            const pathData = [{path:projectInfo.name,pathKey:1,pathType:"tree" }];
            this.setState({
                pathData:pathData,
                activeKey:pathData[0].pathKey,
            })
        }
    }

    componentDidMount(){
        //初始化文件树第一级面包屑为项目名称
        //定义一个path数组？初始化为项目名称
        //默认跳转fileTree路由，以项目名称为参数调后台接口，dataSource初始化为返回的第一级数据.
        PubSub.subscribe("evtRefreshFileTree",this.refreshTreePath.bind(this));
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(!this.isEmptyObject(projectInfo)){
            this.props.fetchBranchesData(projectInfo.id);
            this.props.getCodeFile(projectInfo.id,"",this.state.brand);
        }
    }

    componentWillReceiveProps(nextProps){
        //初始化面包屑
        const {project} = nextProps;
        if(this.props.project.getProjectInfo && project.getProjectInfo){
            if(this.props.project.getProjectInfo.projectInfo != project.getProjectInfo.projectInfo
                && project.getProjectInfo.projectInfo){
                let projectInfo = project.getProjectInfo.projectInfo;
                if(projectInfo){
                    this.state.brand = 'dev';
                    this.props.fetchBranchesData(projectInfo.id);
                    this.props.getCodeFile(projectInfo.id,"",this.state.brand);
                    const pathData = [{path:projectInfo.name,pathKey:1,pathType:"tree" }];
                    this.setState({
                        pathData:pathData,
                        activeKey:pathData[0].pathKey,
                        showFileTree:true,
                        showCodeView:false,
                        filePath:''
                    })
                }
            }
        }
    }

    componentWillUnmount(){
        //在此处注销对其他控件发送消息的响应
        PubSub.unsubscribe("evtRefreshFileTree");
    }

    refreshTreePath(msg,data){
        let path_temp = this.state.pathData;
        path_temp.push({
            path:data.path,
            pathKey:this.state.activeKey + 1,
            pathType:data.type
        });
        this.setState({
            pathData:path_temp,
            activeKey:this.state.activeKey + 1,
            pathName:data.path,
            brand:data.brand,
            filePath:data.filePath
        })
        if(data.type=='blob'){
            this.setState({
                showFileTree:false,
                showCodeView:true,
            })
        }
    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    clickTreePath(pathName){
        //当点击面包屑时，遍历path，找到点击的name，将此name后的元素都删掉。更新面包屑
        //以pathName传参，跳转到相应页面
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        let path_temp = this.state.pathData,type;
        let clickPathIndex;
        for(let i=0; i<path_temp.length; i++){
            if(pathName == path_temp[i].path){
                clickPathIndex = i;
                type = path_temp[i].pathType;
            }
        }
        path_temp.splice(clickPathIndex+1,path_temp.length);
        let filePath;
        for(let i=0; i<path_temp.length; i++){
            if(i == 0){
                filePath="";
            }else if(i == 1){
                filePath = path_temp[i].path;
            }else {
                filePath += "/"+path_temp[i].path;
            }
        }
        PubSub.publish("evtClickTreePath",filePath);
        if(type == "tree"){
            this.setState({
                pathData:path_temp,
                activeKey:path_temp.length,
                filePath:filePath,
                pathName:pathName,
                showFileTree:true,
                showCodeView:false
            })
            this.props.getCodeFile(projectInfo.id,filePath,this.state.brand);
        }else {
            this.setState({
                pathData:path_temp,
                activeKey:path_temp.length,
                filePath:filePath,
                pathName:pathName,
                showFileTree:false,
                showCodeView:true
            })
            this.props.getCodeContent(projectInfo.id,filePath,this.state.brand);
        }
    }

    changeSelect(value){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const pathData = [{path:projectInfo.name,pathKey:1,pathType:"tree" }];
        this.props.getCodeFile(projectInfo.id,"",value);
        this.setState({
            pathData:pathData,
            activeKey:pathData[0].pathKey,
            brand:value,
            showFileTree:true,
            showCodeView:false,
            filePath:''
        });
        PubSub.publish("evtClickBrand",{filePath:""});
    }

    render(){
        const {branches,selectNode} = this.props;
        const bread = this.state.pathData.map((item)=> {
            return (
                <Breadcrumb.Item key={'bc-' + item.pathKey}><a onClick={this.clickTreePath.bind(this,item.path)}>{item.path}</a></Breadcrumb.Item>
            )
        });
        const branchData = branches?branches.branch.map((item)=>{
            return (
                <Option key={item}>{item}</Option>
            )
        }):(<Option key="dev">dev</Option>);

        return (<div style={{paddingLeft:'10px'}}>
                {(selectNode && selectNode.isProject)?(
                    <div>
                        <Row>
                            <div style={{display: 'inline',float:'left'}}>
                                <Select id="branch" value={this.state.brand} className={styles.select}
                                        onChange={this.changeSelect.bind(this)}>
                                    {branchData}
                                </Select>
                            </div>
                            <div style={{display: 'inline',float:'left',padding:'3px 0px 0px 10px'}}>
                                <Breadcrumb >
                                    {bread}
                                </Breadcrumb>
                            </div>
                        </Row>
                        <Row>
                            <FileTree visible={this.state.showFileTree}
                                      filePath={this.state.filePath}
                                      brand={this.state.brand}
                                      loading={this.props.loadingFileTree}/>
                            <CodeView visible={this.state.showCodeView}
                                      pathName={this.state.pathName}
                                      filePath={this.state.filePath}
                                      loading={this.props.loadingContent}/>
                            {this.props.children}
                        </Row>
                    </div>
                ):(<Alert
                    message="请从左边的项目树中选择一个具体的项目！"
                    description=""
                    type="warning"
                    showIcon
                />)}
        </div>
        )
    }
}

CodeFiles.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        branches:state.branch.branchesData,
        project:state.project,
        selectNode: state.getGroupTree.selectNode,
        loadingFileTree:state.getCodeFile.loadingFile,
        loadingContent:state.getCodeFile.loadingContent,
    }
}

function mapDispatchToProps(dispatch){
    return{
        getCodeFile: bindActionCreators(getCodeFile, dispatch),
        getCodeContent: bindActionCreators(getCodeContent, dispatch),
        fetchBranchesData:bindActionCreators(fetchBranchesData, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeFiles);