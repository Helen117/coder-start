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
        // actions.getLabelInfo(selectedProjectSet.id);
    }

    componentWillReceiveProps(nextProps) {

    }


    editLabel(type,selectedRow){
        this.context.router.push({
            pathname: '/labelEdit',
            state: {editType:type,selectedRow}
        });
    }

    delLabel(record){
        console.log(record);
        var label = record;
        this.setState({
            visible: true,
            delRow:label,
        });
    }

    handleOk() {
        const {actions, loginInfo, form} = this.props;
        form.validateFields(['reason'], (errors, values) => {
            if (!!errors) {
                return;
            } else {
                this.setState({
                    visible: false,
                });
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

        const data = [{
            "title":"H5",
            "description":"界面优化",
            "mr":"1",
            "issues":"2"
        }];

            return (
                <Box title="Label列表">
                    <Button type="primary" onClick={this.editLabel.bind(this, 'add', null)}>新增</Button>
                    <Table columns={this.columns(this)} dataSource={data}
                           bordered
                           size="middle"
                           pagination={pagination}
                        //loading={this.props.loading}
                    />

                    <Modal title="您是否确定要删除此标签?" visible={this.state.visible}
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
}, {
    title: 'merge request',
    dataIndex: 'mr',
},{
    title: '问题',
    dataIndex: 'issues',
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
        loading:state.request.loading,
        requirementInfo: state.request.requirementInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(label,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Labels);