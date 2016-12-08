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
        let newData=[];
        for(let i=0; i<dataSource.length; i++){
            if(dataSource[i][filterKey].indexOf(formData) >=0 ){
                newData.push(dataSource[i]);
            }
        }
        return newData;
    }

    clickFilterImg(e){
        this.setState({
            visible:!this.state.visible
        })
    }

    searchData(e){
        const {filterChange,filterKey,currentData,dataSource,filterKeys} = this.props;
        let isFiled;
        let newdata = dataSource;
        if(e.target.value){
            let countKey = 0;
            for(let i=0; i<this.state.filterKeys.length; i++){
                if(filterKey == this.state.filterKeys[i].filterKey){
                    countKey++;
                    this.state.filterKeys[i].formData = e.target.value;
                }
            }
            if(countKey == 0){
                this.state.filterKeys.push({filterKey:filterKey,formData:e.target.value});
            }
            for(let i=0; i< this.state.filterKeys.length; i++){
                newdata = this.filterData(newdata,this.state.filterKeys[i].filterKey,this.state.filterKeys[i].formData);
            }
            this.setState({
                isFiled:true,
                //visible:!this.state.visible
            })
            isFiled = true;
            if(filterChange){
                filterChange(newdata,this.state.filterKeys,isFiled);
            }
        }else {
            let index = findFilterIndex(filterKeys,filterKey);
            filterKeys.splice(index,1);
            for(let i=0; i<filterKeys.length; i++){
                newdata = this.filterData(newdata,filterKeys[i].filterKey,filterKeys[i].formData);
            }
            this.setState({
                isFiled:false,
                //visible:!this.state.visible
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