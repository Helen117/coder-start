/**
 * Created by zhaojp on 2016/9/18.
 */


import React, {PropTypes} from 'react';
import {Timeline} from 'antd';
import Box from '../../components/Box';
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

    moreMilestones(milestonesId){
        console.log('router',this.context.router);
        this.context.router.push({
            pathname: window.location.pathname + '/moreMilestones',
            state: {milestonesId}
        });
    }

    render() {

        const {items} = this.props;
        const timeLine = items.map((item) => {
            return (
                <Timeline.Item   key={'milestones' + item.milestonesId}>
                    <span>里程碑{item.milestonesId}</span><br/>
                    <span>计划发布时间：{item.planTime}</span><br/>
                    <span>里程碑创建人：{item.creator}</span><br/>
                    <span>里程待解决的问题</span><br/>
                    <span>a.{item.demand}(需求)</span><br/>
                    <span>a.{item.defect}(缺陷)</span><br/>
                    <span>a.{item.bug}(bug)</span><br/>
                    <a onClick={this.moreMilestones.bind(this, item.milestonesId)}>查看更多</a>

                </Timeline.Item>

            )
        });

        return (
            <Box title="里程碑">
            <Timeline>
                {timeLine}
            </Timeline>
                </Box>
        )
    }
}

Milestones.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
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

