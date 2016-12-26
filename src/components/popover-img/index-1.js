/**
 * Created by Administrator on 2016-11-08.
 */
import React, {PropTypes} from 'react';
import {Popover, Icon,Row,Col} from 'antd';
import styles from './index-1.css';
import ToolTipDiv from './content';

export default class PopoverImg extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showContent:true
        };
    }

    clickSettingImg(){
        this.setState({
            showContent:!this.state.showContent
        })
    }

    render(){
        return(
            <div style={{display:'inline-block',minWidth:'100px'}}>
                <div style={{display: 'inline',float:'right',paddingLeft:'10px'}}>
                    <div className={styles.set_div} onClick={this.clickSettingImg.bind(this)}>
                        <div style={{width:'40px'}}>
                            <Icon type="setting" className={styles.setting_img} />
                            <Icon type="down" className={styles.down_img}/>
                        </div>
                    </div>
                </div>
                <div style={{display: 'inline',float:'right'}}>
                    <ToolTipDiv content={this.props.content}
                        visible={this.state.showContent}/>
                </div>
            </div>
        )
    }
}