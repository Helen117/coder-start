/**
 * Created by zhaojp on 2016/11/11.
 */

import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import {Button, message, Spin, Modal,notification} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PopoverImg from '../../components/popover-img'
import {deleteProjectSet} from './actions/project-set-create-action';
import fetchProjectSetTree from  './actions/fetch-project_set_tree_action';


const confirm = Modal.confirm;
class selectedSetInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const { delErrorMsg,delResult} = nextProps;
        const thisId = this.props.selectedItemInfo?this.props.selectedItemInfo.id:'';
        const nextId = nextProps.selectedItemInfo?nextProps.selectedItemInfo.id:''
        if(thisId != nextId && nextId){
            //点击不同项目，重新加载数据
            if(nextId.indexOf("_g")<0) {
                this.context.router.push({
                    pathname: "/projectSetTree/projectInfo",
                });
            }
        }

        if(this.props.delErrorMsg != delErrorMsg && delErrorMsg){
            this.errCallback(delErrorMsg,'删除失败')
        }else if(this.props.delResult != delResult && delResult){
            this.successCallback('删除成功')

        }
    }

    editProjectSet(type){
        this.context.router.push({
            pathname: '/editProjectSet',
            state:{editType: type}
        });
    }

    delProjectSet(type,selectedProjectSet){
        
        if(selectedProjectSet) {
            const deleteProjectSetAction = this.props.deleteProjectSetAction;
            const userId = this.props.loginInfo.userId;
            const projectSet = this.props.projectSetTree;
            let i = 0;
            for (i = 0; i < projectSet.length; i++) {
                if (projectSet[i].id == selectedProjectSet.id && projectSet[i].children.length > 0) {
                    message.warning('请移除所有项目后再进行删除操作')
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
                    }
                })
            }
        }else{
            message.warning('请选择要删除的项目集合')
        }
    }

    successCallback(type){
        message.success(type);
        const userId = this.props.loginInfo.userId;
        this.props.fetchProjectSetTree(userId);
    }


    render(){
        const selectedProjectSet = this.props.selectedItemInfo;
        const spinning = this.props.delLoading?true:false;
        const content = (
            <div>
                <a style={{paddingLeft:10}}
                   onClick={this.editProjectSet.bind(this,'add')}>创建项目集</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editProjectSet.bind(this,'update')}>修改项目集</a>
                <a style={{paddingLeft:10}}
                   onClick={this.delProjectSet.bind(this,'del',selectedProjectSet)}>删除项目集</a>
            </div>
        );
        return (
            <PopoverImg content={content}></PopoverImg>
           /* <Spin spinning={spinning} tip="正在删除数据">

               {/!* <PopoverImg content={content}></PopoverImg>*!/}
            </Spin>*/
        )
    }
}


selectedSetInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        projectSetTree: state.fetchProjectSetTree.projectSetTree,
        loginInfo: state.login.profile,
        selectedItemInfo: state.projectSetToState.selectedProjectSet,
        delErrorMsg: state.deleteProjectSet.errorMsg,
        delResult: state.deleteProjectSet.result,
        delLoading: state.deleteProjectSet.loading,

    }
}

function mapDispatchToProps(dispatch){
    return{
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        deleteProjectSetAction: bindActionCreators(deleteProjectSet, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(selectedSetInfo);

