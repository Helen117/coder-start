/**
 * Created by Administrator on 2016-11-08.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Row, Col} from 'antd';
import UserRelation from '../user-relation/index';

export default  class AddProjectMember extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <UserRelation/>
            </div>
        )
    }
}