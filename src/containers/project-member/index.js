/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'PubSub-js';
import {connect} from 'react-redux';
import TableView from '../../components/table';
import styles from './index.css';

class ProjectItem extends Component {
    constructor(props) {
        super(props);
        this.showProjectItem = this.showProjectItem.bind(this);
        this.state = {
            type:false,
            selectedKeys:null,
        };
    }

    componentDidMount() {
        //在此处注册对其他控件发送的消息的响应
        //PubSub.subscribe("evtTreeFilterClick",this.showProjectItem.bind(this) );
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        //PubSub.unsubscribe("evtTreeFilterClick");
    }

    showProjectItem(msg,data){
        var count = 0;
        const {list} = this.props;
        for(var i=0;i<list.projectList.group.length;i++){
            if(data.selectedKeys[0] != list.projectList.group[i].group_name){
                count++;
            }
        }
        if(count == list.projectList.group.length){
            this.setState({
                type:true,
                selectedKeys:data.selectedKeys[0]
            });
        }else{
            this.setState({
                type:false,
            });
        }
    }

    render() {
        if(this.state.type == true){
            const {list,fetchStatus,loginInfo} = this.props;
            if (fetchStatus || false) {
                var projectInfo;
                var projectName = this.state.selectedKeys;
                for(var i=0;i<list.projectList.project.length;i++){
                    if(projectName == list.projectList.project[i].project_name){
                        projectInfo = list.projectList.project[i];
                        var groupName = list.projectList.project[i].group_name;
                    }
                }

                var groupInfo;
                for(var i=0;i<list.projectList.group.length;i++){
                    if(groupName == list.projectList.group[i].group_name){
                        groupInfo = list.projectList.group[i];
                    }
                }

                const columns = [
                    {title: "项目人员", dataIndex: "userName", key: "userName"},
                    {title: "角色", dataIndex: "role", key: "role"},
                    {title: "进入项目时间", dataIndex: "join_time", key: "join_time"},
                    {title: "人员状态", dataIndex: "status", key: "status"}
                ];
                const dataSource = [];
                for(var i=0;i<list.projectList.member.length;i++){
                    if(projectName == list.projectList.member[i].project_name){
                        dataSource.push({
                            key:i+1,
                            userName:list.projectList.member[i].userName,
                            role:list.projectList.member[i].role_id,
                            join_time:list.projectList.member[i].join_time,
                            status:list.projectList.member[i].status
                        });
                    }
                }

                return (
                    <div className={styles.project_item_div}>
                        <div>
                            <p>项目创建时间:{projectInfo.create_time}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目组名称:{groupName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.create_for}</p>
                        </div>
                        <TableView columns={columns}
                                   dataSource={dataSource}
                        ></TableView>

                    </div>
                )
            }

            return null;
        }else {
            return null;
        }
    }
}


function mapStateToProps(state) {
    return {
        list: state.projectList.projectList,
        fetchStatus:state.projectList.fetchStatus,
        loginInfo:state.login.profile,
    }
}

export default connect(mapStateToProps)(ProjectItem);
