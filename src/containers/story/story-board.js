/**
 * Created by zhaojp on 2017/3/30.
 */
/**
 * Created by zhaojp on 2017/3/29.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Collapse,Tooltip,Row,Col } from 'antd';
import {getTask,getStory} from './action'
import './index.less';
import EditStory from './editStory'
const Panel = Collapse.Panel;

class Story extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activeKey:[],
            visible: false
        };
        this.storyData = null;
    }

    componentWillMount(){
        this.props.action.getStory(134)
    }

    componentWillReceiveProps(nextProps){
        const {stories} = nextProps;
        if(stories && stories!=this.props.stories){
            if(this.state.activeKey.length==0){
                this.props.action.getTask(stories[0].id);
            }
        }
    }

    handleChange(key){
        if(this.state.activeKey.length< key.length){
            this.props.action.getTask(key[key.length-1]);
        }
        this.setState({
            activeKey:key
        })

    }

    setVisible(flag,story,e){
        if(e){
            e.stopPropagation();
        }
        this.storyData = story;
        this.setState({visible:flag});
    }


    createPanels(stories){
        return stories.map((story, index)=> {

            const header = <Row style={{"margin": '5px'}} type="flex" align="middle">
                <Col span="18">
                    <Tooltip placement="top" title='点击编辑'>
                        <a style={{"fontSize": "14px"}}
                           onClick={this.setVisible.bind(this, true,story)}>{story.title}</a><br/>
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
                {story.taskData ? <p>{story.taskData.story_id}</p> : <p>未建立task</p>}
            </Panel>
        })
    }

    render(){
        const {stories,getTaskLoading,loadingMsg } = this.props;
        const defaultActiveKey = stories&&stories.length>0? stories[0].id: '0';
        if(stories) {
            const panels = this.createPanels(stories)
            return (
                <div id='story' style={{margin:'10px'}}>
                    <Collapse  defaultActiveKey={[defaultActiveKey.toString()]}  onChange={this.handleChange.bind(this)}>
                        {panels}
                    </Collapse>
                    <EditStory story={this.storyData} visible={this.state.visible} editType='update' setVisible={this.setVisible.bind(this)}/>
                </div>
            )
        }else {
            return (<div>未建立story</div>)
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
        stories : state.story.story
    };
}

function mapDispatchToProps(dispatch){
    return{
        action : bindActionCreators({getStory,getTask},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Story);

