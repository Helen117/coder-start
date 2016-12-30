/**
 * Created by helen on 2016/12/26.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as reportActions from './report-action';
import Box from '../../components/box';

class reportDataStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
        const { actions } = this.props;
        actions.fetchReportData();
    }

    componentWillReceiveProps(nextProps) {

    }

    getOption() {
        const option = {
            // title: {
            //     text: '待办事项'
            // },
            tooltip : {
                trigger: 'axis'
            },
            legend:{
                data:['超时待办事项','未超时待办事项','总待办事项'],
                x:"center",
                y:0
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
                left: '20%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    // data :this.props.reportData?this.props.reportData.map(data => data.name):['孙磊','毕佩珊','赵婧萍','张亚军','刘仁权','钟天生','徐卫忠']
                    data :['孙磊','毕佩珊','赵婧萍','张亚军','刘仁权','钟天生','徐卫忠']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {name:'超时待办事项',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#c12e34'}},
                    data:[0, 1, 3, 2, 0, 3, 1]
                },
                {
                    name:'未超时待办事项',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#0098d9'}},
                    // data:this.props.reportData?this.props.reportData.map(data => data.value):[2, 3, 3, 5, 0, 4, 1]
                    data:[2, 3, 3, 5, 0, 4, 1]
                },
                {
                    name:'总待办事项',
                    symbolSize:10,
                    type:'line',
                    itemStyle: {normal: {color:'#2b821d'}},
                    data:[2,4,6,7,0,7,2]
                }
            ]
        };
        return option;
    }

    render() {
        return(
            <Box title="当前待办事项统计">
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

export default connect(mapStateToProps,mapDispatchToProps)(reportDataStatistics);