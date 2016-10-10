/**
 * Created by Administrator on 2016-10-09.
 */
import React  from 'react';
import { Menu, Icon,Row, Col } from 'antd';
import styles from './index.css';

export default class TopNaviGation extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            current: 'mail',
        }
    }

    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (
            <div>
                <Row>
                    <Menu onClick={this.handleClick}
                          selectedKeys={[this.state.current]}
                          mode="horizontal"
                    >
                        <Menu.Item key="mail">
                            <Icon type="mail" />项目相关
                        </Menu.Item>
                        <Menu.Item key="submenu">
                            <Icon type="setting" />代码合并
                        </Menu.Item>
                        <Menu.Item key="alipay">
                            项目质量管理
                        </Menu.Item>
                    </Menu>
                </Row>
                <Row className={styles.sub_navi}>
                    <ul className={styles.sub_navi_ul}>
                        <li className={styles.sub_navi_li}>
                            <a>
                                <span>
                                    问题
                                </span>
                            </a>
                        </li>
                        <li className={styles.sub_navi_li}>
                            <a>
                                <span>
                                    里程碑
                                </span>
                            </a>
                        </li>
                    </ul>
                </Row>
            </div>
        );
    }
}