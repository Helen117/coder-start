import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, Affix,Alert,message,Spin,Modal } from 'antd';
import RelationMap from './RelationMap';
import Box from '../../components/box';
import TreeFilter from '../../components/tree-filter';
import {fetchProjectSetTree} from '../project-set/project-set-action';
import './index.less';
import AddBacklogNode from './add-node';
import {getBacklogNode,deleteBacklogNode} from './actions/backlog-actions';

const confirm = Modal.confirm;

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

    componentWillReceiveProps(nextProps) {
        const {deleteResult,loginInfo} = this.props;

        if(nextProps.deleteResult && deleteResult && nextProps.deleteResult.result
            && nextProps.deleteResult.result !=deleteResult.result){
            message.info('删除节点成功！',3);
            const node_id = this.state.currentProjectSet.id;
            const set_id = node_id.substr(0,node_id.length-2);
            this.props.getBacklogNode(set_id,loginInfo.userId);
        }
    }

    generateProjectSet(projectSet_id,projectSet){
        for(let i=0; i<projectSet.length; i++){
            if(projectSet_id == projectSet[i].id){
                return projectSet[i];
            }else if(projectSet[i].children.length>0){
                this.generateProjectSet(projectSet_id,projectSet[i].children);
            }
        }
    }

    onSelectNode(node){
        const {loginInfo,projectSet} = this.props;
        const isProject = node.id.indexOf("_p");
        if(isProject < 0){
            const set_id = node.id.substr(0,node.id.length-2);
            const projectSetInfo = this.generateProjectSet(node.id,projectSet);
            let projectSet_temp = node;
            projectSet_temp.description = projectSetInfo.description;
            this.setState({
                currentProjectSet:projectSet_temp
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
        console.log('node:',node)
        const {loginInfo} = this.props;
        if (node){
            let data = {
                id:node.id,
                operator_id:loginInfo.userId
            };
            confirm({
                title: '请确认是否删除',
                content: node.children?"改节点下还存在子节点，确认要删除吗？":"确认删除该叶子节点吗？",
                onOk() {
                    this.props.deleteBacklogNode(data);
                },
                onCancel() {
                    //do nothing
                }
            })
        }else{
            message.warning('请选择一个要删除的节点!',3);
        }
    }
    refreshNodes(){
        const {loginInfo} = this.props;
        const node_id = this.state.currentProjectSet.id;
        const set_id = node_id.substr(0,node_id.length-2);
        this.props.getBacklogNode(set_id,loginInfo.userId);
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
            data_temp.description = item.description?item.description:"无";
            data_temp.type = item.type;
            data_temp.id = item.id;
            data_temp.milestone_id = item.milestone_id;
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
            dataSource_temp.description = this.state.currentProjectSet.description?this.state.currentProjectSet.description:"无";
            dataSource_temp.type = 'projectSet';
            dataSource_temp.id = this.state.currentProjectSet.id;
            dataSource_temp.milestone_id = null;
            const data = this.generateNodes(nodes);
            if(data.length>0){
                dataSource_temp.children = data;
            }
            dataSource.push(dataSource_temp);
        }
        return dataSource;
    }

    render(){
        const {projectSet,backlogNodes,deleteResult} = this.props;

        const data = this.getDataSource();
        const getLoading = backlogNodes?backlogNodes.loading:false;
        const deleteLoading = deleteResult?deleteResult.loading:false;
        const deleteDisabled = deleteResult?deleteResult.disabled:false;

        const action = <div>
            <Button type="primary" size="default" loading={deleteLoading} disabled={deleteDisabled}
                    onClick={this.deleteNode.bind(this)}>删除节点</Button>
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
                            (this.state.currentProjectSet )?(
                                <Box title="backlog关系图" action={action}>
                                    <Spin spinning={getLoading} tip="正在加载数据...">
                                        {
                                            data.length>0?
                                                <RelationMap ref="relationMap" data={data}/>
                                                :<div></div>
                                        }
                                    </Spin>
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
        backlogNodes:state.backlogReducer.getBacklogNode,
        deleteResult:state.backlogReducer.deleteBacklogNode,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        getBacklogNode: bindActionCreators(getBacklogNode, dispatch),
        deleteBacklogNode: bindActionCreators(deleteBacklogNode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Backlog);