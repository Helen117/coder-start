/**
 * Created by zhaojp on 2016/10/24.
 */
/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import { Transfer, Button } from 'antd';

export default class TransferFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            mockData: [],
            targetKeys: []
        }
    }

    componentDidMount() {
        this.getMock();
    }

    getMock() {
        const targetKeys = [];
        const mockData = [];
        const dataSource = this.props.dataSource;
        if(dataSource){
            for(let i=0; i<dataSource.length; i++){
                const data = {
                    key: dataSource[i].id,
                    projectName: dataSource[i].name,
                };
                mockData.push(data);
            }
        }

        this.setState({ mockData, targetKeys });

    }

    handleChange(targetKeys) {
        this.setState({ targetKeys });
        const {onChange} = this.props;
        onChange(targetKeys);
    }

    render(){
        return (
            <Transfer
                dataSource={this.state.mockData}
                showSearch
                listStyle={{
                    width: 250,
                    height: 300,
                }}
                operations={['添加', '删除']}
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange.bind(this)}
                render={item => `${item.projectName}`}
            />
        );
    }
}