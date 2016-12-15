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
class ShowInfo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const selectedItemId = this.props.selectedItemInfo?this.props.selectedItemInfo.id:'';
        console.log('调用componentDidMount',selectedItemId)
        this.isShowModel(selectedItemId)
    }

    componentWillReceiveProps(nextProps) {
        const thisId = this.props.selectedItemInfo?this.props.selectedItemInfo.id:'';
        const nextId = nextProps.selectedItemInfo?nextProps.selectedItemInfo.id:'';
        //点击项目集合树切换数据类型，页面加载不同内容
        if(thisId != nextId && nextId){
            this.isShowModel(nextId)
        }
    }

    isShowModel(id){
        if(id.indexOf("_g")>0) {
            showProjectInfo = false;
            showSetInfo = true;
        }else if(id.indexOf("_p")>0){
            showProjectInfo = true;
            showSetInfo = false;
        }
    }

    render(){
        console.log('showSetInfo',showSetInfo,'showProjectInfo',showProjectInfo)
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
        selectedItemInfo: state.projectSet.selectedProjectSet,
    }
}

export default connect(mapStateToProps)(ShowInfo);