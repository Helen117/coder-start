/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, input} from 'antd';
//import SyntaxHighlighter from './syntaxhighlighter';
import styles from "./index.css";

const availableStyles = [
    'docco',
    'foundation',
    'github',
    'monokai',
    'github-gist'
];

class CodeView extends React.Component {
    constructor(){
        super();
        this.state = {
            //style: require('./styles/atelier-dune-light').default,
            code: '',
        }
    }

    componentWillMount(){
        //console.log("componentWillMount")
    }

    componentWillReceiveProps(nextProps){
        const { codeView, fetchContentStatus} = nextProps;
        if(codeView != this.props.codeView){
            if(fetchContentStatus == true){
                this.setState({
                    code:codeView.content
                })
            }
        }
    }

    render(){
        const {fetchContentStatus} = this.props;
        if(fetchContentStatus || false){
            return (
                <div className={styles.code_view}>
                    <Row className={styles.blob_commit_info}>
                        <p className={styles.commit_info}>{this.props.location.state.pathName}</p>
                    </Row>
                    <Row>
                        <div className={styles.blob_commit_info}>
                            {/*<SyntaxHighlighter style={this.state.style}
                                               showLineNumbers>
                                {this.state.code}
                            </SyntaxHighlighter>*/}
                        </div>
                    </Row>
                </div>
            )
        }else{
            return (
                <div className={styles.code_view}>
                    <Row className={styles.blob_commit_info}>
                        <p className={styles.commit_info}>{this.props.location.state.pathName}</p>
                    </Row>
                    <Row>
                        <div className={styles.blob_commit_info}>

                        </div>
                    </Row>
                </div>
            )
        }
    }
}

CodeView.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        codeView:state.getCodeFile.codeView,
        fetchContentStatus:state.getCodeFile.fetchContentStatus
    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeView);