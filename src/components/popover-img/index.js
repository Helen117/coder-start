/**
 * Created by Administrator on 2016-11-08.
 */
import React, {PropTypes} from 'react';
import {Popover, Icon} from 'antd';
import styles from './index.css';

export default class PopoverImg extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showSettingDiv:true
        };
    }

    clickSettingImg(){
        this.setState({
            showSettingDiv:!this.state.showSettingDiv
        })
    }

    render(){
        return(
            <Popover
                content={this.props.content}
                trigger="click"
                placement="left"
                visible={this.state.showSettingDiv}
                overlayStyle={this.state.showSettingDiv?{"zIndex":0}:{}}
            >
                <div className={styles.set_div} onClick={this.clickSettingImg.bind(this)}>
                    <Icon type="setting" className={styles.setting_img} />
                    <Icon type="down" className={styles.down_img}/>
                </div>
            </Popover>
        )
    }
}