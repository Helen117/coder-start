/**
 * Created by Administrator on 2017/2/27.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Alert,Row,Button,Radio,Icon,Col} from 'antd';
import ScannerList from './scanner-list';
import ScannerItem from './scanner-item';
import styles from './index.css';

class ProjectScanner extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            branch:'dev'
        };
    }

    componentWillReceiveProps(nextProps){

    }

    handleBranchChange(e){
        this.setState({
            branch:e.target.value
        })
    }

    render(){
        const {projectGroup} = this.props;
        let showScannerList=false,showScannerItem=false;
        const node = projectGroup.getGroupInfo?projectGroup.getGroupInfo.node:'';
        if(node){
            if((node.id.indexOf("_") < 0 && node.id > 0) || (node.id.indexOf("_g") > 0)){
                showScannerList=true;
                showScannerItem=false;
            }else if(node.id.indexOf("_") >= 0 && node.id.indexOf("_g") < 0){
                showScannerList=false;
                showScannerItem=true;
            }else {
                showScannerList=false;
                showScannerItem=false;
            }
        }

        return(
            <div>
                {
                    (!showScannerList && !showScannerItem)?(
                        <div className={styles.padding_position}>
                            <Alert
                                message={
                                    <Row>
                                        <span>请选择具体的项目或项目组!</span>
                                    </Row>
                                }
                                description=""
                                type="info"
                                showIcon/>
                        </div>
                    ):<div className={styles.padding_position}>
                        <Row>
                            <Col span={12}>
                                <Icon type="home" />
                                <span className={styles.home_style}>{node.name}</span>
                            </Col>
                            <Col span={12}>
                                <div className={styles.branch_position}>
                                    <Radio.Group value={this.state.branch}
                                                 onChange={this.handleBranchChange.bind(this)}>
                                        <Radio.Button value="dev">dev</Radio.Button>
                                        <Radio.Button value="master">master</Radio.Button>
                                        <Radio.Button value="release">release</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Col>
                        </Row>
                        {showScannerList?(<ScannerList visible={showScannerList}
                                                       node={node}
                                                       branch={this.state.branch}/>):(<div></div>)}
                        {showScannerItem?(<ScannerItem visible={showScannerItem}
                                                       node={node}
                                                       branch={this.state.branch}/>):(<div></div>)}
                    </div>
                }
            </div>
        )
    }
}

ProjectScanner.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        projectGroup:state.projectGroup,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectScanner);