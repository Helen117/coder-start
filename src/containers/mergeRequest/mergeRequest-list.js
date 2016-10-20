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
                pathname: '/createMergeRequest',
                state: {editType: type}
            });
    }

    render(){
        return(
            <div style={{marginTop:15,marginLeft:30}}>
                    <Button className="pull-right" type="primary"  onClick={this.createMergeRequest.bind(this,'add')}>创建MR</Button>
                </div>
                )
    }
}

mergeRequestList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default (mergeRequestList);