/**
 * Created by helen on 2016/12/29.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as reportActions from './report-action';
import Box from '../../components/box';

class BusinessDemandStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
        const { actions } = this.props;
        actions.fetchToDoList();
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
                orient:"vertical",
                y:"center",
                right:'right',
                data:['需求数量','超时数量','缺陷数量','缺陷超时数量'],
            },
            // toolbox: {
            //     orient:"vertical",
            //     y:'center',
            //     itemGap:15,
            //     x:'right',
            //     show : true,
            //     feature : {
            //         saveAsImage: {},
            //         dataView : {show: true, readOnly: false}
            //     }
            // },
            grid: {
                left: '20%',
                right: '15%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    // data :this.props.toDoList?this.props.toDoList.map(data => data.name):['孙磊','毕佩珊','赵婧萍','张亚军','刘仁权','钟天生','徐卫忠']
                    data :['范畴1','范畴2','范畴3','范畴4','范畴5','范畴6','范畴7']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {name:'需求数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#0098d9'}},
                    data:[0, 1, 3, 2, 0, 3, 1]
                },
                {
                    name:'超时数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#c12e34'}},
                    // data:this.props.toDoList?this.props.toDoList.map(data => data.value):[2, 3, 3, 5, 0, 4, 1]
                    data:[2, 3, 3, 5, 0, 4, 1]
                },
                {
                    name:'缺陷数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#B2B6B7'}},
                    // data:this.props.toDoList?this.props.toDoList.map(data => data.value):[2, 3, 3, 5, 0, 4, 1]
                    data:[2, 3, 3, 5, 0, 4, 1]
                },
                {
                    name:'缺陷超时数量',
                    symbolSize:10,
                    type:'bar',
                    itemStyle: {normal: {color:'#F5F629'}},
                    data:[2,4,6,7,0,7,2]
                }
            ]
        };
        return option;
    }

    render() {
        return(
            <Box title="从业务范畴视角查看一个里程碑中的需求执行情况">
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
        toDoList:state.report.toDoList,
        loading:state.report.getToDoListPending,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BusinessDemandStatistics);