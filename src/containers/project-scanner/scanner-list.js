/**
 * Created by Administrator on 2017/2/28.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table,Icon} from 'antd';
import {getScannerList} from './actions/project-scanner-actions';
import styles from './index.css';
import BackgroundCircle from '../../components/backgroung-circle';

class ScannerList extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        //调scannerList接口
        const {scannerList} = this.props;
        /*if(!scannerList){
            this.props.getScannerList();
        }*/
    }

    componentWillReceiveProps(nextProps){
        //调scannerList接口
        const this_node = this.props.node;
        const next_node = nextProps.node;
        /*if(this_node.id != next_node.id && next_node.id){
            this.props.getScannerList();
        }*/
    }

    getDataSource(){
        const {scannerList} = this.props;
        const dataSource_bak = [];
        if(scannerList){
            for(let i=0; i<scannerList.length; i++){
                dataSource_bak.push({
                    key:i+1,
                    projectName:"devops-scm",
                    reliability:"E",
                    safety:"B",
                    maintainability:"A",
                    coverage:"--",
                    repetition:"4%",
                    codeNum:"18k"
                })
            }
        }

        const dataSource = [
            {
                key:1,
                projectName:"devops-scm",
                reliability:"5",
                safety:"2",
                maintainability:"1",
                coverage:"--",
                repetition:"4%",
                codeNum:"18k"
            }
        ];
        return dataSource;
    }

    render(){
        const {node} = this.props;

        const data = this.getDataSource();

        return(
            <div>
                <Table columns={this.groupColumns(this)}
                       dataSource={data}
                       bordered
                       style={{paddingTop:'10px'}}
                ></Table>
            </div>
        )
    }
}

ScannerList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ScannerList.prototype.groupColumns = (self)=>[
    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
    {title: "可靠性", dataIndex: "reliability", key: "reliability",
        render(text,record){
            //根据返回值1、2、3、4、5这些等级，给text附不同的颜色。
            return(
            <BackgroundCircle alert_value={text}/>
            )
        }
    },
    {title: "安全性", dataIndex: "safety", key: "safety",
        render(text,record){
            //根据返回值1、2、3、4、5这些等级，给text附不同的颜色。
            return(
                <BackgroundCircle alert_value={text}/>
            )
        }
    },
    {title: "可维护性", dataIndex: "maintainability", key: "maintainability",
        render(text,record){
            //根据返回值1、2、3、4、5这些等级，给text附不同的颜色。
            return(
                <BackgroundCircle alert_value={text}/>
            )
        }
    },
    {title: "覆盖率", dataIndex: "coverage", key: "coverage"},
    {title: "重复率", dataIndex: "repetition", key: "repetition"},
    {title: "代码行", dataIndex: "codeNum", key: "codeNum"},
];

function mapStateToProps(state) {
    return {
        //scannerList:state.projectScanner.scannerListInfo.result,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getScannerList:bindActionCreators(getScannerList, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannerList);