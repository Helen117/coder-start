/**
 * Created by Administrator on 2017/3/30.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Tree, Input, Icon, Form,message } from 'antd';
import {getAsyncProjectSet,saveAsyncTreeState} from './actions/task-board-actions';
import fetchData from '../../utils/fetch';
import styles from './index.css';

const TreeNode = Tree.TreeNode;

class AsyncTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSetNode:""
        }
    }

    componentWillMount(){
        this.props.getAsyncProjectSet();
    }

    componentWillReceiveProps(nextProps) {

    }

    setLeaf(treeData, curKey) {
        const loopLeaf = (data) => {
            data.forEach((item) => {
                if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
                    curKey.indexOf(item.key) !== 0) {
                    return;
                }
                if (item.children) {
                    loopLeaf(item.children);
                } else {
                    item.isLeaf = true;
                }
            });
        };
        loopLeaf(treeData);
    }

    getNewTreeData(treeData, curKey, child) {
        const loop = (data) => {
             //if (level < 1 || curKey.length - 3 > level * 2) return;
             data.forEach((item) => {
                 if (curKey == item.id) {
                     item.children = child;
                 }else if (item.children){
                     loop(item.children);
                 }
             });
         };
         loop(treeData);
         //this.setLeaf(treeData, curKey, level);
    }

    onSelect(info,e){
        //console.log('selected', info);
        const {onSelect} = this.props;
        if(onSelect){
            onSelect(info[0]);
        }
        if(info[0].indexOf('_m')>=0){
            let milestoneId = info[0].toString().substring(0,info[0].length-2);
            this.props.saveAsyncTreeState(info[0],milestoneId);
        }else {
            this.props.saveAsyncTreeState(null,null);
        }
    }

    hasChildren(parentId){
        const treeData = this.getTreeData();
        let has = false;
        for(let i=0; i<treeData.length; i++){
            if(parentId == treeData[i].id && treeData[i].children){
                has = true;
            }
        }
        return has;
    }

    onLoadData(treeNode){
        return new Promise((resolve, reject)=> {
            let has = this.hasChildren(treeNode.props.eventKey);
            if(has){
                resolve();
            }else {
                fetchData('/taskboard/milestone', {set_id:treeNode.props.eventKey}, null, (result)=> {
                    let treeData = this.getTreeData();
                    this.getNewTreeData(treeData,treeNode.props.eventKey,result);
                    this.setState({
                        loadSetNode:treeNode.props.eventKey
                    })
                    resolve();
                });
            }
        });
    }

    addStory(e){
        e.stopPropagation();
        const {clickAdd} = this.props;
        fetchData('/taskboard/milestone', {}, null, (result)=> {
            if(result == true){
                if(clickAdd){
                    clickAdd(true);
                }
            }else {
                message.warning('您没有权限在此里程碑下创建故事！',10);
            }
        });
    }

    getTreeNodes(data) {
        return data.map((item) => {
            if (item.children && item.children.length>0) {
                return (
                    <TreeNode key={item.id} isLeaf={item.isLeaf}
                              title={<span>{item.name}</span>}>
                        {this.getTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} isLeaf={item.isLeaf}
                             title={<span>{item.name}</span>} />
        });
    }

    getTreeData(){
        const { getProjectSet} = this.props;
        let treeData = getProjectSet?(getProjectSet.result?getProjectSet.result:[]):[];
        return treeData;
    }

    render(){
        const { getProjectSet} = this.props;
        let treeData = this.getTreeData();
        let nodes = this.getTreeNodes(treeData);
        const loading = getProjectSet?getProjectSet.loading:false;

        return(
            <div style={{border: "1px solid #D9D9D9", padding:10}}>
                {loading?(
                    <span className="filter-not-found">
                        <i className="anticon anticon-loading"><span style={{paddingLeft:5}}>正在加载数据...</span></i>
                    </span>
                ):(
                    nodes.length==0?(
                        <span className="filter-not-found">没有找到数据</span>
                    ):(
                        <Tree onSelect={this.onSelect.bind(this)} loadData={this.onLoadData.bind(this)}>
                            {nodes}
                        </Tree>
                    )
                )}
            </div>
        )
    }
}

AsyncTree.propTypes = {

};

AsyncTree.defaultProps = {

};

function mapStateToProps(state) {
    return {
        getProjectSet : state.taskBoardReducer.getProjectSet,
        getProjectMilestone : state.taskBoardReducer.getProjectMilestone,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAsyncProjectSet : bindActionCreators(getAsyncProjectSet, dispatch),
        saveAsyncTreeState : bindActionCreators(saveAsyncTreeState, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsyncTree);