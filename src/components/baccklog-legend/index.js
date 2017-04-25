/**
 * Created by Administrator on 2017/4/24.
 */
import React, {PropTypes} from 'react';
import styles from './index.css';

export default class BacklogLegend extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidUpdate(){

    }



    render(){

        return(
            <div className={styles.containt}>
                <div className={styles.backlog_bg}>
                    <div ></div>
                    <span>Backlog</span>
                </div>
                <div className={styles.sprint_bg}>
                    <div ></div>
                    <span>Sprint</span>
                </div>
                <div className={styles.story_bg}>
                    <div ></div>
                    <span>故事</span>
                </div>
                <div className={styles.selected_bg}>
                    <div ></div>
                    <span>选中</span>
                </div>
            </div>
        )
    }
}
