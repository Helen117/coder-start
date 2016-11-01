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
            language:""
        }
    }

    componentWillMount(){

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location.state.pathName){
            let file_name = nextProps.location.state.pathName;
            let catIndex = file_name.lastIndexOf(".");
            let categary;
            if(catIndex < 0){
                categary = "";
            }else{
                categary = file_name.substr(catIndex+1,file_name.length);
                if( (categary.toLowerCase()=="js".toLowerCase()) || (categary.toLowerCase()=="java".toLowerCase())
                    || (categary.toLowerCase()=="json".toLowerCase()) || (categary.toLowerCase()=="html".toLowerCase()) ||
                    (categary.toLowerCase()=="md".toLowerCase()) || (categary.toLowerCase()=="xml".toLowerCase())){
                    categary = categary;
                }else{
                    categary = "";
                }
            }
            this.setState({
                language:categary
            })
        }
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

        return (
            <div className={styles.code_view}>
                <Row className={styles.blob_commit_info}>
                    <p className={styles.commit_info}>{this.props.location.state.pathName}</p>
                </Row>
                <Row>
                 <div className={styles.blob_commit_info}>
                 {/*<SyntaxHighlighter language={this.state.language} style={this.state.style}
                                    showLineNumbers>
                 {this.state.code}
                 </SyntaxHighlighter>*/}
                 </div>
                </Row>
            </div>
        )
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