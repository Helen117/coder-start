/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, {PropTypes} from 'react';
import { Tree, Input, Icon } from 'antd';

import { loopAllChildren, flatToHierarchy, getPropValue, labelCompatible } from './util';
import './index.less';

const TreeNode = Tree.TreeNode;

export default class TreeFilter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            filterValue: '',
            _expandedKeys: [],
            _selectedKeys: [],
            fireOnExpand: false
        }
    }

    componentDidMount() {
    }

    onSelectNode(selectedKeys, e){
        const selectedNode = e.selectedNodes[0];
        if (selectedNode){
            this.setState({
                _selectedKeys: selectedKeys
            });
            const {onSelect} = this.props;
            if (onSelect){
                const node = {id: selectedNode.key, name: selectedNode.props.title};
                if (selectedNode.props.title.props && selectedNode.props.title.props.children && selectedNode.props.title.props.children.length == 2){
                    node.name = selectedNode.props.title.props.children[1].props.children;
                }
                if (selectedNode.props.children){
                    node.isLeaf = false;
                }else{
                    node.isLeaf = true;
                }
                onSelect(node);
            }
        }
    }
    onInputChange(event) {
        const val = event.target.value;
        this.setState({
            filterValue: val
        });
    }

    filterTreeNode(input, child) {
        if (!input) {
            return true;
        }
        return String(getPropValue(child, labelCompatible('title'))).indexOf(input) > -1;
    }

    highlightTreeNode(treeNode) {
        const value = treeNode.props[labelCompatible('title')];
        const {filterValue} = this.state;
        if (filterValue){
            if (value.props && value.props.children && value.props.children.length == 2){
                return value.props.children[1].props.children.indexOf(filterValue) > -1;
            }else{
                return value.indexOf(filterValue) > -1;
            }
        }else{
            return false;
        }
        //return filterValue && value.indexOf(filterValue) > -1;
    }

    onExpand(expandedKeys) {
        this.setState({
            _expandedKeys: expandedKeys,
            fireOnExpand: true,
        });
    }

    getTreeNodes(data, filterValue) {
        return data.map((item) => {
            if (item.children && item.children.length>0) {
                return (
                    //<TreeNode key={item.id} title={item.name}>
                    <TreeNode key={item.id} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                        {this.getTreeNodes(item.children, filterValue)}
                    </TreeNode>
                );
            }
            //return <TreeNode key={item.id} title={item.name} />;
            return <TreeNode key={item.id} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>} />;
        });
    }

    processTreeNode(treeNodes, filterValue) {
        const filterPoss = [];
        this._expandedKeys = [];
        loopAllChildren(treeNodes, (child, index, pos) => {
            if (this.filterTreeNode(filterValue, child)) {
                filterPoss.push(pos);
                this._expandedKeys.push(child.key);
            }
        });

        const processedPoss = [];
        filterPoss.forEach(pos => {
            const arr = pos.split('-');
            arr.reduce((pre, cur) => {
                const res = `${pre}-${cur}`;
                if (processedPoss.indexOf(res) < 0) {
                    processedPoss.push(res);
                }
                return res;
            });
        });
        const filterNodesPositions = [];
        loopAllChildren(treeNodes, (child, index, pos) => {
            if (processedPoss.indexOf(pos) > -1) {
                filterNodesPositions.push({ node: child, pos });
            }
        });

        const hierarchyNodes = flatToHierarchy(filterNodesPositions);

        const recursive = children => {
            return children.map(child => {
                if (child.children) {
                    return React.cloneElement(child.node, {}, recursive(child.children));
                }
                return child.node;
            });
        };
        return recursive(hierarchyNodes);
    }


    render(){
        const {filterValue} = this.state;
        const {nodesData, loading, loadingMsg, inputPlaceholder, notFoundMsg} = this.props;
        let nodes = this.getTreeNodes(nodesData, filterValue);
        if (filterValue) {
            nodes = this.processTreeNode(nodes, filterValue);
        }

        const trProps = {
            selectable: true,
            showLine: true,
            selectedKeys: this.state._selectedKeys.length==0?this.props.defaultSelectedKeys:this.state._selectedKeys,
            defaultSelectedKeys: this.props.defaultSelectedKeys,
            onSelect: this.onSelectNode.bind(this),
            defaultExpandAll: false,
            filterTreeNode: this.highlightTreeNode.bind(this),
        };
        trProps.autoExpandParent = true;
        trProps.onExpand = this.onExpand.bind(this);
        if (this._expandedKeys && this._expandedKeys.length) {
            trProps.expandedKeys = this._expandedKeys;
        }
        if (this.state.fireOnExpand) {
            trProps.expandedKeys = this.state._expandedKeys;
            trProps.autoExpandParent = false;
        }
        return(
            <div style={{border: "1px solid #e5e5e5", padding:10}}>
                <Input placeholder={inputPlaceholder} onChange={this.onInputChange.bind(this)}/>
                {loading?(
                    <span className="filter-not-found">
                        <i className="anticon anticon-loading"><span style={{paddingLeft:5}}>{loadingMsg?loadingMsg:'正在加载数据...'}</span></i>
                    </span>
                ):(
                    nodes.length==0?
                        (<span className="filter-not-found">{notFoundMsg?notFoundMsg:'没有数据'}</span>)
                        :(<Tree {...trProps}>{nodes}</Tree>)
                )}
            </div>
        );
    }


}

TreeFilter.propTypes = {
    inputPlaceholder: PropTypes.string,
    loadingMsg: PropTypes.string,
    notFoundMsg: PropTypes.string,
    loading: PropTypes.bool,
    nodesData: PropTypes.array,
    onSelect: PropTypes.func,
    defaultSelectedKeys: PropTypes.array
};

TreeFilter.defaultProps = {
    nodesData: [],
    defaultSelectedKeys: []
};