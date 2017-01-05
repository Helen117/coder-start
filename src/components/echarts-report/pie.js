/**
 * Created by helen on 2017/1/3.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';

export default class Pie extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getOption() {

        const option = {
            title: {
                text: this.props.title
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend:{
                orient:"vertical",
                y:"center",
                right:'right',
                data:this.props.legend,
            },
            series : [
                {
                    name: this.props.name,
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:this.props.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }],
        };
        return option;
    }

    render() {
        return(
            <ReactEcharts option={this.getOption()}/>
        );

    }
}
