/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Breadcrumb, Row, Select, Col} from 'antd';
import {getCodeFile} from './actions/code-files-actions';
import styles from "./index.css";
import 'pubsub-js';

const Option = Select.Option;

class CodeFiles extends React.Component {
    //暂时不更新path，显示code就好。
    //code能够正常显示之后，再考虑path,分支的问题
    constructor(){
        super();
        this.state = {
            pathData:[],
            activeKey:null
        }
    }

    componentWillMount(){
        console.log("componentWillMount")
        const pathData = [{path:"devops-web",pathKey:1 }];
        this.setState({
            pathData:pathData,
            activeKey:pathData[0].pathKey
        })
    }

    componentDidMount(){
        //初始化文件树第一级面包屑为项目名称
        //定义一个path数组？初始化为项目名称
        //默认跳转fileTree路由，以项目名称为参数调后台接口，dataSource初始化为返回的第一级数据.
        const {projectInfo} = this.props;
        /*if(!this.isEmptyObject(projectInfo)){
            this.props.getCodeFile(projectInfo.substr(0,projectInfo.length-2));
        }*/
        this.props.getCodeFile(projectInfo);
        this.context.router.push({
            pathname: '/project-mgr/code-file/file-tree',
            //pathname: '/project-mgr/code-file/code-view',
        });
    }

    componentWillReceiveProps(nextProps){
        PubSub.subscribe("evtRefreshFileTree",this.refreshTreePath.bind(this));
    }

    refreshTreePath(msg,data){
        console.log("data:",data)
        console.log("this.state.pathData--re:",this.state.pathData)
        let path_temp = this.state.pathData;
        path_temp.push({
            path:data.path,
            pathKey:this.state.activeKey + 1
        });
        console.log("path_temp:",path_temp)
        this.setState({
            pathData:path_temp,
            activeKey:this.state.activeKey + 1
        })

    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    render(){
        console.log("this.state.pathData:",this.state.pathData)
        const bread = this.state.pathData.map((item)=> {
            return (
                <Breadcrumb.Item key={'bc-' + item.pathKey}>{item.path}</Breadcrumb.Item>
            )
        });

        return (
            <div>
                <Row gutter={16}>
                    <Col span={3}>
                        <Select id="branch" defaultValue="master" className={styles.select}>
                            <Option value="master">master</Option>
                            <Option value="dev">dev</Option>
                            <Option value="release" >release</Option>
                        </Select>
                    </Col>
                    <Col span={6} className={styles.v_middle}>
                        <Breadcrumb >
                            {bread}
                        </Breadcrumb>
                    </Col>
                </Row>
                <Row>
                    {this.props.children}
                </Row>
            </div>
        )
    }
}

CodeFiles.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        projectInfo:state.getProjectInfo.projectInfo
    }
}

function mapDispatchToProps(dispatch){
    return{
        getCodeFile: bindActionCreators(getCodeFile, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeFiles);