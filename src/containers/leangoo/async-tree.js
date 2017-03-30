/**
 * Created by Administrator on 2017/3/30.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Tree, Input, Icon, Form } from 'antd';
import {getAsyncProjectSet, getAsyncProjectMilestone,saveAsyncTreeData} from './actions/leangoo-actions';
import fetchData from '../../utils/fetch';

const TreeNode = Tree.TreeNode;

class AsyncTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData:[],
            treeNodeLoadKey:""
        }
    }

    componentWillMount(){
        this.props.getAsyncProjectSet();
    }

    componentWillReceiveProps(nextProps) {
        const {getProjectMilestone, getProjectSet} = this.props;

        if(nextProps.getProjectSet && nextProps.getProjectSet.result
            && nextProps.getProjectSet.result != getProjectSet.result){
            const tree_projectset = nextProps.getProjectSet.result?nextProps.getProjectSet.result:[];
            this.setState({
                treeData:tree_projectset
            })
        }

        /*if(nextProps.getProjectMilestone && nextProps.getProjectMilestone.result
            && nextProps.getProjectMilestone.result != getProjectMilestone.result){
            let treeData = [...this.state.treeData];
            let milestoneData = nextProps.getProjectMilestone.result?nextProps.getProjectMilestone.result:[];
            this.getNewTreeData(treeData, this.state.treeNodeLoadKey, milestoneData, 2);
        }*/
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
    }

    onLoadData(treeNode){
        this.setState({
            treeNodeLoadKey:treeNode.props.eventKey
        })
        return new Promise((resolve, reject)=> {
            fetchData('/devops/story/milestone', treeNode.props.eventKey, null, (result)=> {
                let treeData = [...this.state.treeData];
                this.getNewTreeData(treeData,treeNode.props.eventKey,result);
                this.setState({treeData:treeData});
                resolve();
            });
        });
    }

    getTreeNodes(data) {
        return data.map((item) => {
            if (item.children && item.children.length>0) {
                return (
                    <TreeNode key={item.id} isLeaf={item.isLeaf}
                              title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                        {this.getTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} isLeaf={item.isLeaf}
                             title={<span><Icon type={item.icon} /><span>{item.name}</span></span>} />;
        });
    }

    render(){

        let nodes = this.getTreeNodes(this.state.treeData);

        return(
            <div style={{border: "1px solid #D9D9D9", padding:10}}>
                <Tree onSelect={this.onSelect.bind(this)} loadData={this.onLoadData.bind(this)}>
                    {nodes}
                </Tree>
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
        getAsyncProjectMilestone : bindActionCreators(getAsyncProjectMilestone, dispatch),
        saveAsyncTreeData : bindActionCreators(saveAsyncTreeData, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsyncTree);