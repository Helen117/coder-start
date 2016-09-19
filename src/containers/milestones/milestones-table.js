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

    render(){
        const milestoneDetail = this.props;
        console.log('获取到的表格内容：',milestoneDetail.milestoneDetail);
        return(
            <Box title="里程碑详细信息">
            <Table columns={this.milestoneListColumns(this)} dataSource={milestoneDetail.milestoneDetail}
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
    title: '所属项目组',
    dataIndex: 'projectGroup',
    width: '20%'
}, {
    title: '所属项目',
    dataIndex: 'project',
    width: '15%',
}, {
    title: '里程碑名称',
    dataIndex: 'name',
    width: '15%'
}, {
    title: '创建人',
    dataIndex: 'creator',
    width: '15%'
}, {
    title: '计划发布时间',
    dataIndex: 'releaseTime',
    width: '15%'
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