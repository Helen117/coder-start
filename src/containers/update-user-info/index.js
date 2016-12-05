/**
 * Created by Administrator on 2016-11-09.
 */
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {Form, Icon,Row,Col} from 'antd';
import Box from '../../components/box';
import styles from './index.css';
import UpdatePassword from './password';
import UpdateBasicInfo from './basicinfo';
import UpdateSshKey from './sshkey';

class UpdateUserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex:-1,
            showPassword:false,
            showBasicInfo:false,
            showSshKey:false,
        }
    }

    updateBasicInfo(){
        this.setState({
            currentIndex:0,
            showPassword:false,
            showBasicInfo:true,
            showSshKey:false,
        })
    }

    updatePassword(){
        this.setState({
            currentIndex:1,
            showPassword:true,
            showBasicInfo:false,
            showSshKey:false,
        })
    }

    updateSshKey(){
        this.setState({
            currentIndex:3,
            showPassword:false,
            showBasicInfo:false,
            showSshKey:true,
        })
    }

    render() {

        return(
            <Box title="修改员工信息">
                <Row>
                    <Col span={5}>
                        <ul className={styles.update_ul}>
                            <li className={this.state.currentIndex==0?styles.update_li_light:styles.update_li}
                                onClick={this.updateBasicInfo.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                修改基本信息</li>
                            <li className={this.state.currentIndex==1?styles.update_li_light:styles.update_li}
                                onClick={this.updatePassword.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                修改密码</li>
                            <li className={this.state.currentIndex==3?styles.update_li_light:styles.update_li}
                                onClick={this.updateSshKey.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                SSH Keys</li>
                        </ul>
                    </Col>
                    <Col span={19}>
                        <UpdatePassword visible={this.state.showPassword}/>
                        <UpdateBasicInfo visible={this.state.showBasicInfo}/>
                        <UpdateSshKey visible={this.state.showSshKey}/>
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