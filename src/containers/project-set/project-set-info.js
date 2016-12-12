/**
 * Created by zhaojp on 2016/11/11.
 */

import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { message, Modal} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PopoverImg from '../../components/popover-img'
import {deleteProjectSet,fetchProjectSetTree} from './project-set-action';

const confirm = Modal.confirm;
class SelectedSetInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const {delResult} = nextProps;
        const thisId = this.props.selectedItemInfo?this.props.selectedItemInfo.id:'';
        const nextId = nextProps.selectedItemInfo?nextProps.selectedItemInfo.id:'';
        if(thisId != nextId && nextId){

        }
        if(this.props.delResult != delResult && delResult){
            this.successCallback('删除成功')
        }
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
        const visible = this.props.visible;
        const selectedProjectSet = this.props.selectedItemInfo;
        const spinning = this.props.delLoading?true:false;
        const content = (
            <div >
                <a style={{paddingLeft:10}}
                   onClick={this.editProjectSet.bind(this,'add')}>创建项目集</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editProjectSet.bind(this,'update',selectedProjectSet)}>修改项目集</a>
                <a style={{paddingLeft:10}}
                   onClick={this.delProjectSet.bind(this,'del',selectedProjectSet)}>删除项目集</a>
            </div>
        );
        if(visible){
            return (
                <div style={{margin:5}}>
                    <PopoverImg content={content}></PopoverImg>
                </div>
            )
        }else{
            return null;
        }
    }
}


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

