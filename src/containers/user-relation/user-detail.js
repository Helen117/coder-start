/**
 * Created by Administrator on 2016-11-09.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button,Icon,Row,Col} from 'antd';
import Box from '../../components/box';
import 'pubsub-js';
import styles from './index.css';

const FormItem = Form.Item;

class UpdateUserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex:-1,
        }
    }

    updatePassword(){
        this.setState({
            currentIndex:0
        })
        this.context.router.push({
            pathname:'/updateUserInfo/updatePassword'
        })
    }

    updateRole(){
        this.setState({
            currentIndex:1
        })
    }

    handleClick(e){
        //console.log("e",e)
    }

    render() {

        return(
            <Box title="修改员工信息">
                <Row>
                    <Col span={5}>
                        <ul className={styles.update_ul} onClick={this.handleClick.bind(this)}>
                            <li className={this.state.currentIndex==0?styles.update_li_light:styles.update_li}
                                onClick={this.updatePassword.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                修改密码</li>
                            <li className={this.state.currentIndex==1?styles.update_li_light:styles.update_li}
                                onClick={this.updateRole.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                修改角色</li>
                        </ul>
                    </Col>
                    <Col span={19}>
                        {this.props.children}
                    </Col>
                </Row>
            </Box>
        )
    }
}

UpdateUserInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UpdateUserInfo = Form.create()(UpdateUserInfo);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserInfo);