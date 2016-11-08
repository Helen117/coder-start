/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Breadcrumb, Row, Select, Col} from 'antd';
import {getCodeFile, getCodeContent} from './actions/code-files-actions';
import styles from "./index.css";
import 'pubsub-js';

const Option = Select.Option;

class CodeFiles extends React.Component {
    constructor(){
        super();
        this.state = {
            pathData:[],
            activeKey:0,
            brand:"master"
        }
    }

    componentWillMount(){
        const {projectInfo} = this.props;
        if(projectInfo){
            const pathData = [{path:projectInfo.name,pathKey:1,pathType:"tree" }];
            this.setState({
                pathData:pathData,
                activeKey:pathData[0].pathKey
            })
        }
    }

    componentDidMount(){
        //初始化文件树第一级面包屑为项目名称
        //定义一个path数组？初始化为项目名称
        //默认跳转fileTree路由，以项目名称为参数调后台接口，dataSource初始化为返回的第一级数据.
        PubSub.subscribe("evtRefreshFileTree",this.refreshTreePath.bind(this));
        const {projectInfo} = this.props;
        if(projectInfo){
            this.props.getCodeFile(projectInfo.id,"",this.state.brand);
        }
        this.context.router.push({
            pathname: '/project-mgr/code-file/file-tree',
            state:{filePath:"",brand:this.state.brand}
        });
    }
    componentWillUnmount(){
        //在此处注销对其他控件发送消息的响应
        PubSub.unsubscribe("evtRefreshFileTree");
    }

    refreshTreePath(msg,data){
        let path_temp = this.state.pathData;
        path_temp.push({
            path:data.path,
            pathKey:this.state.activeKey + 1,
            pathType:data.type
        });
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

    clickTreePath(pathName){
        //当点击面包屑时，遍历path，找到点击的name，将此name后的元素都删掉。更新面包屑
        //以pathName传参，跳转到相应页面
        const {projectInfo} = this.props;
        let path_temp = this.state.pathData,type;
        let clickPathIndex;
        for(let i=0; i<path_temp.length; i++){
            if(pathName == path_temp[i].path){
                clickPathIndex = i;
                type = path_temp[i].pathType;
            }
        }
        path_temp.splice(clickPathIndex+1,path_temp.length);
        this.setState({
            pathData:path_temp,
            activeKey:path_temp.length
        });
        let filePath;
        for(let i=0; i<path_temp.length; i++){
            if(i == 0){
                filePath="";
            }else if(i == 1){
                filePath = path_temp[i].path;
            }else {
                filePath += "/"+path_temp[i].path;
            }
        }
        PubSub.publish("evtClickTreePath",filePath);
        if(type == "tree"){
            this.props.getCodeFile(projectInfo.id,filePath,this.state.brand);
            this.context.router.push({
                pathname: '/project-mgr/code-file/file-tree',
                state:{filePath:filePath,brand:this.state.brand}
            });
        }else {
            this.props.getCodeContent(projectInfo.id,filePath,this.state.brand);
            this.context.router.push({
                pathname: '/project-mgr/code-file/code-view',
                state:{pathName:path_temp,brand:this.state.brand,filePath:filePath}
            });
        }
    }

    changeSelect(value){
        const {projectInfo} = this.props;
        const pathData = [{path:projectInfo.name,pathKey:1,pathType:"tree" }];
        this.props.getCodeFile(projectInfo.id,"",value);
        this.setState({
            pathData:pathData,
            activeKey:pathData[0].pathKey,
            brand:value
        });
        PubSub.publish("evtClickBrand",{filePath:""});
        this.context.router.push({
            pathname: '/project-mgr/code-file/file-tree',
            state:{brand:this.state.brand}
        });
    }

    render(){
        const bread = this.state.pathData.map((item)=> {
            return (
                <Breadcrumb.Item key={'bc-' + item.pathKey}><a onClick={this.clickTreePath.bind(this,item.path)}>{item.path}</a></Breadcrumb.Item>
            )
        });

        return (
            <div>
                <Row gutter={16}>
                    <Col span={3}>
                        <Select id="branch" defaultValue="master" className={styles.select}
                                onChange={this.changeSelect.bind(this)}>
                            <Option value="master">master</Option>
                            <Option value="dev">dev</Option>
                            <Option value="release" >release</Option>
                        </Select>
                    </Col>
                    <Col span={21} className={styles.v_middle}>
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
        projectInfo:state.getProjectInfo.projectInfo,
    }
}

function mapDispatchToProps(dispatch){
    return{
        getCodeFile: bindActionCreators(getCodeFile, dispatch),
        getCodeContent: bindActionCreators(getCodeContent, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeFiles);