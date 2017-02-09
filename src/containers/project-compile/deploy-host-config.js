/**
 * Created by william.xu on 2017/1/3
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Table, Tooltip, Input, Button, Alert, notification, Row, Col, Modal} from 'antd';
import Box from '../../components/box';
import {getDeployHostList, saveDeployHost} from './action';


const Search = Input.Search;
const FormItem = Form.Item;

class DeployHostConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // pagination: {
            //     current: 1,
            //     pageSize: 10
            // }
        };
    }

    handleTableChange(pagination, filters, sorter) {
        let ipKeyValue = '';
        if (this.refs.ipKey){
            ipKeyValue = this.refs.ipKey.input.refs.input.value;
        }
        this.props.getDeployHostList(ipKeyValue, pagination.current, pagination.pageSize);
    }

    addHost(){
        this.props.form.setFieldsValue({
            ip:'',
            loginUser:'',
            password:'',
            id:null
        });
        this.setState({
            // ip:'',
            // loginUser:'',
            // password:'',
            title:'新增发布主机',
            visible:true
        });
    }

    editHost(record){
        this.props.form.setFieldsValue(record);
        this.setState({
            // ip:record.ip,
            // loginUser:record.loginUser,
            // password:record.password,
            title:'修改发布主机',
            visible:true
        });
    }

    handleOk(){
        //e.preventDefault();
        const {form, saveDeployHost} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                saveDeployHost({id: form.getFieldValue('id'), ...values});//values=form.getFieldsValue()
            }
        });
    }

    handleCancel(){
        this.setState({
            visible:false
        });
    }

    componentDidMount(){
        this.props.getDeployHostList();
    }

    componentDidUpdate(prevProps, prevState){
        if (!prevProps.saveDeployHostResult && this.props.saveDeployHostResult){
            notification.success({
                message: '操作成功',
                description: "成功保存发布主机！",
                duration: 5
            });
            this.setState({
                visible:false
            });
            const pagination = this.refs.deployHostList.props.pagination;
            this.props.getDeployHostList(this.refs.ipKey.input.refs.input.value,
                pagination.current, pagination.pageSize);
        }
    }

    getDataSource(data){
        const dataSource =[];
        if (data && data.rows){
            for (let i = 0; i < data.rows.length; i++){
                dataSource.push(data.rows[i]);
            }
        }
        return dataSource;
    }

    getPagination(data){
        const pagination = {};
        if (data && data.rows){
            pagination.current = data.currentPage;
            pagination.total = data.total;
            pagination.pageSize = data.pageSize;
        }
        return pagination;
    }

    render(){
        const {deployHostList, form, saveDeployHostLoading} = this.props;
        const {getFieldDecorator, getFieldError, getFieldValue} = form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16},
        };

        return (
            <Box title="发布主机列表">
                <Row style={{marginBottom:10}}>
                    <Col span={22}>
                        <Search placeholder="请输入IP关键字" style={{width: 300}}
                                onSearch={value => this.props.getDeployHostList(value)}
                                ref='ipKey'/>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" size="default" onClick={this.addHost.bind(this)}>新增主机</Button>
                    </Col>
                </Row>
                <Table columns={this.hostConfigColumns(this)} ref='deployHostList'
                       dataSource={this.getDataSource(deployHostList)}
                       pagination={this.getPagination(deployHostList)}
                       loading={deployHostList?deployHostList.isLoading:false}
                       onChange={this.handleTableChange.bind(this)}
                />
                <Modal title={this.state.title} visible={this.state.visible}
                       onOk={this.handleOk.bind(this)}
                       confirmLoading={saveDeployHostLoading}
                       onCancel={this.handleCancel.bind(this)}>
                    <Form>
                        <FormItem {...formItemLayout} label="IP地址" hasFeedback={false}>
                            {getFieldDecorator('ip', {
                                //initialValue: this.state.ip,
                                rules: [{required: true, message: '请输入IP地址'}]
                            })(
                                <Input type="text" placeholder="请输入IP地址"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="登录用户名">
                            {getFieldDecorator('loginUser', {
                                //initialValue: this.state.loginUser,
                                rules: [{required: true, message: '请输入登录用户名'}]
                            })(
                                <Input type="text" placeholder="请输入登录用户名"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="登录密码">
                            {getFieldDecorator('password', {
                                //initialValue: this.state.password,
                                rules: [{required: true, message: '请输入登录密码'}]
                            })(
                                <Input type="password" placeholder="请输入登录密码"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Box>
        );

    }

}

DeployHostConfig.prototype.hostConfigColumns = (self)=>[
    {
        title: '主机IP',
        dataIndex: 'ip',
        width: '50%',
    },{
        title: '登录用户名',
        dataIndex: 'loginUser',
        width: '30%',
    }, {
        title: '操作',
        dataIndex: 'id',
        width: '10%',
        render: (text, record, index)=> {
            return <div>
                <a onClick={self.editHost.bind(self, record)}>修改</a>
            </div>;
        }
    }];


DeployHostConfig.contextTypes = {
};

DeployHostConfig = Form.create()(DeployHostConfig);

function mapStateToProps(state) {
    return {
        deployHostList: state.projectCompile.deployHostList,
        saveDeployHostLoading: state.projectCompile.saveDeployHostLoading,
        saveDeployHostResult: state.projectCompile.saveDeployHostResult,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getDeployHostList:bindActionCreators(getDeployHostList, dispatch),
        saveDeployHost:bindActionCreators(saveDeployHost, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeployHostConfig);