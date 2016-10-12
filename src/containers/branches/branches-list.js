/**
 * Created by zhaojp on 2016/10/11.
 */
/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import { DatePicker, Button, Modal, Form, Input, Col,notification} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class branchesList extends React.Component {
    constructor(props) {
        super(props);
    }

    createBranches(type){
        this.context.router.push({
            pathname: '/createBranches.html',
            state: {editType: type}
        });
    }

    render(){
        return(
            <Box title="分支查看">
                <div style={{marginBottom: 16}}>
                    <Button className="pull-right" type="primary"  onClick={this.createBranches.bind(this,'add')}>创建分支</Button>
                </div>
            </Box>)
    }
}

branchesList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default (branchesList);