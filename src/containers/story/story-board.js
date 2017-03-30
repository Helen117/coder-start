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
const Panel = Collapse.Panel;
class Story extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activeKey:[]
        }
    }
    //this.props.action.getTask(this.props.stories);

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
            console.log('调用接口查询card',key[key.length-1]);
            this.props.action.getTask(key[key.length-1]);
        }
        this.setState({
            activeKey:key
        })

    }

    editStory(e,storyId){
        e.stopPropagation();
        this.context.router.push({
            pathName: '/editStory',
            state:{"storyId": storyId}
        })
        //console.log('edit story')
    }

    createPanels(stories){
        return stories.map((story, index)=> {
            const header = <Row style={{"margin": '3px'}} type="flex" align="middle">
                <Col span="18">
                    <Tooltip placement="top" title='点击编辑'>
                        <a style={{"fontSize": "15px"}}
                           onClick={this.editStory.bind(this, story.id)}>{story.title}</a><br/>
                    </Tooltip>
                    <span>{story.description}</span>
                </Col>
                <Col span="6">
                    <Col span="22">
                        状态：{story.story_status}
                    </Col>
                    <Col span="2">
                        <div style={{minHeight: '100%'}}>
                            222
                        </div>
                    </Col>
                </Col>
            </Row>
            return <Panel header={header} key={story.id} style={{"height": "200"}}>
                {story.taskData ? <p>{story.taskData.story_id}</p> : <p>未建立task</p>}
            </Panel>
        })
    }

    render(){
        const {stories,getTaskLoading,loadingMsg } = this.props;
        const defaultActiveKey = [stories&&stories.length>0? stories[0].id: '31'];
            if(stories) {
                const panels = this.createPanels(stories)
                return (<Collapse defaultActiveKey={defaultActiveKey} onChange={this.handleChange.bind(this)}>
                    {panels}
                </Collapse>)
            }else {return (<div>未建立story</div>)}
    }
}

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

