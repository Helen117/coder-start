/**
 * Created by zhaojp on 2016/9/27.
 */

import React, {PropTypes} from 'react';
import {Timeline,Button,Row,Col,Progress} from 'antd';
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
        console.log('items',items);
        const {loading, loadingMsg,notFoundMsg} = this.props;
        if (items != null && items!= 'undefined'){
        var timeLine = items.map((item) => {
            //根据状态及完成情况设置时间轴颜色
            var timelineColor = '';
            if (item.gitlabMilestone.state == 'closed'){
                timelineColor="green";
            }else if(item.gitlabMilestone.state == 'active' && item.gitlabMilestone.due_date <= Date.now()){
                timelineColor="red";
            }else{
                timelineColor="blue";
            }
            let i = 0;
            return (
                <Timeline.Item color={timelineColor}  key={'milestones' + item.gitlabMilestone.id}>
                    <p style={{color:'rgba(6, 19, 126, 0.86)'}}>里程碑{item.gitlabMilestone.title}</p>
                    <div style={{marginLeft:12,width:500}}>
                        <p >计划发布时间：{this.getTime(item.gitlabMilestone.due_date)}</p>
                        <p>创建人：{item.owner}</p>
                        <p>待解决的问题:</p>
                        {item.issues.map((node) => {
                            i++;
                            return (
                                <p style={{marginLeft:12}} key={i} >{i}.{node}</p>
                            );
                        })}
                        <Progress percent={item.rate} />
                        <a onClick={this.moreMilestones.bind(this, item.gitlabMilestone.id)}>查看更多</a>
                    </div>
                </Timeline.Item>
            )
        })}else{
            var timeLine ='';
        };

        return (
            <Box title="里程碑">
                <div style={{marginBottom: 16}}>
                    <Button className="pull-right" type="primary"  onClick={this.createMilestones.bind(this)}>创建里程碑</Button>
                </div>
                {loading?(
                    <span className="filter-not-found">
                        <i className="anticon anticon-loading"><span style={{paddingLeft:5}}>{loadingMsg?loadingMsg:'正在加载数据...'}</span></i>
                    </span>
                ):(
                    timeLine.length==0?
                        (<span className="filter-not-found">{notFoundMsg?notFoundMsg:'没有数据'}</span>)
                        :(<Timeline >{timeLine}</Timeline>)
                )}

            </Box>
        )
    }
}

Milestones.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

Milestones.propTypes = {
    loadingMsg: PropTypes.string,
    notFoundMsg: PropTypes.string,
    loading: PropTypes.bool,
};

function mapStateToProps(state) {
    //console.log('获取到的item：',state.milestones.items);
    return {
        items: state.milestones.items,
        loading:state.milestones.loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestones: bindActionCreators(getMilestones, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Milestones);