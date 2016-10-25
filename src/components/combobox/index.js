/**
 * Created by helen on 2016/10/24.
 */
import React, {PropTypes,Component} from 'react';
import { Select } from 'antd';

export default class Combobox extends React.Component{
    constructor (props) {
        super(props);
    }

    render(){
        const {option} = this.props;
        return (
            <Select combobox
                    placeholder="请选择人员"
                    optionFilterProp="children"
                    notFoundContent="无法找到"
                    defaultActiveFirstOption={false}
            >
                {option}
            </Select>
        );
    }

}