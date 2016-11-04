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
                    projectName: dataSource[i].name,
                };
                mockData.push(data);
            }
            if(targetData){
                for(let i=0; i<targetData.length; i++){
                    const data = {
                        key: targetData[i].id.substring(0,targetData[i].id.length-2),
                        projectName: targetData[i].name,
                    };
                    mockData.push(data);
                }
            }
        }
        //console.log(mockData);
        this.mockData = mockData
    }

    handleChange(targetKeys) {
        this.targetKeys = targetKeys;
        this.setState({ targetKeys });
        //console.log('this.state.targetKeys',this.state.targetKeys);
        //console.log('this.targetKeys',this.targetKeys);
        const {onChange} = this.props;
        this.isChange = true;
        onChange(targetKeys);
    }


    render(){
        //console.log('调用render');
        this.getMock();
        this.targetKeys = this.getTarget();
        const targetKeys = (!this.isChange && this.state.targetKeys.length==0)?this.targetKeys:this.state.targetKeys;
        //console.log('targetKeys',targetKeys);
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
                    targetKeys={targetKeys}
                    onChange={this.handleChange.bind(this)}
                    notFoundContent={this.props.fetchProMsgErr?<div>数据加载失败</div>:<div>没有数据</div>}
                    render={item => `${item.projectName}`}
                />
            </Spin>
        );
    }
}