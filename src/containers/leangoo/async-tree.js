/**
 * Created by Administrator on 2017/3/30.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Tree, Input, Icon, Form } from 'antd';
import {getAsyncProjectSet,saveAsyncTreeData} from './actions/leangoo-actions';
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

    onSelect(info){
        console.log('selected', info);
        const {onSelect} = this.props;
        if(onSelect){
            onSelect(info);
        }
    }

    onLoadData(treeNode){
        return new Promise((resolve, reject)=> {
            fetchData('/story/milestone', {set_id:treeNode.props.eventKey}, null, (result)=> {
                let treeData = this.getTreeData();
                this.getNewTreeData(treeData,treeNode.props.eventKey,result);
                this.setState({
                    loadSetNode:treeNode.props.eventKey
                })
                resolve();
            });
        });
    }

    addStory(e){
        e.stopPropagation();
        console.log("1111")
    }

    getTitleElement(item){
        return (item.set_id?( <span><Icon type="plus-circle-o"
                                          className={styles.title_icon}
                                          onClick={this.addStory.bind(this)}/>
        <span>{item.name}</span></span> )
            :<span>{item.name}</span>)
    }

    getTreeNodes(data) {
        return data.map((item) => {
            if (item.children && item.children.length>0) {
                return (
                    <TreeNode key={item.id} isLeaf={item.isLeaf}
                              title={this.getTitleElement(item)}>
                        {this.getTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} isLeaf={item.isLeaf}
                             title={this.getTitleElement(item)} />
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
        getProjectSet : state.leangooReducer.getProjectSet,
        getProjectMilestone : state.leangooReducer.getProjectMilestone,
        getTreeData:state.leangooReducer.saveTreeData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAsyncProjectSet : bindActionCreators(getAsyncProjectSet, dispatch),
        saveAsyncTreeData : bindActionCreators(saveAsyncTreeData, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsyncTree);