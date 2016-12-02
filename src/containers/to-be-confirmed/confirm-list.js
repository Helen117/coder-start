/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,notification} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import {getConfirmList} from './actions/confirm-list-action';
import DevelopTransPond from './transpond';
import DevelopConfirm from './confirm';


class ConfirmList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showTranspod:false,
            showConfirm:true
        };
    }

    componentWillMount() {
        //this.props.getConfirmListAction(this.props.loginInfo.userId);
    }

    componentWillReceiveProps(nextProps) {

    }

    accept(record){
        this.setState({
            showTranspod:false,
            showConfirm:true
        })
    }


    transpond(record){
        this.setState({
            showTranspod:true,
            showConfirm:false
        })
    }

    handleOk(){

    }

    handleCancel(){

    }

    getDataSource(confirmList){
        const data = [];
        if(confirmList){
            for(let i=0; i<confirmList.length; i++){
                data.push({
                    name: confirmList[i].name
                })
            }
        }
        return data;
    }

    render() {
        //console.log('this.state.showTranspod',this.state.showTranspod,this.state.showConfirm)
        const confirmList = this.props.confirmList;
        const loading = this.props.loading?this.props.loading:false;
        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        const data = [{
            "name":"项目优化",
            "type":"需求",
            "author":"孙磊",
            "due_date": "2016/11/29",
            "created_at":"2016/11/23",
            "files":'qwe'
        }];

        return(
            <Box title="待确认事项列表">
                <Table columns={this.columns(this)} dataSource={data}
                       bordered
                       size="middle"
                       pagination={pagination}
                       loading={this.props.loading}
                />
                <DevelopTransPond showTranspod={this.state.showTranspod} />
                <DevelopConfirm showConfirm={this.state.showConfirm}/>
            </Box>
        );
    }
}

ConfirmList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


ConfirmList.prototype.columns = (self)=>[{
    title: '工单名称',
    dataIndex: 'name',
},{
    title: '描述',
    dataIndex: 'description',

},{
    title: '文件',
    dataIndex: 'files',
},{
    title: '类型',
    dataIndex: 'type',
    width: '10%'
},{
    title: '创建人',
    dataIndex: 'author',
    width: '10%'
}, {
    title: '创建时间',
    dataIndex: 'created_at',
    width: '10%'

},{
    title: '计划完成时间',
    dataIndex: 'due_date',
    width: '10%'

},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => (
        <span>
            <a onClick={self.accept.bind(self,record)}>确认</a>
            <span className="ant-divider" />
            <a onClick={self.transpond.bind(self,record)}>转派</a>
        </span>

    )
}];

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        loading: state.getConfirmList.loading,
        confirmList: state.getConfirmList.item,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getConfirmListAction: bindActionCreators(getConfirmList, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmList);