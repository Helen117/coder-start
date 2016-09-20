/**
 * Created by zhaojp on 2016/9/18.
 */


import React, {PropTypes} from 'react';
import {Timeline,Button} from 'antd';
import Box from '../../components/Box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestones} from './actions/milestones-action';

import './index.less';


class Milestones extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //let uid = authUtils.getUid();
        let projectId = 3;
        this.props.getMilestones(projectId);
    }

    //时间戳转换成日期
    getTime(date) {
        return new Date(parseInt(date)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
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

                <Timeline.Item   key={'milestones' + item.id}>
                    <span style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑{item.title}</span><br/>
                    <span>计划发布时间：{this.getTime(item.due_date)}</span><br/>
                    <span>里程碑创建人：{item.creator}</span><br/>
                    <span>里程待解决的问题</span><br/>
                    <span>a.{item.issues[0]}(需求)</span><br/>
                    <span>b.{item.issues[1]}(缺陷)</span><br/>
                    <span>c.{item.issues[2]}(bug)</span><br/>
                    <a onClick={this.moreMilestones.bind(this, item.id)}>查看更多</a>

                </Timeline.Item>

            )
        });

        return (
            <Box title="里程碑">
                <div style={{marginBottom: 16}}>
                    <Button className="pull-right" type="primary" >
                        创建里程碑
                    </Button>
                </div>
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
    console.log('获取到的item：',state.milestones.items);
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

