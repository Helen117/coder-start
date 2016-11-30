/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/11/30
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Alert, notification, Row, Col} from 'antd';

class ProjectBuildHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
    }
    componentDidMount(){
    }
    componentWillUnmount(){
    }

    componentWillReceiveProps(nextProps){
    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    componentWillUpdate(nextProps, nextState){

    }
    componentDidUpdate(prevProps, prevState){
    }
    render(){
        return (<div>build his</div>);
    }

}

ProjectBuildHistory.contextTypes = {
};

ProjectBuildHistory = Form.create()(ProjectBuildHistory);

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBuildHistory);
