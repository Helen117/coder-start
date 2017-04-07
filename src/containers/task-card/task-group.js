/**
 * Created by william.xu on 2017/4/7
 */
import React, { PropTypes, Component } from 'react';
import {Row, Col, Card} from 'antd';
import Box from '../../components/box';
import { DropTarget } from 'react-dnd';

const boxTarget = {
    drop(props, monitor, component) {
        return {type:props.type, storyId:props.storyId};
    },
    hover(props, monitor, component){
    },
    canDrop(props, monitor){
        if (props.type=='DONE'){
            return false;
        }else{
            const item = monitor.getItem();
            if (props.type == item.type || props.storyId != item.storyId){
                return false;
            }
            return true;
        }
    }
};

class TaskGroup extends React.Component{
    constructor (props) {
        super(props);
    }

    render(){
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;

        const {title, action, headerStyle} = this.props;
        return connectDropTarget(
            <div>
                <Box title={title} classType="bg" action={action} headerStyle={headerStyle}>
                    {this.props.children}
                </Box>
            </div>
        );
    }

}


TaskGroup.propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
};

export default DropTarget('task', boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))(TaskGroup);