/**
 * Created by helen on 2016/12/1.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,Button,Modal,Form,Input } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as label from './actions/label-action';

const FormItem = Form.Item;
class Labels extends Component {

    constructor(props) {
        super(props);
        this.state = {visible:false};
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.getLabelInfo();
    }

    componentWillReceiveProps(nextProps) {
        const {pending,editLabel} = nextProps;

        if (!pending && editLabel&&this.props.editLabel!=editLabel) {
            message.success('删除成功');
            this.props.actions.getLabelInfo();
        }
    }


    editLabel(type,selectedRow){
        this.context.router.push({
            pathname: '/labelEdit',
            state: {editType:type,selectedRow}
        });
    }

    delLabel(record){
        this.setState({
            visible: true,
            delRow:record,
        });
    }

    handleOk() {
        const {actions, loginInfo, form} = this.props;
        form.validateFields(['reason'], (errors, values) => {
            if (!!errors) {
                return;
            } else {
                actions.delLabel(this.state.delRow.id,loginInfo.userId,form.getFieldsValue());
                this.setState({
                    visible: false,
                });
                form.resetFields();
            }
        })
    }

    cancel(e) {
        this.setState({
            visible: false,
        });
    }

    render() {

        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        const { getFieldDecorator } = this.props.form;

            return (
                <Box title="Label列表">
                    <Button type="primary" onClick={this.editLabel.bind(this, 'add', null)}>新增</Button>
                    <Table columns={this.columns(this)} dataSource={this.props.label}
                           //bordered
                           size="middle"
                           pagination={pagination}
                           loading={this.props.loading}
                    />

                    <Modal title="您是否确定要删除此标签?" visible={this.state.visible}
                           confirmLoading={this.props.pending}
                           onOk={this.handleOk.bind(this)} onCancel={this.cancel.bind(this)}
                    >
                        <p>如确定，请输入原因：</p>
                        <FormItem>
                            {getFieldDecorator('reason',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="reason" rows="5"  />)}
                        </FormItem>
                    </Modal>

                </Box>
            );
    }
}

Labels.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

Labels.prototype.columns = (self)=>[{
    title: '标题',
    dataIndex: 'title',
},{
    title: '描述',
    dataIndex: 'description',
},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => (
        <span>
            <a onClick={self.editLabel.bind(self,'modify',record)}>修改</a>
            <span className="ant-divider" />
            <a onClick={self.delLabel.bind(self,record)}>删除</a>
        </span>
    )
}];

Labels = Form.create()(Labels);

function mapStateToProps(state) {
    return {
        loading:state.label.fetchLabelPending,
        label: state.label.labelInfo,
        pending:state.label.pending,
        editLabel:state.label.editLabel,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(label,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Labels);