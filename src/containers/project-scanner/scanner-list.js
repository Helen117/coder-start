/**
 * Created by Administrator on 2017/2/28.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table,Icon,Alert,Row} from 'antd';
import {getScannerList,getProjectsKeys} from './actions/project-scanner-actions';
import styles from './index.css';
import BackgroundCircle from '../../components/backgroung-circle';

class ScannerList extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }

    getProjectsIdName(projectGroup,branch){
        const groupInfo = projectGroup.getGroupInfo?(
            projectGroup.getGroupInfo.groupInfo?projectGroup.getGroupInfo.groupInfo:''):'';
        let projectsIdName = [];
        if(groupInfo.children){
            for(let i=0; i<groupInfo.children.length; i++){
                let project = groupInfo.children[i];
                projectsIdName[i] = project.name+'-'+project.id.substring(0,project.id.length-2)+'_'+branch;
            }
        }

        return projectsIdName;
    }

    componentWillMount(){
        //获取已扫描项目的key
        const {projectGroup,branch} = this.props;
        let projectsIdName = this.getProjectsIdName(projectGroup,branch);
        this.props.getProjectsKeys(projectsIdName);
    }

    componentWillReceiveProps(nextProps){
        const {projectGroup} = nextProps;
        const this_node = this.props.node;
        const next_node = nextProps.node;
        const this_branch = this.props.branch;
        const next_branch = nextProps.branch;
        //获取已扫描项目的key
        if((this_node.id != next_node.id && next_node.id) || (this_branch != next_branch && next_branch)){
            let projectsIdName = this.getProjectsIdName(projectGroup,next_branch);
            this.props.getProjectsKeys(projectsIdName);
        }
        //调scannerList接口
        const this_scannerKeysInfo = this.props.scannerKeysInfo;
        const next_scannerKeysInfo = nextProps.scannerKeysInfo;
        const this_projectsKeys = this_scannerKeysInfo?(this_scannerKeysInfo.result?this_scannerKeysInfo.result:""):"";
        const next_projectsKeys = next_scannerKeysInfo?(next_scannerKeysInfo.result?next_scannerKeysInfo.result:""):"";
        if(next_projectsKeys && !next_projectsKeys==this_projectsKeys){
            let metricKeys = 'alert_status,reliability_rating,security_rating,sqale_rating,duplicated_lines_density,coverage,ncloc,ncloc_language_distribution';
            this.props.getScannerList(next_projectsKeys,metricKeys);
        }
    }

    findKeys(measures){
        let keys = [],dataKeys = [];
        for(let i=0;i<measures.length;i++){
            if(i==0){
                keys[0]=measures[i].component;
                continue;
            }
            let count = 0;
            for(let j=0;j<keys.length;j++){
                if(measures[i].component == keys[j]){
                    break;
                }else{
                    count++;
                }
            }
            if(count == keys.length){
                keys[keys.length] = measures[i].component;
            }
        }
        for(let i=0;i<keys.length;i++){
            let keyObject = {};
            keyObject.component = keys[i];
            dataKeys[i] = keyObject;
        }
        return dataKeys;
    }

    getMeasuresData(keys,measures) {
        let keyMeasures = keys;
        for (let i = 0; i < keyMeasures.length; i++) {
            for (let j = 0; j < measures.length; j++) {
                if (keyMeasures[i].component == measures[j].component) {
                    if (measures[j].metric == 'reliability_rating') {
                        keyMeasures[i].reliability = measures[j].value;
                    }
                    if (measures[j].metric == 'security_rating') {
                        keyMeasures[i].safety = measures[j].value;
                    }
                    if (measures[j].metric == 'sqale_rating') {
                        keyMeasures[i].maintainability = measures[j].value;
                    }
                    if (measures[j].metric == 'ncloc') {
                        keyMeasures[i].codeNum = measures[j].value;
                    }
                    if (measures[j].metric == 'duplicated_lines_density') {
                        keyMeasures[i].repetition = measures[j].value + "%";
                    }
                    if (measures[j].metric == 'coverage') {
                        keyMeasures[i].coverage = measures[j].value;
                    }
                }
            }
        }
        return keyMeasures;
    }


    getDataSource(){
        const {scannerListInfo} = this.props;
        const dataSource = [];
        if(scannerListInfo && scannerListInfo.result){
            let measures = scannerListInfo.result.measures;
            let keys = this.findKeys(measures);
            let keyMeasures = this.getMeasuresData(keys,measures);
            for(let i=0;i<keyMeasures.length;i++){
                dataSource.push({
                    key:i+1,
                    projectName:keyMeasures[i].component,
                    reliability:keyMeasures[i].reliability,
                    safety:keyMeasures[i].safety,
                    maintainability:keyMeasures[i].maintainability,
                    coverage:keyMeasures[i].coverage,
                    repetition:keyMeasures[i].repetition,
                    codeNum:keyMeasures[i].codeNum
                })
            }
        }
        return dataSource;
    }

    render(){
        const {scannerKeysInfo,scannerListInfo} = this.props;
        const data = this.getDataSource();
        const projectsKeys = scannerKeysInfo?(scannerKeysInfo.result?scannerKeysInfo.result:""):"";
        const loading = scannerListInfo?scannerListInfo.loading:false;

        return(
            <div>
                {projectsKeys?(
                    <Table columns={this.groupColumns(this)}
                           dataSource={data}
                           bordered
                           style={{paddingTop:'10px'}}
                           loading={loading}
                    ></Table>
                ):<Alert
                    message={
                        <Row>
                            <span>该项目组或分支下没有已扫描项目！</span>
                        </Row>
                    }
                    description=""
                    type="info"
                    showIcon/>}
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
        scannerListInfo:state.projectScanner.scannerListInfo,
        projectGroup:state.projectGroup,
        scannerKeysInfo:state.projectScanner.scannerKeysInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getScannerList:bindActionCreators(getScannerList, dispatch),
        getProjectsKeys:bindActionCreators(getProjectsKeys, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannerList);