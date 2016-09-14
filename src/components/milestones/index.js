/**
 * Created by zhaojp on 2016/9/14.
 */

import React, {PropTypes} from 'react';
import {Timeline} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestones} from './actions/milestones-action';


class Milestones extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //let uid = authUtils.getUid();
        let projectId = 3;
        this.props.getMilestones(projectId);
    }

    render() {

        const {items} = this.props;
        const timeLine = items.map((item) => {
            return (
                <Timeline.Item key={'milestones' + item.milestonesId}>
                    <span>里程碑{item.milestonesId}</span><br/>
                    <span>计划发布时间{item.planTime}</span><br/>
                    <span>里程碑创建人{item.creator}</span><br/>
                    <span>里程待解决的问题</span><br/>
                    <span>a.{item.demand}(需求)</span><br/>
                    <span>a.{item.defect}(缺陷)</span><br/>
                    <span>a.{item.bug}(bug)</span><br/>

                </Timeline.Item>
            )
        });

        return (
        <Timeline>
            {timeLine}
        </Timeline>
        )
    }
}

function mapStateToProps(state) {
    console.log('获取到的里程碑数据：',state.milestones.items);
    return {
        items: state.milestones.items,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestones: bindActionCreators(getMilestones, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Milestones);
