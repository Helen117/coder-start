/**
 * Created by zhaojp on 2016/11/11.
 */

import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { message, Modal, Spin, Alert, Row, Button} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PopoverImg from '../../components/popover-img/index-1';
import TableView from '../../components/table';
import {deleteProjectSet,fetchProjectSetTree} from './project-set-action';

const confirm = Modal.confirm;
class SelectedSetInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //console.log('调用componentDidMount')
    }

    componentWillReceiveProps(nextProps) {
        const {delResult} = nextProps;
        const thisId = this.props.selectedItemInfo?this.props.selectedItemInfo.id:'';
        const nextId = nextProps.selectedItemInfo?nextProps.selectedItemInfo.id:'';
        if(this.props.delResult != delResult && delResult){
            this.successCallback('删除成功')
        }
    }

    successCallback(type){
        message.success(type);
        const userId = this.props.loginInfo.userId;
        this.props.fetchProjectSetTree(userId);
    }

    editProjectSet(type,selectedProjectSet){
        if(selectedProjectSet){
            this.context.router.push({
                pathname: '/editProjectSet',
                state:{editType: type}
            });
        }else{
            message.warning('请选择要修改的项目集合')
        }

    }

    delProjectSet(type,selectedProjectSet){
        if(selectedProjectSet) {
            const deleteProjectSetAction = this.props.deleteProjectSetAction;
            const userId = this.props.loginInfo.userId;
            const projectSet = this.props.projectSetTree;
            let i = 0;
            for (i = 0; i < projectSet.length; i++) {
                if (projectSet[i].id == selectedProjectSet.id && projectSet[i].children.length > 0) {
                    message.warning('请移除所有项目后再进行删除操作');
                    break;
                }
            }
            if (i >= projectSet.length) {
                confirm({
                    title: '您是否确定要删除此项目集合',
                    content: '删除之后项目集合内容将会被丢弃',
                    onOk() {
                        deleteProjectSetAction(selectedProjectSet.selectedItemId, userId);
                    },
                    onCancel() {
                        //do nothing
                    }
                })
            }
        }else{
            message.warning('请选择要删除的项目集合')
        }
    }



    getDataSource(selectedProjectSet){
        let dataSource = [];
        if(selectedProjectSet){
            for(let j=0; j<selectedProjectSet.children.length; j++){
                dataSource.push({
                    project_name: selectedProjectSet.children[j].name,
                    description: selectedProjectSet.children[j].description,
                    creator: selectedProjectSet.children[j].creator,
                })
            }
        }
        return dataSource;
    }
    
    getSelectedProjectSet(selectedItemInfo){
        const projectSetTree = this.props.projectSetTree;
        if(projectSetTree && selectedItemInfo) {
            for (let i = 0; i < projectSetTree.length; i++) {
                if(projectSetTree[i].id == selectedItemInfo.id){
                    return projectSetTree[i];
                }
            }
        }
    }


    render(){
        const {visible,selectedItemInfo,delLoading} = this.props;
        if(visible){
            const spinning = delLoading?true:false;
            const selectedProjectSet = this.getSelectedProjectSet(selectedItemInfo);
            const dataSource = this.getDataSource(selectedProjectSet);
            const content = (
                <div>
                    <a style={{paddingLeft:10}}
                       onClick={this.editProjectSet.bind(this,'add')}>创建项目集</a>
                    <a style={{paddingLeft:10}}
                       onClick={this.editProjectSet.bind(this,'update',selectedItemInfo)}>修改项目集</a>
                    <a style={{paddingLeft:10}}
                       onClick={this.delProjectSet.bind(this,'del',selectedItemInfo)}>删除项目集</a>
                </div>
            );

            return (
                <Spin spinning={spinning} tip="正在删除数据，请稍候...">
                    <div style={{margin:5}}>
                        {
                            selectedProjectSet?
                                <div>
                                    <Row style={{textAlign:'right'}}>
                                        <PopoverImg content={content}></PopoverImg>
                                    </Row>
                                    <span>项目集合：{selectedProjectSet.name}</span>
                                    <span style={{marginLeft:30}}>描述：{selectedProjectSet.description}</span>
                                    <span style={{marginLeft:30}}>创建人：{selectedProjectSet.creator}</span>

                                    <TableView columns={columns(this)}
                                               dataSource={dataSource}
                                    ></TableView>
                                </div>:
                                <Alert style={{margin:10}}
                                       message={
                                           <Row>
                                               <span>请从左边的项目树中选择一个具体的项目或项目集，或者您也可以</span>
                                               <Button type="primary" size="small" style={{marginLeft:5}} onClick={this.editProjectSet.bind(this,'add')}>创建项目集合</Button>
                                           </Row>
                                       }
                                       description=""
                                       type="warning"
                                       showIcon
                                />
                        }

                    </div>
                </Spin>
            )
        }else{
            return null;
        }
    }
}

const columns = (self)=>[
    {title: "项目名称", dataIndex: "project_name", key: "project_name"},
    {title: "项目描述", dataIndex: "description", key: "description"},
    {title: "创建人", dataIndex: "creator", key: "creator"},
];


SelectedSetInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        selectedItemInfo: state.projectSet.selectedProjectSet,
        projectSetTree: state.projectSet.projectSetTree,
        delResult: state.projectSet.deleteResult,
        delLoading: state.projectSet.deleteLoading,
    }
}

function mapDispatchToProps(dispatch){
    return{
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        deleteProjectSetAction: bindActionCreators(deleteProjectSet, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectedSetInfo);

