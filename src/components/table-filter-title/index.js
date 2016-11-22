/**
 * Created by Administrator on 2016-11-14.
 */
import React, {PropTypes} from 'react';
import {Icon,Dropdown,Menu,Form,Input,Row,Col} from 'antd';
import 'pubsub-js';
import styles from './index.css';
import {findFilterIndex} from './util';

const FormItem = Form.Item;

class TableFilterTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            isFiled:false,
            filterKeys:[]
        }
    }

    filterData(dataSource,filterKey,formData){
        let newData=[];
        for(let i=0; i<dataSource.length; i++){
            if(dataSource[i][filterKey].indexOf(formData.searchContext) >=0 ){
                newData.push(dataSource[i]);
            }
        }
        return newData;
    }

    handleSubmit(e){
        const {comfirmFilter,form,filterKey,currentData} = this.props;
        const formData = form.getFieldsValue();
        if(formData.searchContext){
            this.state.filterKeys.push({filterKey:filterKey,formData:formData});
            let newData = this.filterData(currentData,filterKey,formData);
            this.setState({
                visible:false,
                ifFiled:!formData.searchContext?false:true
            })
            if(comfirmFilter){
                comfirmFilter(newData,this.state.filterKeys);
            }
        }else {
            this.setState({
                visible:false
            })
        }
    }

    handleReset(){
        const {form,cancleFilter,filterKey,dataSource,filterKeys} = this.props;
        form.resetFields();
        let index = findFilterIndex(filterKeys,filterKey);
        filterKeys.splice(index,1);
        let newdata = dataSource;
        for(let i=0; i<filterKeys.length; i++){
            newdata = this.filterData(newdata,filterKeys[i].filterKey,filterKeys[i].formData);
        }
        this.setState({
            visible:false,
            ifFiled:false
        })
        if(cancleFilter){
            cancleFilter(newdata,filterKeys)
        }
    }

    clickFilterImg(e){
        this.setState({
            visible:true
        })
    }

    render(){
        const { getFieldDecorator,getFieldsValue } = this.props.form;
        const menu = (
            <Menu style={{width:"110px"}}>
                <Menu.Item key="0">
                    {getFieldDecorator('searchContext')(
                        <Input size="small" />
                    )}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <Row>
                        <Col span={12}>
                            <a  onClick={this.handleSubmit.bind(this)}>确定</a>
                        </Col>
                        <Col span={12}>
                            <a onClick={this.handleReset.bind(this)}>取消</a>
                        </Col>
                    </Row>
                </Menu.Item>
            </Menu>
        );

        return(
            <div >
                <span >
                    {this.props.title}
                    <Dropdown trigger={['click']} overlay={menu}
                              visible={this.state.visible}>
                        <Icon type="filter"
                              style={this.state.ifFiled?{color:'#2db7f5'}:{color:'#aaaaaa'}}
                              onClick={this.clickFilterImg.bind(this)}/>
                    </Dropdown>
                </span>
            </div>
        )
    }
}

export default TableFilterTitle = Form.create()(TableFilterTitle);