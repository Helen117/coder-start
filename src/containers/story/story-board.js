/**
 * Created by zhaojp on 2017/3/30.
 */
/**
 * Created by zhaojp on 2017/3/29.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Collapse,Tooltip,Row,Col,Button  } from 'antd';
import {getTask,getStory} from './action'
import './index.less';
import EditStory from './editStory'
const Panel = Collapse.Panel;

class Story extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activeKey:[],
            visible: false,
            editType: 'add',
            currentMilestoneMsg: null
        };
        this.storyData = null;
    }

    componentWillMount(){
        const {milestone_id, milestoneId} = this.props.location.state;
        this.getMilestoneMsg(milestone_id);
        if(milestoneId){
            this.props.action.getStory(milestoneId);
        }
    }

    getMilestoneMsg(currentMilestoneId){
        const projectSet= this.props.getProjectSet?this.props.getProjectSet.result:[];
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
        const thisMilestoneId = this.props.location.state.milestoneId;
        const nextMilestoneId = nextProps.location.state.milestoneId;
        const nextMilestone_id = nextProps.location.state.milestone_id
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
        if(this.state.activeKey.length< key.length){
            this.props.action.getTask(key[key.length-1]);
        }
        this.setState({
            activeKey:key
        })

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
                           onClick={this.setVisible.bind(this, true,story,'update')}>{story.title}</a><br/>
                    </Tooltip>
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
            return <Panel header={header} key={story.id} style={{"borderRadius":"4" ,"marginBottom":"24"}}>
                {story.taskData ? <p>{story.taskData.story_id}</p> : <p></p>}
            </Panel>
        })
    }

    render(){
        const {stories,getTaskLoading,loadingMsg } = this.props;
        const defaultActiveKey = stories&&stories.length>0? stories[0].id: '0';
        console.log('defaultActiveKey',defaultActiveKey)
        const milestoneId = this.props.location.state.milestoneId;
        if(stories) {
            const panels = this.createPanels(stories)
            return (
                <div id='story' style={{margin:'10px'}}>
                    <div id="milestone">
                        <div className="block">
                            <div style={{"float":"left"}}>
                                <h2>{this.state.currentMilestoneMsg.name}</h2>
                                <p>{this.state.currentMilestoneMsg.description}</p>
                            </div>
                            <div style={{"float":"right"}}>
                                <Button onClick={this.setVisible.bind(this,true,null,'add')}>创建故事</Button>
                            </div>
                        </div>
                    </div>
                    <Collapse  defaultActiveKey={[defaultActiveKey.toString()]}  onChange={this.handleChange.bind(this)}>
                        {panels}
                    </Collapse>
                    <EditStory story={this.storyData}
                               visible={this.state.visible}
                               editType={this.state.editType}
                               setVisible={this.setVisible.bind(this)}
                               milestoneId = {milestoneId}/>
                </div>
            )
        }else {
            return (<div></div>)
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
    };
}

function mapDispatchToProps(dispatch){
    return{
        action : bindActionCreators({getStory,getTask},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Story);

