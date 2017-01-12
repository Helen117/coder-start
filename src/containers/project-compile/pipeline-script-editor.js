/**
 * Created by william.xu on 2016/12/29
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Select,Radio,Input,Form,Button,Row,Modal,notification,Spin} from 'antd';
import {savePipelineScript, getPipelineScript} from './action';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/groovy/groovy';

const FormItem = Form.Item;

class PipelineScriptEditor extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            visible:false
        }
    }

    componentDidMount(){
        // const cm = this.refs.editor.getCodeMirror();
        // cm.setSize(null, 500);
    }

    componentWillReceiveProps(nextProps){

    }

    componentDidUpdate(prevProps, prevState){
        if (!prevState.visible){
            //当modal的visible=true时，可以通过refs获取对象句柄，此时prevState.visible=false
            const editor = this.refs.editor;
            if (editor){
                 editor.getCodeMirror().setSize(null, 200);
            }
        }
        if (!prevProps.savePipelineScriptResult && this.props.savePipelineScriptResult){
            notification.success({
                message: '操作成功',
                description: "成功保存Jenkins Pipeline脚本！",
                duration: 5
            });
            this.setState({
                visible:false
            });
        }
    }

    showModal(){
        this.setState({
            visible: true,
        });
        this.props.getPipelineScript(this.props.projectName);
    }

    handleOk(){

        const editor = this.refs.editor.getCodeMirror();
        const script = editor.getValue().trim();
        if (script == ''){
            notification.warn({
                message: '警告',
                description: "Jenkins Pipeline脚本不能为空",
                duration: 5
            });
            editor.focus();
            return;
        }

        const {projectName, savePipelineScript} = this.props;
        savePipelineScript(projectName, this.refs.editor.getCodeMirror().getValue().trim());

        // this.setState({
        //     visible:false
        // });
    }

    handleCancle(){
        this.setState({
            visible:false
        });
    }

    updateCode(newCode) {
        // this.setState({
        //     code: newCode
        // });
    }
    interact(cm) {
        // console.log('interact', cm.getValue());
    }

    render(){
        const {getPipelineScriptLoading, pipelineScriptInfo, savePipelineScriptLoading} = this.props;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 24},
        };
        var options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'groovy'
        };
        let title = '编辑Jenkins Pipeline脚本';
        if (getPipelineScriptLoading){
            title = '正在加载Jenkins Pipeline脚本...';
        }
        return (
            <div style={{display: "inline-block"}}>
                <Button type="dashed" size="default" onClick={this.showModal.bind(this)}>编辑脚本</Button>
                <Modal title={title}
                       width={800}
                       visible={this.state.visible}
                       okText="保存"
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancle.bind(this)}
                       footer={[
                           <Button key="back" type="ghost" onClick={this.handleCancle.bind(this)}>取消</Button>,
                           <Button key="submit" type="primary" loading={savePipelineScriptLoading} onClick={this.handleOk.bind(this)}>
                               保存
                           </Button>,
                       ]}>
                    <FormItem {...formItemLayout} label="" extra={""}>
                        <CodeMirror ref="editor"
                                    value={pipelineScriptInfo?pipelineScriptInfo:''}
                                    onChange={this.updateCode.bind(this)}
                                    options={options}
                                    interact={this.interact} />
                    </FormItem>
                </Modal>
            </div>
        );

    }


}


PipelineScriptEditor.propTypes = {
    projectName: PropTypes.string
};

PipelineScriptEditor.defaultProps = {
    projectName: ''
};

function mapStateToProps(state) {
    return {
        getPipelineScriptLoading: state.projectCompile.getPipelineScriptLoading,
        pipelineScriptInfo: state.projectCompile.pipelineScriptInfo,
        savePipelineScriptLoading: state.projectCompile.savePipelineScriptLoading,
        savePipelineScriptResult: state.projectCompile.savePipelineScriptResult,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getPipelineScript: bindActionCreators(getPipelineScript, dispatch),
        savePipelineScript: bindActionCreators(savePipelineScript, dispatch),
    }
}

//export default PipelineScriptEditor = Form.create({withRef:true})(PipelineScriptEditor);
export default connect(mapStateToProps, mapDispatchToProps)(PipelineScriptEditor);