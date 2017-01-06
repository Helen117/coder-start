/**
 * Created by Administrator on 2016-12-23.
 */
import React, {PropTypes} from 'react';
import styles from './index-1.css';

export default class ToolTipDiv extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {content,visible} = this.props;

        if(visible){
            return (
                <div className={styles.tooltip_div}>
                    <div style={{padding:'5px 10px 5px 10px'}}>
                        {content}
                    </div>
                </div>)
        }else { return <div/> }
    }
}