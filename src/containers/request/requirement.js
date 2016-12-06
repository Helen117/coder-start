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
            let id =selectedProjectSet.id.substr(0,selectedProjectSet.id.length-2);
            actions.getDemandInfo(id);
        }
    }

    componentWillReceiveProps(nextProps) {

        const {actions,selectedProjectSet} = this.props;
        const thisSetId = selectedProjectSet?selectedProjectSet.id:'';
        const nextSetId = nextProps.selectedProjectSet?nextProps.selectedProjectSet.id:'';
        //点击不同项目集，重新加载数据
        if(nextSetId&&thisSetId != nextSetId){
            actions.getDemandInfo(nextSetId.substr(0,nextSetId.length-2));
        }

    }


    editDemand(type,selectedRow){
        this.context.router.push({
            pathname: '/demandEdit',
            state: {editType:type,selectedRow}
        });

    }

    getDataSources(list){
        if(list&&list.length>0){
            for(var i=0;i<list.length;i++){
                if(typeof(list[i].practice_due_date)=="number") {
                    list[i].last_operation_time = new Date(parseInt(list[i].practice_due_date)).toLocaleDateString();
                }
                if(typeof(list[i].expect_due_date)=="number") {
                    list[i].expected_due_date = new Date(parseInt(list[i].expect_due_date)).toLocaleDateString();
                }
                if(typeof(list[i].demand_comfirm_date)=="number") {
                    list[i].demand_confirm_time = new Date(parseInt(list[i].demand_comfirm_date)).toLocaleDateString();
                }
                list[i].label = list[i].label_names&&list[i].label_names.length>0?list[i].label_names+'':'';
                list[i].label_id = list[i].label_ids&&list[i].label_ids.length>0?list[i].label_ids+'':'';
            }
        }
        return list;
    }

    render() {

        console.log('data:',this.props.requirementInfo);
        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        const selectedProjectSet = this.props.selectedProjectSet;
        const projectId = selectedProjectSet? selectedProjectSet.id.indexOf('g')!=-1:'';
        if(projectId) {
            return (
                <Box title="需求列表">
                    <Button type="primary" onClick={this.editDemand.bind(this, 'add', null)}>新增</Button>
                    <Table columns={this.columns(this)} dataSource={this.getDataSources(this.props.requirementInfo)}
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
    dataIndex: 'milestone_name',
},{
    title: '需求名称',
    dataIndex: 'title',
}, {
    title: '当前状态',
    dataIndex: 'state',
},{
    title: '业务范畴',
    dataIndex: 'label',
},{
    title: '创建人',
    dataIndex: 'author',
},{
    title: '最后操作时间',
    dataIndex: 'last_operation_time',
}, {
    title: '需求确认时间',
    dataIndex: 'demand_confirm_time',
}, {
    title: '期望上线时间',
    dataIndex: 'expected_due_date',
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