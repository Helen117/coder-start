/**
 * Created by Administrator on 2016-09-14.
 */
import React from 'react';
import {Table} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as listActions from './actions/project-list-actions'

class ProjectList extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const { listActions } = this.props;
        listActions.projectList();
    }

    render(){
        const {projectList} = this.props;

        return (
            <div>
                <Table columns={projectList.column} dataSource={projectList.datasource}></Table>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectList: state.projectList,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        listActions: bindActionCreators(listActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);