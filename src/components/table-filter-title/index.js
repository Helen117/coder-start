/**
 * Created by Administrator on 2016-11-14.
 */
import React, {PropTypes} from 'react';
import {Icon,Dropdown,Menu,Form,Input} from 'antd';
import 'pubsub-js';
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

    componentWillReceiveProps(nextProps){
        const {dataSource} = nextProps;
        const {form} = this.props;
        if(dataSource != this.props.dataSource && dataSource){
            form.resetFields();
            this.setState({
                isFiled:false,
            })
        }
    }

    filterData(dataSource,filterKey,formData){
        const newData=[];
        for(let i=0; i<dataSource.length; i++){
            if(dataSource[i][filterKey].indexOf(formData) >=0 ){
                newData.push(dataSource[i]);
            }
        }
        return newData;
    }

    clickFilterImg(){
        this.setState({
            visible:!this.state.visible
        })
    }

    setStateFilterKeys(filterKey,formData){
        let countKey_1 = 0;
        for(let i=0; i<this.state.filterKeys.length; i++){
            if(filterKey == this.state.filterKeys[i].filterKey){
                countKey_1++;
                this.state.filterKeys[i].formData = formData;
            }
        }
        if(countKey_1 == 0){
            this.state.filterKeys.push({filterKey:filterKey,formData:formData});
        }
    }

    setFilterKeys(filterKeys){
        let countKey = 0;
        for(let i=0; i<filterKeys.length; i++){
            if(this.state.filterKeys[0].filterKey == filterKeys[i].filterKey){
                countKey++;
                filterKeys[i].formData = this.state.filterKeys[0].formData;
            }
        }
        if(countKey == 0){
            filterKeys.push(this.state.filterKeys[0]);
        }
        return filterKeys;
    }

    searchData(e){
        const {filterChange,filterKey,dataSource} = this.props;
        const filterKeys = this.props.filterKeys;
        let isFiled;
        let newdata = dataSource;
        if(e.target.value){
            this.setStateFilterKeys(filterKey,e.target.value)
            const filterKeys_temp = this.setFilterKeys(filterKeys);
            for(let i=0; i< filterKeys_temp.length; i++){
                newdata = this.filterData(newdata,filterKeys_temp[i].filterKey,filterKeys_temp[i].formData);
            }
            this.setState({
                isFiled:true,
            })
            isFiled = true;
            if(filterChange){
                filterChange(newdata,this.state.filterKeys,isFiled);
            }
        }else {
            const index = findFilterIndex(filterKeys,filterKey);
            filterKeys.splice(index,1);
            for(let i=0; i<filterKeys.length; i++){
                newdata = this.filterData(newdata,filterKeys[i].filterKey,filterKeys[i].formData);
            }
            this.setState({
                isFiled:false,
            })
            isFiled = false;
            if(filterChange){
                filterChange(newdata,filterKeys,isFiled)
            }
        }
    }

    onBlur(){
        this.setState({
            //isFiled:false,
            visible:!this.state.visible
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const menu = (
            <Menu style={{width:"110px"}}>
                <Menu.Item key="0">
                    {getFieldDecorator('searchContext')(
                        <Input size="small" onBlur={this.onBlur.bind(this)}
                            onChange={this.searchData.bind(this)}/>
                    )}
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
                              style={this.state.isFiled?{color:'#2db7f5'}:{color:'#aaaaaa'}}
                              onClick={this.clickFilterImg.bind(this)}/>
                    </Dropdown>
                </span>
            </div>
        )
    }
}

export default TableFilterTitle = Form.create()(TableFilterTitle);