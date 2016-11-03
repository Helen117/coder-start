/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Breadcrumb, Row, Select} from 'antd';
import {getCodeFile} from './actions/code-files-actions';

const Option = Select.Option;

class CodeFiles extends React.Component {
    //暂时不更新path，显示code就好。
    //code能够正常显示之后，再考虑path,分支的问题
    constructor(){
        super();
    }

    componentWillMount(){

    }

    componentDidMount(){
        //初始化文件树第一级面包屑为项目名称
        //定义一个path数组？初始化为项目名称
        //默认跳转fileTree路由，以项目名称为参数调后台接口，dataSource初始化为返回的第一级数据.
        const {projectInfo} = this.props;
        //this.props.getCodeFile(projectInfo.substr(0,projectInfo.length-2));
        this.context.router.push({
            //pathname: '/project-mgr/code-file/file-tree',
            pathname: '/project-mgr/code-file/code-view',
        });
    }

    componentWillReceiveProps(nextProps){}

    render(){

        return (
            <div>
                {/*<Row>
                    <Select id="branch">
                        <Option value="master">master</Option>
                        <Option value="dev">dev</Option>
                        <Option value="release" >release</Option>
                    </Select>
                    <Breadcrumb>

                    </Breadcrumb>
                </Row>*/}
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
        //getCodeFile: bindActionCreators(getCodeFile, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeFiles);