/**
 * Created by Administrator on 2016-11-14.
 */
import React, {PropTypes} from 'react';
import {Icon,Dropdown,Menu,Form,Input,Row,Col} from 'antd';
import 'pubsub-js';
import styles from './index.css';

const FormItem = Form.Item;

class TableFilterTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
        }
    }

    handleSubmit(e){
        const {comfirmFilter,form,filterKey} = this.props;
        const formData = form.getFieldsValue();
        if(comfirmFilter){
            comfirmFilter(formData,filterKey);
        }
        this.setState({
            visible:false
        })
    }

    handleReset(){
        const {form,cancleFilter} = this.props;
        form.resetFields();
        if(cancleFilter){
            cancleFilter()
        }
        this.setState({
            visible:false
        })
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
                            <a onClick={this.handleReset.bind(this)}>重置</a>
                        </Col>
                    </Row>
                </Menu.Item>
            </Menu>
        );

        return(
            <div >
                <span >
                    {this.props.title}
                    {/*<Dropdown trigger={['click']} overlay={menu}
                              visible={this.state.visible}>
                        <Icon type="filter"
                              onClick={this.clickFilterImg.bind(this)}/>
                    </Dropdown>*/}
                </span>
            </div>
        )
    }
}

export default TableFilterTitle = Form.create()(TableFilterTitle);