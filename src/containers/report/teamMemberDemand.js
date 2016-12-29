/**
 * Created by helen on 2016/12/29.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as reportActions from './report-action';
import Box from '../../components/box';

class TeamMemberDemandProportion extends Component {
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
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend:{
                orient:"vertical",
                y:"center",
                right:'right',
                data:['成员1','成员2','成员3','成员4','成员5'],
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
            series : [
                {
                    name: '需求数量',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:3, name:'成员1'},
                        {value:5, name:'成员2'},
                        {value:6, name:'成员3'},
                        {value:2, name:'成员4'},
                        {value:1, name:'成员5'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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

export default connect(mapStateToProps,mapDispatchToProps)(TeamMemberDemandProportion);