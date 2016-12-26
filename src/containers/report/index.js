/**
 * Created by helen on 2016/12/26.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ToDoListStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getOption() {
        const option = {
            title: {
                text: '待办事项'
            },
            tooltip : {
                trigger: 'axis'
            },
            // legend: {
            //     data:['邮件营销','联盟广告','视频广告']
            // },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['孙磊','毕佩珊','赵婧萍','张亚军','刘仁权','钟天生','徐卫忠']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'待办事项',
                    type:'line',
                    data:[2, 3, 3, 5, 0, 4, 1]
                }
            ]
        };
        return option;
    }

    render() {
        return(
            <ReactEcharts
                option={this.getOption()}
                style={{height: '350px', width: '100%'}}
                className='react_for_echarts'
            />
        );

    }
}