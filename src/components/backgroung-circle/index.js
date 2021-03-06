/**
 * Created by Administrator on 2017/3/2.
 */
import React, {PropTypes} from 'react';
import styles from './index.css';

export default class BackgroundCircle extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidUpdate(){
        const {alert_value} = this.props;
        /*const circle = document.getElementById("bg_circle");
        console.log('bg_circle:',circle);*/
        /*if(alert_value && alert_value=='5'){

        }*/
    }

    getLevelAndStyle(alert_value){
        let level_style = '',level = '';
        if(alert_value == '1.0'){
            level_style = styles.A_level;
            level = 'A';
        }else if(alert_value == '2.0'){
            level_style = styles.B_level;
            level = 'B';
        }else if(alert_value == '3.0'){
            level_style = styles.C_level;
            level = 'C';
        }else if(alert_value == '4.0'){
            level_style = styles.D_level;
            level = 'D';
        }else if(alert_value == '5.0'){
            level_style = styles.E_level;
            level = 'E';
        }
        return {level_style,level}
    }

    render(){
        const {alert_value} = this.props;
        const {level_style,level} = this.getLevelAndStyle(alert_value);

        return(
            <div id="bg_circle" className={level_style}>
                <span className={styles.span_style}>{level}</span>
            </div>
        )
    }
}

BackgroundCircle.propTypes = {
    alert_value: PropTypes.string,
};