/**
 * Created by zhaojp on 2016/12/23.
 */
import React,{ PropTypes, Component } from 'react';
import { Spin } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box'
import CodeView from '../../components/codeView'
import {getCodeChanges} from './mergeRequest-action'


class CodeChanges extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount(){
        const {record,projectId} = this.props.location.state;
        this.props.getCodeChangesAction(record.key,projectId);
    }

    render(){
        const {record} = this.props.location.state;
        const codeChanges = this.props.codeChanges;
        const loading = this.props.getCodeChangesLoading? true: false;
        const showChanges = codeChanges?codeChanges.changes.map((data,index) => <CodeView key={index} code={data.diff}/>):null;
        return (
            <Box title="代码变更详情">
                <Spin spinning={loading}>
                    <span>来自 {record.author} 的代码变更--{record.mrTitle}</span>
                    <div style ={{margin:10}}>
                        {showChanges}
                    </div>
                </Spin>
            </Box>
        )
    }
}


function mapStateToProps(state) {
    return {
        codeChanges: state.mergeRequest.codeChanges,
        getCodeChangesLoading: state.mergeRequest.getCodeChangesLoading,
    };
}

function mapDispatchToProps(dispatch){
    return{
        getCodeChangesAction: bindActionCreators(getCodeChanges,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeChanges);