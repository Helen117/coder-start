/**
 * Created by william.xu on 2016/12/29
 */
import React, {PropTypes} from 'react';
import {Select,Radio,Input,Form,Button,Row,Modal} from 'antd';

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

    showModal(){
        this.setState({
            visible: true,
        });
    }

    handleOk(){
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
                <Button type="ghost" size="default" onClick={this.showModal.bind(this)}>编辑脚本</Button>
                <Modal title="编辑Jenkins Pipeline脚本"
                       width={800}
                       visible={this.state.visible}
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancle.bind(this)}>
                    <FormItem {...formItemLayout} label="" extra={"注：脚本中需要传递的projectId="}>
                        <CodeMirror ref="editor"
                                    onChange={this.updateCode.bind(this)}
                                    options={options}
                                    interact={this.interact} />
                    </FormItem>
                </Modal>
            </div>
        );

    }


}

export default PipelineScriptEditor = Form.create({withRef:true})(PipelineScriptEditor);