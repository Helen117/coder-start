/**
 * Created by zhaojp on 2016/11/23.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import {connect} from 'react-redux';
import SelectedSetInfo from './project-set-info';
import SelectedProInfo from './project-info'


let showProjectInfo = false;
let showSetInfo = true;
class showInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const thisId = this.props.selectedItemInfo?this.props.selectedItemInfo.id:'';
        const nextId = nextProps.selectedItemInfo?nextProps.selectedItemInfo.id:'';
        //点击项目集合树切换数据类型，页面加载不同内容
        if(thisId != nextId && nextId){
            if(nextId.indexOf("_g")>0) {
                showProjectInfo = false;
                showSetInfo = true;
            }else if(nextId.indexOf("_p")>0){
                showProjectInfo = true;
                showSetInfo = false;
            }
        }
    }

    render(){
        return(
            <div>
                <SelectedSetInfo visible={showSetInfo}/>
                <SelectedProInfo visible={showProjectInfo}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        selectedItemInfo: state.projectSetToState.selectedProjectSet,
    }
}

export default connect(mapStateToProps)(showInfo);