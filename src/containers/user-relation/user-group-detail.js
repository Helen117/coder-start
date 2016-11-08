/**
 * Created by Administrator on 2016-11-08.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification} from 'antd';
import Box from '../../components/box';
import 'pubsub-js';

const FormItem = Form.Item;

class UserGroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            reveiveGroup:null,
        }
    }

    render() {
        return(
            <div></div>
        )
    }
}

UserGroupDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UserGroupDetail = Form.create()(UserGroupDetail);

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupDetail);