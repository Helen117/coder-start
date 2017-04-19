import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, Affix,Alert } from 'antd';
import RelationMap from './RelationMap';
import Box from '../../components/box';
import TreeFilter from '../../components/tree-filter';
import {fetchProjectSetTree} from '../project-set/project-set-action';
import './index.less';
import AddBacklogNode from './add-node';
import {getBacklogNode} from './actions/backlog-actions';

class Backlog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showAddNode:false,
            addOrModify:'',
            currentProjectSet:''
        };
    }

    componentDidMount() {
        const {loginInfo} = this.props;
        this.props.fetchProjectSetTree(loginInfo.userId);
    }

    onSelectNode(node){
        const {loginInfo} = this.props;
        const isProject = node.id.indexOf("_p");
        if(isProject < 0){
            const set_id = node.id.substr(0,node.id.length-2);
            this.setState({
                currentProjectSet:node
            })
            this.props.getBacklogNode(set_id,loginInfo.userId);
        }else{
            this.setState({
                currentProjectSet:''
            })
        }
    }

    addChildNode(type){
        const node = this.refs.relationMap.getSelectNode();
        if(node){
            this.setState({
                showAddNode:true,
                addOrModify:type
            })
        }
    }
    deleteNode(){
        const node = this.refs.relationMap.getSelectNode();
        if (node){
            alert(node.name);
        }else{
            alert('请选择节点');
        }
    }
    refreshNodes(){
        alert('refreshNodes');
    }

    modifyNode(type){
        this.setState({
            showAddNode:true,
            addOrModify:type
        })
    }

    setAddNodeVisible(flag){
        this.setState({
            showAddNode:flag
        })
    }

    generateNodes(nodes){
        const data = nodes.map((item)=>{
            let data_temp = {};
            data_temp.name = item.title;
            data_temp.description = item.description;
            data_temp.type = item.type;
            data_temp.id = item.id;
            if(item.children_nodes.length != 0){
                data_temp.children = this.generateNodes(item.children_nodes)
            }
            return data_temp;
        });
        return data;
    }

    getDataSource(){
        const {backlogNodes} = this.props;
        const dataSource = [];
        const nodes = backlogNodes?(backlogNodes.result?backlogNodes.result.mindmap_nodes:null):null;
        if(this.state.currentProjectSet && nodes){
            let dataSource_temp = {};
            dataSource_temp.name=this.state.currentProjectSet.name;
            dataSource_temp.description = '这是一个项目集';
            dataSource_temp.type = 'projectSet';
            dataSource_temp.id = this.state.currentProjectSet.id;
            const data = this.generateNodes(nodes);
            dataSource_temp.children = data;
            dataSource.push(dataSource_temp);
        }
        return dataSource;
    }

    render(){
        const {projectSet} = this.props;

        const data = this.getDataSource();
        console.log('data-----:',data)
        console.log(this.state.currentProjectSet && data.length>0)
        //const data = [{name:"flare111",children:[{name:"analytics",children:[{name:"cluster",children:[{name:"AgglomerativeCluster"},{name:"CommunityStructure"},{name:"HierarchicalCluster"},{name:"MergeEdge"}]},{name:"graph",children:[{name:"BetweennessCentrality"},{name:"LinkDistance"},{name:"MaxFlowMinCut"},{name:"ShortestPaths"},{name:"SpanningTree"}]},{name:"optimization",children:[{name:"AspectRatioBanker"}]}]},{name:"animate",children:[{name:"Easing"},{name:"FunctionSequence"},{name:"interpolate",children:[{name:"ArrayInterpolator"},{name:"ColorInterpolator"},{name:"DateInterpolator"},{name:"Interpolator"},{name:"MatrixInterpolator"},{name:"NumberInterpolator"},{name:"ObjectInterpolator"},{name:"PointInterpolator"},{name:"RectangleInterpolator"}]},{name:"ISchedulable"},{name:"Parallel"},{name:"Pause"},{name:"Scheduler"},{name:"Sequence"},{name:"Transition"},{name:"Transitioner"},{name:"TransitionEvent"},{name:"Tween"}]}]}];
        const action = <div>
            <Button type="primary" size="default" onClick={this.deleteNode.bind(this)}>删除节点</Button>
            <Button type="primary" size="default" onClick={this.addChildNode.bind(this,"add")}>添加子节点</Button>
            <Button type="primary" size="default" onClick={this.modifyNode.bind(this,"modify")}>修改节点</Button>
            <Button type="primary" size="default" onClick={this.refreshNodes.bind(this)}>刷新</Button>
        </div>;

        return (
            <div id="backlog">
                <Row style={{padding:"10px"}}>
                    <Col span={4}>
                        <TreeFilter
                            inputPlaceholder="快速查询项目集"
                            loadingMsg="正在加载项目集合信息..."
                            nodesData={projectSet}
                            busiType="backlog"
                            onSelect={this.onSelectNode.bind(this)}
                            />
                    </Col>
                    <Col span={20}>
                        {
                            (this.state.currentProjectSet && data.length>0)?(
                                <Box title="backlog关系图" action={action}>
                                    <RelationMap ref="relationMap" data={data}/>
                                </Box>
                            ):<div style={{paddingLeft:"10px"}}>
                                <Alert
                                    message="请选择一个项目集！"
                                    description=""
                                    type="warning"
                                    showIcon/>
                            </div>
                        }
                        <AddBacklogNode visible={this.state.showAddNode}
                                        editType={this.state.addOrModify}
                                        setVisible={this.setAddNodeVisible.bind(this)}/>
                    </Col>
                </Row>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        projectSet: state.projectSet.projectSetTree,
        backlogNodes:state.backlogReducer.getBacklogNode
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        getBacklogNode: bindActionCreators(getBacklogNode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Backlog);