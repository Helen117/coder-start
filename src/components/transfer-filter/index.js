/**
 * Created by zhaojp on 2016/10/24.
 */
/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import { Transfer, Button,Spin } from 'antd';

export default class TransferFilter extends React.Component {
    constructor(props) {
        super(props);
        this.mockData = [];
        this.state ={
            targetKeys: [],
        }
        this.targetKeys=[];
        this.isChange = false;

    }
    componentDidMount() {
        const targetKeys = this.getTarget();
        this.setState({ targetKeys });
    }


    getTarget(){
        const targetKeys = [];
        const targetData = this.props.targetKeys;
        if(targetData){
            for(let i=0; i<targetData.length; i++){
                targetKeys.push(targetData[i].id.substring(0,targetData[i].id.length-2),);
            }
        }
        return targetKeys;
    }

    getMock() {
        const mockData = [];
        const dataSource = this.props.dataSource;
        const targetData = this.props.targetKeys;
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
                }
            }
        }
        this.mockData = mockData
    }

    handleChange(targetKeys) {
        this.targetKeys = targetKeys;
        this.setState({ targetKeys });
        const {onChange} = this.props;
        this.isChange = true;
        onChange(targetKeys);
    }

    renderFooter() {
        return (
            <Button type="ghost" size="small" style={{ float: 'right', margin: 5 }}
                    onClick={this.getMock}
            >
                重置
            </Button>
        );
    }


    render(){
        this.getMock();
        this.targetKeys = this.getTarget();
        const targetKeys = (!this.isChange && this.state.targetKeys.length==0)?this.targetKeys:this.state.targetKeys;
        return (
            <Spin spinning={this.props.loadingProMsg}>
                <Transfer
                    dataSource={this.mockData}
                    targetKeys={targetKeys}
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