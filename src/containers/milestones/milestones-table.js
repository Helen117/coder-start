/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import { Table } from 'antd';
import Box from '../../components/Box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestonesDetail} from './actions/milestones-action';

import './index.less';

class MilestoneDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
        console.info('componentDidMount');
        const {milestonesId} = this.props.location.state;

        if (milestonesId){
            this.props.getMilestonesDetail(milestonesId);
        }
    }

    //时间戳转换成日期
    getTime(date) {
        return new Date(parseInt(date)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    }

    //获取表格的数据源
    getDataSource(){
        const milestoneDetail = this.props.milestoneDetail.result;
        console.log('获取表格数据：',milestoneDetail);
        const data = [];
        if(milestoneDetail !=null){
            for (let i = 0; i < milestoneDetail.length; i++) {
                data.push({
                    title: milestoneDetail[i].title,
                    author_name: milestoneDetail[i].author.name,
                    assignee_name: milestoneDetail[i].assignee.name,
                    created_at:  this.getTime(milestoneDetail[i].created_at),
                    labels: milestoneDetail[i].labels,
                    state: milestoneDetail[i].state,
                });
            }
        }
        return data;
    }

    render(){

        return(
            <Box title="里程碑详细信息">
            <Table columns={this.milestoneListColumns(this)} dataSource={this.getDataSource()}
                bordered={false}
                   showHeader={true}
                   size="middle">
            </Table>
            </Box>

        )

    }



}


MilestoneDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


MilestoneDetail.prototype.milestoneListColumns = (self)=>[{
    title: '问题名称',
    dataIndex: 'title',
    width: '12.5%'
}, {
    title: '创建人',
    dataIndex: 'author_name',
    width: '12.5%'
},{
    title: '修复人',
    dataIndex: 'assignee_name',
    width: '12.5%'
},{
    title: '问题标签',
    dataIndex: 'labels',
    width: '12.5%'
}, {
    title: '问题创建时间',
    dataIndex: 'created_at',
    width: '12.5%'
}, {
    title: '计划完成时间',
    dataIndex: 'releaseTime',
    width: '12.5%'
},{
    title: '状态',
        dataIndex: 'state',
        width: '12.5%'
}];



function mapStateToProps(state) {
    console.log('获取到的里程碑详细数据：',state.milestones.milestoneDetail);
    return {
        milestoneDetail: state.milestones.milestoneDetail,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesDetail: bindActionCreators(getMilestonesDetail, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneDetail);