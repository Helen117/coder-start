/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import {Icon,Table} from 'antd';
import 'pubsub-js';
import {getCodeFile, getCodeContent} from './actions/code-files-actions';

class FileTree extends React.Component {
    constructor(){
        super();
        this.state = {
            dataSource:[],
            filePath:""
        }
    }

    componentWillMount(){
        const {filePath} = this.props;
        this.setState({
            filePath:filePath
        })
        PubSub.subscribe("evtClickTreePath",this.refreshFilePath.bind(this));
        PubSub.subscribe("evtClickBrand",this.refreshFilePath.bind(this));
    }

    componentWillUnmount(){
        //在此处注销对其他控件发送消息的响应
        PubSub.unsubscribe("evtClickTreePath");
        PubSub.unsubscribe("evtClickBrand");
    }

    refreshFilePath(msg,data){
        if(msg == "evtClickTreePath"){
            this.setState({
                filePath:data
            })
        }else if(msg == "evtClickBrand"){
            this.setState({
                filePath:data.filePath
            })
        }
    }

    componentWillReceiveProps(nextProps){
        const { codeFile, filePath} = nextProps;
        this.setState({
            filePath:filePath
        })
        if(codeFile && codeFile != this.props.codeFile){
            this.state.dataSource.splice(0,this.state.dataSource.length);
            for(var i=0; i<codeFile.length; i++){
                this.state.dataSource.push(codeFile[i]);
            }
        }
    }

    clickFileTree(record){
        //更新文件树的面包屑
        //每次点击table，push一次
        //判断点击的record是不是js文件，如果是，跳转路由,展示js内容
        //如果不是，调接口，取下一级数据，重新渲染
        const {project,brand} = this.props;
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        let type,filePath = this.state.filePath;
        for(let i=0; i<this.state.dataSource.length; i++){
            if(this.state.dataSource[i].name == record.name){
                type = this.state.dataSource[i].type;
                if(filePath.length == 0){
                    filePath  = record.name;
                }else{
                    filePath  += "/"+record.name;
                }
            }
        }
        this.setState({
            filePath:filePath
        })
        if(type == "blob"){
            this.props.getCodeContent(projectInfo.id,filePath,brand);
        }else{
            this.props.getCodeFile(projectInfo.id,filePath,brand);
        }
        PubSub.publish("evtRefreshFileTree",{path:record.name,type:type,brand:brand,filePath:filePath});
    }

    findType(dataSource,record){
        let type;
        for(let i=0; i<dataSource.length; i++){
            if(dataSource[i].name == record.name){
                type = dataSource[i].type;
                return type;
            }
        }
    }

    render(){
        const { codeFile,visible } = this.props;
        const pagination = {
            pageSize:20
        };
        const dataSource = [];
        if(codeFile){
            for(var i=0; i<this.state.dataSource.length; i++){
                dataSource.push({
                    key:i+1,
                    name:this.state.dataSource[i].name
                })
            }
        }
        if(visible){
            return (
                <div>
                    <Table columns={this.getColumns(this,this.state.dataSource)}
                           dataSource={dataSource}
                           loading={this.props.loading}
                           pagination={pagination}
                           onRowClick={this.clickFileTree.bind(this)}></Table>
                </div>
            )
        }else {return <div/>}
    }
}

FileTree.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

FileTree.prototype.getColumns = (self,dataSource)=>[
    {title:"名称", dataIndex:"name", key:"name",
        render(text,record){
            const type = self.findType(dataSource,record);
            return (type == "blob"?<div><Icon type="file-text" style={{fontSize:18,paddingRight:'7px'}}/>{text}</div>
                :<div><Icon type="folder" style={{fontSize:18,paddingRight:'7px'}}/>{text}</div>)
        }},
    {title:"最后更新时间", dataIndex:"lastUpdate", key:"lastUpdate"},
    {title:"最后提交内容", dataIndex:"lastCommit", key:"lastCommit"}
];

function mapStateToProps(state) {
    return {
        codeFile:state.getCodeFile.codeFile,
        project:state.project,
    }
}

function mapDispatchToProps(dispatch){
    return{
        getCodeFile: bindActionCreators(getCodeFile, dispatch),
        getCodeContent: bindActionCreators(getCodeContent, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FileTree);