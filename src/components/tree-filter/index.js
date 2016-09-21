/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, {PropTypes} from 'react';
import { Tree, Input } from 'antd';
import { loopAllChildren, flatToHierarchy, getPropValue, labelCompatible } from './util';
import './index.less';

const TreeNode = Tree.TreeNode;

export default class TreeFilter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            filterValue: ''
        }
    }

    componentDidMount() {
    }

    onSelectNode(selectedKeys, e){
        const selectedNode = e.selectedNodes[0];
        if (selectedNode){
            const {onSelect} = this.props;
            if (onSelect){
                const node = {id: selectedNode.key, name: selectedNode.props.title};
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
        return filterValue && value.indexOf(filterValue) > -1;
    }

    getTreeNodes(data, filterValue) {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.id} title={item.name}>
                        {this.getTreeNodes(item.children, filterValue)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={item.name} />;
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
        const {nodesData} = this.props;
        let nodes = this.getTreeNodes(nodesData, filterValue);
        if (filterValue) {
            nodes = this.processTreeNode(nodes, filterValue);
        }

        const trProps = {
            onSelect: this.onSelectNode.bind(this),
            defaultExpandAll: true,
            filterTreeNode: this.highlightTreeNode.bind(this),
        };
        if (this._expandedKeys && this._expandedKeys.length) {
            trProps.expandedKeys = this._expandedKeys;
        }
        return(
            <div style={{border: "1px solid #e5e5e5", padding:10}}>
                <Input placeholder="快速查询项目" onChange={this.onInputChange.bind(this)}/>
                {nodes.length==0?
                    (<span className="filter-not-found">找不到项目</span>)
                    :(<Tree {...trProps}>{nodes}</Tree>)}
            </div>
        );
    }


}

TreeFilter.propTypes = {
    nodesData: PropTypes.array,
    onSelect: PropTypes.func
};

TreeFilter.defaultProps = {
    nodesData: []
};