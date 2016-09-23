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
        let projectId = 17;
        this.props.getMilestones(projectId);
    }

    //时间戳转换成日期
    getTime(date) {
        return new Date(parseInt(date)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    }

    moreMilestones(milestonesId,projectId){
        this.context.router.push({
            pathname: '/moreMilestones.html',
            state: {milestonesId,projectId}
        });
    }

    createMilestones(){
        this.context.router.push({
            pathname: '/createMilestones.html',
            //state: {}
        });
    }


    render(){
        let projectId = 17;
        const {items} = this.props;
        const timeLine = items.map((item) => {
            return (

                <Timeline.Item   key={'milestones' + item.gitlabMilestone.id}>
                    <span style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑{item.gitlabMilestone.title}</span><br/>
                    <span>计划发布时间：{this.getTime(item.gitlabMilestone.due_date)}</span><br/>
                    <span>里程碑创建人：{item.owner}</span><br/>
                    <span>里程待解决的问题</span><br/>
                    {item.issues.map((node) => {
                        return (
                            <span key={'milestones' + node} >{node}<br/></span>

                        );
                    })}

                    <a onClick={this.moreMilestones.bind(this, item.gitlabMilestone.id,projectId)}>查看更多</a>

                </Timeline.Item>

            )
        });

        return (
            <Box title="里程碑">
                <div style={{marginBottom: 16}}>
                    <Button className="pull-right" type="primary"  onClick={this.createMilestones.bind(this)}>
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

