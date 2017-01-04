/**
 * Created by william.xu on 2016/12/29
 */
import React, {PropTypes} from 'react';
import {Select,Radio,Input,Form,Button,Row,Modal,notification} from 'antd';

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

    componentDidUpdate(prevProps, prevState){
        if (!prevState.visible){
            //当modal的visible=true时，可以通过refs获取对象句柄，此时prevState.visible=false
            const editor = this.refs.editor;
            if (editor){
                editor.getCodeMirror().setSize(null, 200);
            }
        }
    }

    showModal(){
        this.setState({
            visible: true,
        });
    }

    handleOk(){
        console.log(this.props.projectName, this.refs.editor.getCodeMirror().getValue().trim());

        const editor = this.refs.editor.getCodeMirror();
        const script = editor.getValue().trim();
        if (script == ''){
            notification.warn({
                message: '警告',
                description: "Pipeline脚本不能为空",
                duration: 5
            });
            editor.focus();
            return;
        }

        this.setState({
            visible:false
        });
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
        const {script} = this.props;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 24},
        };
        var options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'groovy'
        };

        return (
            <div style={{display: "inline-block"}}>
                <Button type="dashed" size="default" onClick={this.showModal.bind(this)}>编辑脚本</Button>
                <Modal title="编辑Jenkins Pipeline脚本"
                       width={800}
                       visible={this.state.visible}
                       okText="保存"
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancle.bind(this)}>
                    <FormItem {...formItemLayout} label="" extra={"注：脚本中需要传递的projectId="}>
                        <CodeMirror ref="editor"
                                    value={script}
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
    script: PropTypes.string,
    projectName: PropTypes.string
};

PipelineScriptEditor.defaultProps = {
    script: '',
    projectName: ''
};

//export default PipelineScriptEditor = Form.create({withRef:true})(PipelineScriptEditor);
export default PipelineScriptEditor;