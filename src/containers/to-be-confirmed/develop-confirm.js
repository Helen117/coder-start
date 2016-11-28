/**
 * Created by helen on 2016/11/23.
 */
/**
 * Created by helen on 2016/11/7.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,InputNumber,Table,message,Spin,Upload,Icon  } from 'antd';
import TransferFilter from '../../components/transfer-filter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';

const FormItem = Form.Item;
 class DevelopConfirm  extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    }

    handleChange(targetKeys){
        this.targetKeys = targetKeys;
    }


    approve(){
        const {form} = this.props;
        console.log(form.getFieldsValue());
        const {record} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();

            }
        })
    }


    render() {

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 12 },
        };

        const props = {
            action: '/upload.do',
            beforeUpload(file){
                console.log(file);
                const isWord = file.type === 'application/msword';//'application/vnd.ms-excel'
                if (!isWord) {
                    message.error('只能上传word文档',3);
                }
                return isWord;
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                    let fileList = info.fileList;

                    fileList = fileList.map((file) => {
                        if (file.response) {
                            file.url = file.response.url;
                        }
                        return file;
                    });

                    this.setState({ fileList });

                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`,3);
                }
            },
        };

        const dataSource =[
            {"name":"项目优化",
            "description":"新增需求功能",
            "due_date":"2016/12/12",
            "director":"小磊"}
        ];

        const projectInfo =[
            {"id":1,
                "name":"devops/devops_web"},
            {"id":2,
                "name":"devops/devops_scm"}
        ];

        return(
            <Box title="代办事项确认操作">
                    <Table columns={this.columns(this)} dataSource={dataSource}
                           bordered
                           size="middle"
                           pagination={false}
                           //loading={this.props.getDetailLoading}
                    />
                    <div style={{marginTop: 16}}>
                        <Form horizontal>
                            <FormItem {...formItemLayout} label="设计工时" >
                                {getFieldDecorator('time',{rules:[{required:true,type:"number",message:'不能为空'}]})(<InputNumber min={1} max={100}/>)}
                            </FormItem>
                            <FormItem   {...formItemLayout} label="涉及项目">
                                    {getFieldDecorator('project',{rules:[{required:true,type:"array",message:'请选择项目'}]})(<TransferFilter dataSource = {projectInfo}

                                                                                      onChange={this.handleChange.bind(this)}
                                                                                      loadingProMsg={false }
                                                                                      //fetchProMsgErr ={this.props.fetchProMsgErr}
                                                                                      //targetKeys = {targetKeys}
                                    />)}
                            </FormItem>

                            <FormItem {...formItemLayout}  label="设计文档上传" >
                                {getFieldDecorator('attachment')(
                                    <Upload {...props} fileList={this.state.fileList}>
                                        <Button type="ghost">
                                            <Icon type="upload" /> 点击上传
                                        </Button>
                                    </Upload>)}
                            </FormItem>

                            <FormItem wrapperCol={{ span: 16, offset: 6 }}>
                                <Button type="primary" onClick={this.approve.bind(this)}>提交</Button>
                            </FormItem>
                        </Form>
                    </div>
            </Box>
        );
    }
}

DevelopConfirm.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

DevelopConfirm.prototype.columns = (self)=>[{
    title: '工单名称',
    dataIndex: 'name',
    width: '20%',
},{
    title: '内容',
    dataIndex: 'description',
    width: '20%',
},{
    title: '计划上线时间',
    dataIndex: 'due_date',
    width: '20%',
}, {
    title: '负责人',
    dataIndex: 'director',
    width: '20%',
}];



export default DevelopConfirm = Form.create()(DevelopConfirm);
