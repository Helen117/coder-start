/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import { DatePicker, Button, Modal, Form, Input, Col,notification} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class mergeRequestList extends React.Component {
    constructor(props) {
        super(props);
    }

    createMergeRequest(type){
            this.context.router.push({
                pathname: '/createMergeRequest.html',
                state: {editType: type}
            });
    }

    render(){
        return(
            <Box title="MR查看">
                <div style={{marginBottom: 16}}>
                    <Button className="pull-right" type="primary"  onClick={this.createMergeRequest.bind(this,'add')}>创建MR</Button>
                </div>
            </Box>)
    }
}

mergeRequestList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default (mergeRequestList);