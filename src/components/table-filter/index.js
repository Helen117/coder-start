/**
 * Created by Administrator on 2016-11-11.
 */
import React, {PropTypes} from 'react';
import {Form,Input,Button,Row,Col} from 'antd';
import styles from './index.css';

const FormItem = Form.Item;

class TableFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettingDiv: true
        };
    }

    handleSubmit(e){
        e.preventDefault();
        const {form} = this.props;
        const data = form.getFieldsValue();
        //console.log("data:",data)
    }

    handleCancel(e){
        const {form} = this.props;
        form.resetFields();
    }

    render(){
        const { getFieldProps } = this.props.form;

        return(
            <div className={styles.div_style}>
                <Form horizontal style={{paddingTop:5}}>
                    <FormItem>
                        <Row>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <Input {...getFieldProps('searchContext')} size="small" />
                            </Col>
                        </Row>
                        <Row style={{paddingTop:5}}>
                            <hr color="#e5e5e5" size="1" />
                        </Row>
                        <Row style={{textAlign:"center",paddingBottom:5}}>
                            <Col >
                                <a onClick={this.handleSubmit.bind(this)}>确定</a>
                                <a onClick={this.handleCancel.bind(this)}
                                   style={{paddingLeft:10}}>重置</a>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default TableFilter = Form.create()(TableFilter);