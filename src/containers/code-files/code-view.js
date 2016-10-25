/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row} from 'antd';

class CodeView extends React.Component {
    constructor(){
        super();
    }

    render(){

        return (
            <div>
                <Row>
                    <span>merge</span>
                    <span>毕佩珊 authored 12 days ago</span>
                </Row>
                <Row>
                    <span>index.js 1.84kb</span>
                </Row>
                {/*<Row>
                    代码区
                </Row>*/}
            </div>
        )
    }
}

CodeView.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        fetchProjectStar:state.getProjectStar.fetchStatus,
        starList:state.getProjectStar.starList,
        list: state.getGroupTree.treeData,
        getProjectInfo:state.getProjectInfo.projectInfo,
        forkResult:state.forkProject,
        projectMembers:state.getProjectMembers,
        consernedInfo:state.consernProject.consernedInfo,
        unconsernedInfo:state.unconsernProject.unconsernedInfo,
    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeView);