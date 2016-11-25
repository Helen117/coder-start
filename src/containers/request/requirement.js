/**
 * Created by helen on 2016/11/25.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,Button,Icon  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as request from './actions/request-action';

class RequirementInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const {selectedProjectSet,actions} = this.props;
        if(selectedProjectSet&& selectedProjectSet.id){
            // actions.getDemandInfo(selectedProjectSet.id);
        }
    }

    componentWillReceiveProps(nextProps) {

    }


    editDemand(type,selectedRow){
        this.context.router.push({
            pathname: '/demandEdit',
            state: {editType:type,selectedRow}
        });

    }

    render() {

        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        const data = [{
            "demand_name":"项目优化",
            "business_type":"H5",
            "status":"进行中",
            "last_operation_time":"2016/11/23"
        }];

        const selectedProjectSet = this.props.selectedProjectSet;
        const projectId = selectedProjectSet? selectedProjectSet.id.indexOf('g')!=-1:'';
        if(projectId) {
            return (
                <Box title="需求列表">
                    <Button type="primary" onClick={this.editDemand.bind(this, 'add', null)}>新增</Button>
                    <Table columns={this.columns(this)} dataSource={data}
                           bordered
                           size="middle"
                           pagination={pagination}
                        //loading={this.props.loading}
                           onRowClick={this.editDemand.bind(this, 'modify')}
                    />
                </Box>
            );
        }else{
            return (
                <div className="null_type_div">
                    <span><Icon type="exclamation-circle-o" />   请选择一个项目集合</span>
                </div>
            )
        }
    }
}

RequirementInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


RequirementInfo.prototype.columns = (self)=>[{
    title: '里程碑',
    dataIndex: 'milestone',
},{
    title: '需求名称',
    dataIndex: 'demand_name',
}, {
    title: '当前状态',
    dataIndex: 'status',
},{
    title: '业务范畴',
    dataIndex: 'business_type',
},{
    title: '创建人',
    dataIndex: 'author',
},{
    title: '最后操作时间',
    dataIndex: 'last_operation_time',
}, {
    title: '需求确认时间',
    dataIndex: 'demand_confirmation_time',
}, {
    title: '期望上线时间',
    dataIndex: 'expected_on-line_time',
}];


function mapStateToProps(state) {
    return {
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
        loading:state.request.loading,
        requirementInfo: state.request.requirementInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(request,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequirementInfo);