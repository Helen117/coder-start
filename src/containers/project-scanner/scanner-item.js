/**
 * Created by Administrator on 2017/2/28.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table,Icon,Alert,Row} from 'antd';
import {getScannerItem,projectsHasScaned} from './actions/project-scanner-actions';
import styles from './index.css';
import BackgroundCircle from '../../components/backgroung-circle';

class ScannerItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        //检查项目是否被扫描过
        const {node,branch} = this.props;
        const componentKey = node.name+'-'+node.id.substring(0,node.id.length-2)+'_'+branch;
        this.props.projectsHasScaned(componentKey);
        /*const metricKeys = "alert_status,quality_gate_details,bugs,new_bugs,reliability_rating,vulnerabilities,new_vulnerabilities,security_rating,code_smells,new_code_smells,sqale_rating,sqale_index,new_technical_debt,coverage,new_coverage,new_lines_to_cover,tests,duplicated_lines_density,new_duplicated_lines_density,duplicated_blocks,ncloc,ncloc_language_distribution,new_lines";
        this.props.getScannerItem(componentKey,metricKeys);*/
    }

    componentWillReceiveProps(nextProps){
        const this_node = this.props.node;
        const next_node = nextProps.node;
        const this_branch = this.props.branch;
        const next_branch = nextProps.branch;
        //检查该项目是否被扫描过
        if((this_node.id != next_node.id && next_node.id) || (this_branch != next_branch && next_branch)){
            const componentKey = next_node.name+'-'+next_node.id.substring(0,next_node.id.length-2)+'_'+next_branch;
            this.props.projectsHasScaned(componentKey);
        }

        const this_hasScanedInfo = this.props.hasScanedInfo;
        const next_hasScanedInfo = nextProps.hasScanedInfo;
        const this_hasScaned = this_hasScanedInfo?(this_hasScanedInfo.result?this_hasScanedInfo.result:false):false;
        const next_hasScaned = next_hasScanedInfo?(next_hasScanedInfo.result?next_hasScanedInfo.result:false):false;
        //获取扫描结果
        if(next_hasScaned && !next_hasScaned==this_hasScaned){
            const componentKey = next_node.name+'-'+next_node.id.substring(0,next_node.id.length-2)+'_'+next_branch;
            const metricKeys = "alert_status,quality_gate_details,bugs,new_bugs,reliability_rating,vulnerabilities,new_vulnerabilities,security_rating,code_smells,new_code_smells,sqale_rating,sqale_index,new_technical_debt,coverage,new_coverage,new_lines_to_cover,tests,duplicated_lines_density,new_duplicated_lines_density,duplicated_blocks,ncloc,ncloc_language_distribution,new_lines";
            this.props.getScannerItem(componentKey,metricKeys);
        }
    }

    getDataSource(){
        const {scannerItemInfo} = this.props;        

        let dataSource;
        if(scannerItemInfo && scannerItemInfo.result){
            let component = scannerItemInfo.result.component;            
            let measures = component.measures;                  
            let bugs='',reliability='',leak='',safety='',debt='',maintainability='',badSmell='',coverage='',duplicatedBlock='';
            for(let i=0;i<measures.length;i++){               
                if(measures[i].metric == 'bugs'){
                    bugs = measures[i].value;
                }
                if(measures[i].metric == 'reliability_rating'){
                    reliability = measures[i].value;
                }
                if(measures[i].metric == 'vulnerabilities'){
                    leak = measures[i].value;
                }
                if(measures[i].metric == 'security_rating'){
                    safety = measures[i].value;
                }
                if(measures[i].metric == 'sqale_index'){
                    debt = measures[i].value;
                }
                if(measures[i].metric == 'sqale_rating'){
                    maintainability = measures[i].value;
                }
                if(measures[i].metric == 'code_smells'){
                    badSmell = measures[i].value;
                }
                if(measures[i].metric == 'duplicated_lines_density'){
                    coverage = measures[i].value+"%";
                }
                if(measures[i].metric == 'duplicated_blocks'){
                    duplicatedBlock = measures[i].value;
                }
            }            

            dataSource = [
                {
                    key:1,
                    bugs:bugs,
                    reliability:reliability,
                    leak:leak,
                    safety:safety,
                    debt:debt,
                    maintainability:maintainability,
                    badSmell:badSmell,
                    coverage:coverage,
                    duplicatedBlock:duplicatedBlock
                }
            ];
        }
        
        return dataSource;
    }

    render(){
        const {hasScanedInfo,scannerItemInfo} = this.props;
        const hasScaned = hasScanedInfo?(hasScanedInfo.result?hasScanedInfo.result:false):false;
        const data = this.getDataSource();
        const loading = scannerItemInfo?scannerItemInfo.loading:false;

        return(
            <div>
                {hasScaned?(
                    <Table columns={this.groupColumns(this)}
                           dataSource={data}
                           bordered
                           style={{paddingTop:'10px'}}
                           pagination={false}
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

ScannerItem.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ScannerItem.prototype.groupColumns = (self)=>[
    {title: "Bugs", dataIndex: "bugs", key: "bugs",
        render(text,record){
            return(
                <span>{text}</span>
            )
        }
    },
    {title: "可靠性", dataIndex: "reliability", key: "reliability",
        render(text,record){
            //根据返回值1、2、3、4、5这些等级，给text附不同的颜色。
            return(
                <BackgroundCircle alert_value={text}/>
            )
        }
    },
    {title: "漏洞", dataIndex: "leak", key: "leak",
        render(text,record){
            return(
                <span>{text}</span>
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
    {title: "债务", dataIndex: "debt", key: "debt",
        render(text,record){
            return(
                <span>{text}</span>
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
    {title: "坏味道", dataIndex: "badSmell", key: "badSmell"},
    {title: "重复率", dataIndex: "coverage", key: "coverage"},
    {title: "重复块", dataIndex: "duplicatedBlock", key: "duplicatedBlock"},
];

function mapStateToProps(state) {
    return {
        scannerItemInfo:state.projectScanner.scannerItemInfo,
        hasScanedInfo:state.projectScanner.hasScanedInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getScannerItem:bindActionCreators(getScannerItem, dispatch),
        projectsHasScaned:bindActionCreators(projectsHasScaned, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannerItem);