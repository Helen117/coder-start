/**
 * Created by william.xu on 2017/4/7
 */
import React from 'react';
import {Row, Col, Card} from 'antd';
import { DragSource, DropTarget } from 'react-dnd';

const style = {
    // border: '1px dashed gray',
    // backgroundColor: '#F7F7F7',
    // padding: '5px',
    // margin: '10px',
    //cursor: 'move',
    //float: 'left',
};

const taskSource = {

    beginDrag(props, monitor, component) {
        return {
            id: props.id,
            storyId: props.storyId,
            type: props.type
        };
    },

    endDrag(props, monitor, component) {
        // const { id: droppedId, originalIndex } = monitor.getItem();
        const didDrop = monitor.didDrop();
        if (didDrop){
            props.moveTask(monitor.getItem(), monitor.getDropResult());
        }
    },

    canDrag(props, monitor){
        if (props.type == 'DONE'){
            return false;
        }else{
            return true;
        }
    }

};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}


class Task extends React.Component{
    constructor (props) {
        super(props);
    }

    render(){
        const {text, isDragging, connectDragSource, type } = this.props;
        const opacity = isDragging ? 0 : 1;
        return (
            connectDragSource(
                <div style={{...style, opacity, cursor:type=='DONE'?'default':'move'}}>
                    <Card style={{marginBottom:"5px"}}>
                        {this.props.children}
                    </Card>
                </div>
            )
        );
    }

}

export default DragSource("task", taskSource, collect)(Task);