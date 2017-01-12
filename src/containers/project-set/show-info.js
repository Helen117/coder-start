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
        this.state={
            showProjectInfo:false,
            showSetInfo: true
        }
    }

    componentDidMount() {
        const selectedItemId = this.props.selectedItemInfo?this.props.selectedItemInfo.id:'';
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
        if(id.indexOf("_p") > -1){
            showProjectInfo = true;
            showSetInfo = false;
            this.setState({
                showProjectInfo:true,
                showSetInfo: false
            })
        }else{
            showProjectInfo = false;
            showSetInfo = true;
            this.setState({
                showProjectInfo:false,
                showSetInfo: true
            })
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
        selectedItemInfo: state.projectSet.selectedProjectSet,
    }
}

export default connect(mapStateToProps)(ShowInfo);