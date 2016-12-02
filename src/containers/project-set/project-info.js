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

const Option = Select.Option;

class SelectedProInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {getProjectInfo,selectedItemInfo} = this.props
        if(!getProjectInfo && selectedItemInfo) {
            const itemId = this.props.selectedItemInfo.id;
            this.callAction(itemId);
        }
    }

    componentWillReceiveProps(nextProps) {
        const thisProId = this.props.selectedItemInfo ? this.props.selectedItemInfo.id : '';
        const nextProId = nextProps.selectedItemInfo ? nextProps.selectedItemInfo.id : '';
        //点击不同项目，重新加载数据
        if (thisProId != nextProId && nextProId) {
            this.callAction(nextProId);
        }
    }

    callAction(itemId){
        if(itemId.indexOf("_p")>0) {
            const projectId = itemId.substring(0,itemId.length-2);
            const userId = this.props.loginInfo.userId;
            this.props.getProjectInfoAction(projectId,userId);
        }
    }

    getDataSource(getProjectInfo) {
        const data = [];
        if (getProjectInfo ) {
            data.push({
                project_name: getProjectInfo.name,
                description: getProjectInfo.description,
                memberNum: "共" + getProjectInfo.member_count + "人",
            });
        }
        return data;
    }


    render(){
        const {getProjectInfo,visible} = this.props;
        const dataSource = this.getDataSource(getProjectInfo);
        if(visible) {
            return (
                <div style={{margin: 15}}>
                    <TableView columns={columns(this)}
                               dataSource={dataSource}
                               loading={this.props.getProjectInfoLoading}
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
        loginInfo: state.login.profile,
        getProjectInfo:state.getProjectInfo.projectInfo,
        getProjectInfoLoading: state.getProjectInfo.loading,
        selectedItemInfo: state.projectSetToState.selectedProjectSet,
    }
}

function mapDispatchToProps(dispatch){
    return{
        getProjectInfoAction: bindActionCreators(getProjectInfo, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectedProInfo);

