/**
 * Created by zhaojp on 2017/3/30.
 */
/**
 * Created by zhaojp on 2017/3/29.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Collapse,Tooltip,Row,Col,Button,Alert  } from 'antd';
import {getTask,getStory} from './action'
import './index.less';
import EditStory from './editStory'
import TaskCard from '../task-card'

const Panel = Collapse.Panel;

class Story extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activeKey:[],
            visible: false,
            editType: 'add',
            currentMilestoneMsg: {"name":null,"description":null}
        };
        this.storyData = null;
    }

    componentWillMount(){
        const {getTreeState} = this.props;
        const milestone_id = getTreeState?getTreeState.milestone_id:null;
        const milestoneId =  getTreeState?getTreeState.milestoneId:null;
        if(milestone_id && milestoneId){
            this.getMilestoneMsg(milestone_id);
            this.props.action.getStory(milestoneId);
        }

    }

    getMilestoneMsg(currentMilestoneId){
        const projectSet= this.props.getProjectSet?this.props.getProjectSet.result?this.props.getProjectSet.result:[]:[];
        for(let i=0; i<projectSet.length; i++){
            if(projectSet[i].children){
                for(let j=0; j<projectSet[i].children.length; j++){
                    if(currentMilestoneId == projectSet[i].children[j].id){
                        this.setState({
                            currentMilestoneMsg : projectSet[i].children[j]
                        })
                        break;
                    }
                }
            }
        }
    }

    componentWillReceiveProps(nextProps){
        const {stories} = nextProps;
        const thisMilestoneId = this.props.getTreeState?this.props.getTreeState.milestoneId:null;
        const nextMilestoneId = nextProps.getTreeState? nextProps.getTreeState.milestoneId: null;
        const nextMilestone_id = nextProps.getTreeState? nextProps.getTreeState.milestone_id: null;
        if( nextMilestoneId && nextMilestoneId!=thisMilestoneId){
             this.getMilestoneMsg(nextMilestone_id);
             this.props.action.getStory(nextMilestoneId);
         }
        if(stories && stories.length>0 && stories!=this.props.stories){
            this.props.action.getTask(stories[0].id);
        }
        //点击不同项目集，重新加载数据

    }

    handleChange(key){
        /*if(this.state.activeKey.length< key.length){
            this.props.action.getTask(key[key.length-1]);
        }
        this.setState({
            activeKey:key
        })*/

    }

    setVisible(flag,story,editType,e){
        if(e){
            e.stopPropagation();
        }
        this.storyData = story;
        this.setState({
            visible:flag,
            editType:editType
        });
    }


    createPanels(stories){
        return stories.map((story, index)=> {

            const header = <Row style={{"margin": '5px'}} type="flex" align="middle">
                <Col span="18">
                    <Tooltip placement="top" title='点击编辑'>
                        <a style={{"fontSize": "14px"}}
                           onClick={this.setVisible.bind(this, true,story,'update')}>{story.title}</a>
                    </Tooltip>
                    <br/>
                    <span>{story.description}</span>
                </Col>
                <Col span="6">
                    <Col span="23">
                        状态：{story.story_status}
                    </Col>
                    <Col span="1">
                        <div style={{minHeight: '30px',backgroundColor: '#108EE9'}}>
                        </div>
                    </Col>
                </Col>
            </Row>
            return <Panel header={header} key={story.id}>
                <TaskCard storyId={story.id}></TaskCard>
            </Panel>
        })
    }

/*<div style={{"display":"inline-block","float":"left"}}>
 <h2>{this.state.currentMilestoneMsg.name}</h2>
 <p>{this.state.currentMilestoneMsg.description}</p>
 </div>
 <div style={{"display":"inline-block","float":"right"}}>
 <Button onClick={this.setVisible.bind(this,true,null,'add')}>创建故事</Button>
 </div>*/

    render(){
        const {stories,getTaskLoading,loadingMsg } = this.props;
        const defaultActiveKey = stories&&stories.length>0? stories[0].id: '0';
        const milestoneId = this.props.getTreeState? this.props.getTreeState.milestoneId:null;
        const milestoneContent = this.state.currentMilestoneMsg? <div id="milestone">
            <div className="block">
                <div style={{"float":"left"}}>
                    <h2>{this.state.currentMilestoneMsg.name}</h2>
                    <p>{this.state.currentMilestoneMsg.description}</p>
                </div>
                <div style={{"float":"right",  "lineHeight": "normal"}}>
                    <Button onClick={this.setVisible.bind(this,true,null,'add')}>创建故事</Button>
                </div>
            </div>
        </div>:<div/>
        if(milestoneId){
            if(stories) {
                const panels = this.createPanels(stories)
                return (
                    <div id='story' style={{margin:'10px'}}>
                        {milestoneContent}
                        <Collapse  defaultActiveKey={[defaultActiveKey.toString()]}  onChange={this.handleChange.bind(this)}>
                            {panels}
                        </Collapse>
                        <EditStory story={this.storyData}
                                   visible={this.state.visible}
                                   editType={this.state.editType}
                                   setVisible={this.setVisible.bind(this)}
                                   milestoneId = {milestoneId}
                                   currentMilestoneMsg = {this.state.currentMilestoneMsg}/>
                    </div>
                )
            }else {
                return milestoneContent
            }
        }else{
            return <Alert style={{margin:10}}
                          message="请从左边的项目树中选择一个里程碑"
                          description=""
                          type="warning"
                          showIcon
            />
        }

    }
}

Story.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {

        //jointTaskData : state.story.jointTaskData,
        getTaskLoading : state.story.getTaskLoading,
        getStoryLoading : state.story.getStoryLoading,
        stories : state.story.story,
        getProjectSet : state.taskBoardReducer.getProjectSet,
        getTreeState:state.taskBoardReducer.saveTreeState,
    };
}

function mapDispatchToProps(dispatch){
    return{
        action : bindActionCreators({getStory,getTask},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Story);

