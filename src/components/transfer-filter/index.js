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
            targetKeys: []
        }
    }

    getMock() {
        const mockData = [];
        const dataSource = this.props.dataSource;
       /* console.log('dataSource',dataSource);*/
        if(dataSource){
            for(let i=0; i<dataSource.length; i++){
                const data = {
                    key: dataSource[i].id,
                    projectName: dataSource[i].name,
                };
                mockData.push(data);
            }
        }
        this.mockData = mockData
    }

    handleChange(targetKeys) {
        this.setState({ targetKeys });
        const {onChange} = this.props;
        onChange(targetKeys);
    }

    render(){
        this.getMock();
        return (
            <Spin spinning={this.props.loadingProMsg}>
                <Transfer
                    dataSource={this.mockData}
                    showSearch
                    listStyle={{
                        width: 250,
                        height: 300,
                    }}
                    operations={['添加', '删除']}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange.bind(this)}
                    notFoundContent={this.props.fetchProMsgErr?<div>数据加载失败</div>:<div>没有数据</div>}
                    render={item => `${item.projectName}`}
                />
            </Spin>
        );
    }
}