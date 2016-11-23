/**
 * Created by zhaojp on 2016/11/3.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { Select,Input, Button, message, Row, notification} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import {getProjectInfo} from '../project-mgr/actions/select-treenode-action';
import {getProjectMembers} from '../project-mgr/actions/project-members-action'
import styles from './index.css';

const Option = Select.Option;

class SelectedProInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {getProjectInfo,selectedItemInfo} = this.props
        if(!getProjectInfo && selectedItemInfo) {
            this.props.getProjectInfoAction(this.props.selectedItemInfo.selectedItemId);
            this.props.getProjectMembersAction(this.props.selectedItemInfo.selectedItemId);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {selectedItemInfo,getProjectInfoErrors} = nextProps
        const thisProId = this.props.selectedItemInfo ? this.props.selectedItemInfo.id : '';
        const nextProId = nextProps.selectedItemInfo ? nextProps.selectedItemInfo.id : '';
        //点击不同项目，重新加载数据
        if (thisProId != nextProId && nextProId) {
            if(nextProId.indexOf("_p")>0) {
                this.props.getProjectInfoAction(nextProId.substring(0,nextProId.length-2));
                this.props.getProjectMembersAction(nextProId.substring(0,nextProId.length-2));
            }
        }
        if(this.props.getProjectInfoErrors != getProjectInfoErrors && getProjectInfoErrors){
            this.errCallback(getProjectInfoErrors,"数据加载失败");
        }

    }

    errCallback(errMessage,type){
        notification.error({
            message: type,
            description: errMessage,
            duration: 2
        });
    }


    getDataSource(projectMembers,getProjectInfo) {
        const data = [];
        if (getProjectInfo && projectMembers) {
            data.push({
                project_name: getProjectInfo.name,
                description: getProjectInfo.description,
                memberNum: "共" + projectMembers.length + "人",
            });
        }
        return data;
    }


    render(){
        const {projectMembers,getProjectInfo,visible} = this.props;
        const dataSource = this.getDataSource(projectMembers,getProjectInfo);
        if(visible) {
            return (
                <div style={{margin: 15}}>
                    <TableView columns={columns(this)}
                               dataSource={dataSource}
                               loading={this.props.getProjectInfoLoading || this.props.projectMembersLoading}
                    ></TableView>
                </div>
            )
        }else{
            return null
        }
    }
}

const columns = (self)=>[
    {title: "项目名称", dataIndex: "project_name", key: "project_name"},
    {title: "项目描述", dataIndex: "description", key: "description"},
    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum",
        render(text,record){
            return <a >{text}</a>
        }
    },
    {title: "下一里程碑时间节点", dataIndex: "next_milestom", key: "next_milestom"},
    {title: "项目状态", dataIndex: "state", key: "state"},
    {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
    {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
];

SelectedProInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        getProjectInfo:state.getProjectInfo.projectInfo,
        getProjectInfoLoading: state.getProjectInfo.loading,
        getProjectInfoErrors: state.getProjectInfo.errors,
        projectMembers:state.getProjectMembers.projectMembers,
        projectMembersLoading:state.getProjectMembers.loading,
        selectedItemInfo: state.projectSetToState.selectedProjectSet,
    }
}

function mapDispatchToProps(dispatch){
    return{
        getProjectInfoAction: bindActionCreators(getProjectInfo, dispatch),
        getProjectMembersAction: bindActionCreators(getProjectMembers, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectedProInfo);

