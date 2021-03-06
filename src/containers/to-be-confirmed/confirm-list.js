/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Table} from 'antd';
import Box from '../../components/box'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getConfirmList,getDemandList} from './action';
import DevelopTransPond from './transpond';
import DevelopConfirm from './confirm';
import api from '../../api';

class ConfirmList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showTranspond:false,
            showConfirm:true
        };
    }

    accept(record){
        this.setState({
            showTranspond:false,
            showConfirm:true
        })
    }


    transpond(){
        this.setState({
            showTranspond:true,
            showConfirm:false
        })
    }


    componentWillMount() {
        const {record} = this.props.location.state;
        if(record.task_id){
            this.props.getConfirmListAction(record.task_id);
        }else {
            this.props.getDemandListAction(record.sets_issue_id);
        }
    }

    getDataSource(confirmList){
        if(confirmList){
            for(let i=0; i<confirmList.length; i++){
                confirmList[i].created_at = new Date(confirmList[i].created_at).toLocaleDateString();
                confirmList[i].due_date = new Date(confirmList[i].due_date).toLocaleDateString();
                if (confirmList[i].type == 'demand') {
                    confirmList[i].type = '需求';
                }else if (confirmList[i].type == 'defect') {
                        confirmList[i].type = '缺陷';
                }
            }

        }
        return confirmList;
    }

    render() {
        const {record} = this.props.location.state;
        const confirmList = this.props.confirmList;
        const loading = this.props.getConfirmListLoading?true:false;
        let data = this.getDataSource(confirmList)
        const task_id = record.task_id;
        if(!task_id){
            data = [{
                'name':record.issue_name,
                'description':record.description,
                'type':record.issueType,
                'filesName':this.props.demandInfo?this.props.demandInfo.files:'',
                'author':record.author_name,
                'created_at':record.created_at,
                'due_date':record.due_date
            }];
        }
        return(
            <Box title="待确认事项" >
                <Table columns={this.columns(this)}
                       dataSource={data}
                       bordered
                       size="middle"
                       pagination={false}
                       loading={loading}
                />
                <DevelopTransPond showTranspond={this.state.showTranspond} task_id={task_id}/>
                <DevelopConfirm showConfirm={this.state.showConfirm} task_id={task_id}/>
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
    title: '主题',
    dataIndex: 'name',
},{
    title: '描述',
    dataIndex: 'description',

},{
    title: '文件',
    dataIndex: 'filesName',
    render: (text, record) => {
        var url = api.opts.baseURI+"/attachfile/download?fileName="+text;
        return <div>
            <a href={url}>{text}</a>
        </div>
    }
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
}, {
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => {
        if(self.props.location.state.record.task_id){
            return(
                self.state.showConfirm?<a onClick={self.transpond.bind(self)}>转派</a>
                            :<a onClick={self.accept.bind(self, record)}>确认</a>
            )
        }
    }
}];


function mapStateToProps(state) {
    return {
        getConfirmListLoading: state.toBeConfirmedItem.getConfirmListLoading,
        confirmList: state.toBeConfirmedItem.confirmList,
        demandInfo: state.toBeConfirmedItem.demand,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getConfirmListAction: bindActionCreators(getConfirmList, dispatch),
        getDemandListAction: bindActionCreators(getDemandList, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmList);
