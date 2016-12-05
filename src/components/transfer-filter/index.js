
/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import { Transfer, Button,Spin } from 'antd';

export default class TransferFilter extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys = [],
        this.state ={
            targetKeys: [],
            mockData: []
        }

    }
    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const dataSource = nextProps.dataSource;
        const targetData = nextProps.targetKeys;
        if(dataSource!=this.props.dataSource ){
            this.getMock(dataSource,targetData);
        }

    }

    getMock(dataSource,targetData) {
        const mockData = [];
        const targetKeys = [];
        if(dataSource){
            for(let i=0; i<dataSource.length; i++){
                const data = {
                    key: dataSource[i].id,
                    name: dataSource[i].name,
                };
                mockData.push(data);
            }
            if(targetData){
                for(let i=0; i<targetData.length; i++){
                    const data = {
                        key: targetData[i].id.substring(0,targetData[i].id.length-2),
                        name: targetData[i].name,
                    };
                    mockData.push(data);
                    targetKeys.push(data.key)
                }
            }
        }
        this.setState({ mockData, targetKeys });
    }

    handleChange(targetKeys) {
        this.setState({ targetKeys });
        this.targetKeys = targetKeys;
        const {onChange} = this.props;
        onChange(this.targetKeys);
    }

    renderFooter() {
        const dataSource = this.props.dataSource;
        const targetData = this.props.targetKeys
        return (
            <Button type="ghost" size="small" style={{ float: 'right', margin: 5 }}
                    onClick={this.getMock.bind(this,dataSource,targetData)}
            >
                重置
            </Button>
        );
    }


    render(){
        return (
            <Spin spinning={this.props.loadingProMsg}>
                <Transfer
                    dataSource={this.state.mockData}
                    targetKeys={this.state.targetKeys}
                    showSearch
                    listStyle={{
                        width: 250,
                        height: 300,
                    }}
                    operations={['添加', '删除']}
                    onChange={this.handleChange.bind(this)}
                    notFoundContent={this.props.fetchProMsgErr?<div>数据加载失败</div>:<div>列表为空</div>}
                    footer={this.renderFooter.bind(this)}
                    render={item => `${item.name}`}
                />
            </Spin>
        );
    }
}