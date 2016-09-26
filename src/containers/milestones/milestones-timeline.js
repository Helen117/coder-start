/**
 * Created by zhaojp on 2016/9/18.
 */


import React, {PropTypes} from 'react';
import {Timeline,Button,Progress,Col,Row } from 'antd';
import Box from '../../components/box';
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

    moreMilestones(milestonesId){
        const projectId =17;
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
        const {items} = this.props;

        const timeLine = items.map((item) => {
            let i = 0;
            return (
                <div>
                    <Row>
                        <Col span="10">

                            <Timeline.Item   key={'milestones' + item.gitlabMilestone.id}>

                                    <Row style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑{item.gitlabMilestone.title}</Row>
                                    <Row>
                                        <Col span="1"></Col>
                                            <Col span="23">
                                            <Row >计划发布时间：{this.getTime(item.gitlabMilestone.due_date)}</Row>
                                            <Row>创建人：{item.owner}</Row>
                                            <Row>待解决的问题:</Row>

                                            {item.issues.map((node) => {
                                                //console.log('item.issues',item.issues);
                                                i++;
                                                return (
                                                    <Row key={i}  >
                                                        <Col span="1"/>
                                                        {i}.{node}
                                                    </Row>
                                                );
                                            })}
                                             <Progress percent={item.rate} />
                                            <a onClick={this.moreMilestones.bind(this, item.gitlabMilestone.id)}>查看更多</a>
                                            </Col>
                                    </Row>
                            </Timeline.Item>

                            </Col>
                    </Row>
                </div>

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
    //console.log('获取到的item：',state.milestones.items);
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

