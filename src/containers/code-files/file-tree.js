/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';

class FileTree extends React.Component {
    constructor(){
        super();
    }

    clickFileTree(record){
        //更新文件树的面包屑
        //每次点击table，push一次
        //判断点击的record是不是js文件，如果是，调后台接口，并且跳转路由
        //如果不是，调后台接口，更新dataSource，重新渲染
    }

    clickTreePath(pathName){
        //当点击面包屑时，遍历path，找到点击的name，将此name后的元素都删掉。更新面包屑
        //以pathName传参，调接口，跳转到相应页面
    }

    render(){
        const column = [
            {title:"名称", dataIndex:"name", key:"name"},
            {title:"最后更新时间", dataIndex:"lastUpdate", key:"lastUpdate"},
            {title:"最后提交内容", dataIndex:"lastCommit", key:"lastCommit"}
        ];
        const dataSource = [
            {key:1,name:"aa",lastUpdate:"0",lastCommit:"0"},
            {key:2,name:"bb",lastUpdate:"1",lastCommit:"1"},
            {key:3,name:"cc",lastUpdate:"2",lastCommit:"2"},
            {key:4,name:"dd",lastUpdate:"3",lastCommit:"3"}
        ];

        return (
            <div>
                <TableView columns={column} dataSource={dataSource}></TableView>
            </div>
        )
    }
}

FileTree.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        //codeFiles:state.getCodeFile.codeFile
    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FileTree);