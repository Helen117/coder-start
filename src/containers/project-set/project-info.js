/**
 * Created by zhaojp on 2016/11/3.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { Select,Input, Button, message, Row} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import {getProjectInfo} from '../project-mgr/actions/select-treenode-action';
import {getProjectMembers} from '../project-mgr/actions/project-members-action'
import styles from './index.css';

const Option = Select.Option;

class selectedProInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.selectedItemInfo) {
            this.props.getProjectInfoAction(this.props.selectedItemInfo.selectedItemId);
            this.props.getProjectMembersAction(this.props.selectedItemInfo.selectedItemId);
        }
    }

    componentWillReceiveProps(nextProps) {
        const thisProId = this.props.selectedItemInfo ? this.props.selectedItemInfo.selectedItemId : '';
        const nextProId = nextProps.selectedItemInfo ? nextProps.selectedItemInfo.selectedItemId : '';
        //点击不同项目，重新加载数据
        if (thisProId != nextProId) {
            this.props.getProjectInfoAction(nextProps.selectedItemInfo.selectedItemId);
            this.props.getProjectMembersAction(nextProps.selectedItemInfo.selectedItemId);
        }
    }

    memberCountClick(record){
        this.context.router.push({
            pathname: '/project-mgr/project-item/project-member',
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
        const {projectMembers,getProjectInfo} = this.props;
        const dataSource = this.getDataSource(projectMembers,getProjectInfo);
        const selectedProjectSet = this.props.selectedItemInfo;
        return (
            <div className={styles.project_list_div}>
                <TableView columns={columns(this)}
                           dataSource={dataSource}
                           loading={this.props.loadGetProjectInfo || this.props.loadProjectMembers}
                ></TableView>
            </div>
        )
    }
}

const columns = (self)=>[
    {title: "项目名称", dataIndex: "project_name", key: "project_name"},
    {title: "项目描述", dataIndex: "description", key: "description"},
    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum",
        render(text,record){
            return <a onClick={self.memberCountClick.bind(self,record)}>{text}</a>
        }
    },
    {title: "下一里程碑时间节点", dataIndex: "next_milestom", key: "next_milestom"},
    {title: "项目状态", dataIndex: "state", key: "state"},
    {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
    {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
];

selectedProInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        getProjectInfo:state.getProjectInfo.projectInfo,
        loadGetProjectInfo: state.getProjectInfo.loading,
        projectMembers:state.getProjectMembers.projectMembers,
        loadProjectMembers:state.getProjectMembers.loading,
        selectedItemInfo: state.projectSetToState.selectedProjectSet,
    }
}

function mapDispatchToProps(dispatch){
    return{
        getProjectInfoAction: bindActionCreators(getProjectInfo, dispatch),
        getProjectMembersAction: bindActionCreators(getProjectMembers, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(selectedProInfo);

