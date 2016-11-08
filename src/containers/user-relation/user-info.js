/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table} from 'antd';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    getDataSource(userInfoData){
        let dataSource = [];
        return dataSource;
    }

    render(){
        return(
            <div style={{"paddingLeft":10}}>
                <Table columns={this.groupColumns(this)}></Table>
            </div>
        )
    }
}

UserInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        userInfoData:state.getUserInfo.userInfoData
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);

UserInfo.prototype.groupColumns = (self)=>[
    {title: "员工姓名", dataIndex: "userName", key: "userName"},
    {title: "员工部门", dataIndex: "department", key: "department"},
    {title: "上级领导", dataIndex: "leader", key: "leader"},
    {title: "角色", dataIndex: "role", key: "role"},
    {title: "人员状态", dataIndex: "status", key: "status"},
];