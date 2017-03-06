/**
 * Created by Administrator on 2017/2/28.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table,Icon} from 'antd';
import {getScannerItem} from './actions/project-scanner-actions';
import styles from './index.css';
import BackgroundCircle from '../../components/backgroung-circle';

class ScannerItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        //调scannerItem接口
        const {node,branch} = this.props;
    /*传递参数：
    * 1、componentKey：node.node+'-'+node.id+'_dev'
        * 2、additionalFields：metrics,periods
        * 3、metricKeys：alert_status,quality_gate_details,bugs,new_bugs,reliability_rating,vulnerabilities,new_vulnerabilities,security_rating,code_smells,new_code_smells,sqale_rating,sqale_index,new_technical_debt,coverage,new_coverage,new_lines_to_cover,tests,duplicated_lines_density,new_duplicated_lines_density,duplicated_blocks,ncloc,ncloc_language_distribution,new_lines*/
        const componentKey = node.name+'-'+node.id.substring(0,node.id.length-2)+'_'+branch;
        const metricKeys = "alert_status,quality_gate_details,bugs,new_bugs,reliability_rating,vulnerabilities,new_vulnerabilities,security_rating,code_smells,new_code_smells,sqale_rating,sqale_index,new_technical_debt,coverage,new_coverage,new_lines_to_cover,tests,duplicated_lines_density,new_duplicated_lines_density,duplicated_blocks,ncloc,ncloc_language_distribution,new_lines";
        this.props.getScannerItem(componentKey,metricKeys);
    }

    componentWillReceiveProps(nextProps){
        //调scannerItem接口
        const this_node = this.props.node;
        const next_node = nextProps.node;
        const this_branch = this.props.branch;
        const next_branch = nextProps.branch;
        if((this_node.id != next_node.id && next_node.id) || (this_branch != next_branch && next_branch)){
            /*传递参数：
             * 1、componentKey：next_node.node+'-'+next_node.id+'_dev'
             * 2、additionalFields：metrics,periods
             * 3、metricKeys：alert_status,quality_gate_details,bugs,new_bugs,reliability_rating,vulnerabilities,new_vulnerabilities,security_rating,code_smells,new_code_smells,sqale_rating,sqale_index,new_technical_debt,coverage,new_coverage,new_lines_to_cover,tests,duplicated_lines_density,new_duplicated_lines_density,duplicated_blocks,ncloc,ncloc_language_distribution,new_lines*/
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
        const {node} = this.props;

        const data = this.getDataSource();

        return(
            <div>
                <Table columns={this.groupColumns(this)}
                       dataSource={data}
                       bordered
                       style={{paddingTop:'10px'}}
                       pagination={false}
                ></Table>
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getScannerItem:bindActionCreators(getScannerItem, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannerItem);