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
import {getProjectInfo} from './project-set-action';

const Option = Select.Option;

class SelectedProInfo extends Component {
    constructor(props) {
        super(props);
    }

    isEmptyObject(obj){
        if(obj){
            for(var key in obj){
                if (obj.hasOwnProperty(key)) {
                    return false;
                }
            }
        }else {
            return true;
        }

    }

    componentDidMount() {
        const {selectedItemInfo,projectInfo} = this.props;
        if(selectedItemInfo && (this.isEmptyObject(projectInfo) || projectInfo.id!=selectedItemInfo.selectedItemId)) {
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
        if(itemId.indexOf("_p")>=0) {
            const projectId = itemId.substring(0,itemId.length-2);
            const userId = this.props.loginInfo.userId;
            this.props.getProjectInfoAction(projectId,userId);
        }
    }

    getDataSource(getProjectInfo) {
        const data = [];
        if (!this.isEmptyObject(getProjectInfo) ) {
            data.push({
                project_name: getProjectInfo.name,
                description: getProjectInfo.description,
                memberNum: "共" + getProjectInfo.member_count + "人",
                current_mileston_date:getProjectInfo.current_mileston_date? new Date(parseInt(getProjectInfo.current_mileston_date)).toLocaleDateString():''
            });
        }
        return data;
    }


    render(){
        const {projectInfo,visible,projectInfoLoading} = this.props;
        if(visible) {
            const dataSource = this.getDataSource(projectInfo);
            const projectLoading = projectInfoLoading? true: false;
            return (
                <div style={{margin: 15}}>
                    <TableView columns={columns(this)}
                               dataSource={dataSource}
                               loading={projectLoading}
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
    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum" ,},
    {title: "当前里程碑计划完成时间", dataIndex: "current_mileston_date", key: "current_mileston_date",width:'20%'},
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
        projectInfoLoading: state.projectSet.projectInfoLoading,
        projectInfo: state.projectSet.projectInfo,
        selectedItemInfo: state.projectSet.selectedProjectSet,
    }
}

function mapDispatchToProps(dispatch){
    return{
        getProjectInfoAction: bindActionCreators(getProjectInfo, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectedProInfo);

