/**
 * Created by helen on 2016/12/30.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as reportActions from './report-action';
import Box from '../../components/box';

class manageViewDemandRank extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
        // const { actions } = this.props;
        // actions.fetchReportData();
    }

    componentWillReceiveProps(nextProps) {

    }

    getOption() {
        const option = {
            title: {
                text: '缺陷数'
            },
            tooltip : {
                trigger: 'axis'
            },
            toolbox: {
                orient:"vertical",
                y:'center',
                itemGap:15,
                x:'right',
                show : true,
                feature : {
                    saveAsImage: {},
                    dataView : {show: true, readOnly: false}
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    // data :this.props.reportData?this.props.reportData.map(data => data.name):['孙磊','毕佩珊','赵婧萍','张亚军','刘仁权','钟天生','徐卫忠']
                    data :['工单1','工单2','工单3','工单4','工单4','工单6','工单7']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'缺陷数',
                    symbolSize:10,
                    type:'line',
                    itemStyle: {normal: {color:'#0098d9'}},
                    data:[7,6,5,4,3,2,1]
                }
            ]
        };
        return option;
    }

    render() {
        return(
            <Box title="一个里程碑中产生缺陷(上线前)最多的工单统计排名">
                <ReactEcharts
                    option={this.getOption()}
                    style={{height: '350px', width: '80%'}}
                    theme="my_theme"
                />
            </Box>
        );

    }
}

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        reportData:state.report.reportData,
        loading:state.report.getReportDataPending,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(manageViewDemandRank);