/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import 'pubsub-js';

class FileTree extends React.Component {
    constructor(){
        super();
        this.state = {
            dataSource:[],
            pathInfo:[]
        }
    }

    componentDidMount(){
        this.state.pathInfo.push("devops-web");
    }

    componentWillReceiveProps(nextProps){
        const { codeFile, fetchCodeStatus} = nextProps;
        if(codeFile != this.props.codeFile){
            if(fetchCodeStatus == true){
                for(var i=0; i<codeFile.filetree.result.length; i++){
                    this.state.dataSource.push(codeFile.filetree.result[i]);
                }
            }
        }
    }

    findLastPathInfo(pathName,children){

    }

    clickFileTree(record){
        //更新文件树的面包屑
        //每次点击table，push一次
        //判断点击的record是不是js文件，如果是，跳转路由,展示js内容
        //如果不是，更新dataSource为下一级数据，重新渲染
        this.state.pathInfo.push(record.name);
        PubSub.publish("evtRefreshFileTree",{path:record.name});
        let newData;
        for(let i=0; i<this.state.dataSource.length; i++){
            if(this.state.dataSource[i].name == record.name){
                newData = this.state.dataSource[i].children;
            }
        }
        this.state.dataSource.splice(0,this.state.dataSource.length);
        this.setState({
            dataSource:newData
        })
    }

    clickTreePath(pathName){
        //当点击面包屑时，遍历path，找到点击的name，将此name后的元素都删掉。更新面包屑
        //以pathName传参，调接口，跳转到相应页面
    }

    render(){
        const { fetchCodeStatus} = this.props;
        if(fetchCodeStatus || false){
            const column = [
                {title:"名称", dataIndex:"name", key:"name"},
                {title:"最后更新时间", dataIndex:"lastUpdate", key:"lastUpdate"},
                {title:"最后提交内容", dataIndex:"lastCommit", key:"lastCommit"}
            ];
            const dataSource = [];
            for(var i=0; i<this.state.dataSource.length; i++){
                dataSource.push({
                    key:i+1,
                    name:this.state.dataSource[i].name
                })
            }

            return (
                <div style={{"paddingLeft":"20px"}}>
                    <TableView columns={column} dataSource={dataSource}
                               onRowClick={this.clickFileTree.bind(this)}></TableView>
                </div>
            )
        }else{return null;}
    }
}

FileTree.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        codeFile:state.getCodeFile.codeFile,
        fetchCodeStatus:state.getCodeFile.fetchCodeStatus
    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FileTree);