/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import 'pubsub-js';
import {getCodeFile} from './actions/code-files-actions';

class FileTree extends React.Component {
    constructor(){
        super();
        this.state = {
            dataSource:[],
        }
    }

    componentWillReceiveProps(nextProps){
        const { codeFile, fetchCodeStatus} = nextProps;
        if(codeFile != this.props.codeFile){
            if(fetchCodeStatus == true){
                this.state.dataSource.splice(0,this.state.dataSource.length);
                for(var i=0; i<codeFile.filetree.result.length; i++){
                    this.state.dataSource.push(codeFile.filetree.result[i]);
                }
            }
        }
    }

    clickFileTree(record){
        //const { codeFile} = this.props;
        //更新文件树的面包屑
        //每次点击table，push一次
        //判断点击的record是不是js文件，如果是，跳转路由,展示js内容
        //如果不是，调接口，取下一级数据，重新渲染
        let type;
        for(let i=0; i<this.state.dataSource.length; i++){
            if(this.state.dataSource[i].name == record.name){
                type = this.state.dataSource[i].type;
            }
        }
        PubSub.publish("evtRefreshFileTree",{path:record.name,type:type});
        this.props.getCodeFile(record.name);
        if(type == "bold"){
            this.context.router.push({
                pathname: '/project-mgr/code-file/code-view',
                //state:record.name
            });
        }

        //实际操作！！！！！调接口拿新数据
        /*
        let type;
        for(let i=0; i<codeFile.filetree.result.length; i++){
            if(record.name == codeFile.filetree.result[i].name){
                type = codeFile.filetree.result[i].type;
            }
        }
        this.props.getCodeFile(record.name,type);
        */
    }

    render(){
        const { fetchCodeStatus, codeFile} = this.props;
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
        getCodeFile: bindActionCreators(getCodeFile, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FileTree);