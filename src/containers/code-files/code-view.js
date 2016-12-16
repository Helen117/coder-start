/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Row, input} from 'antd';
import SyntaxHighlighter from './syntaxhighlighter';
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
            style: require('./styles/atelier-dune-light').default,
            code: '',
        }
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
        const {fetchContentStatus,visible,pathName,filePath} = this.props;
        if((fetchContentStatus || false) && (visible==true)){
            let index = pathName.lastIndexOf('.');
            let categary = pathName.substr(index+1,pathName.length);
            let imgPath = '/'+filePath;
            return (
                <div className={styles.code_view}>
                    <Row className={styles.blob_commit_info}>
                        <p className={styles.commit_info}>{pathName}</p>
                    </Row>
                    <Row>
                        <div className={styles.blob_commit_info}>
                            {(categary=='png' || categary=='jpg')?(
                                <img src={imgPath}></img>
                            ):(
                                <SyntaxHighlighter style={this.state.style}
                                                   showLineNumbers>
                                    {this.state.code}
                                </SyntaxHighlighter>
                            )}
                        </div>
                    </Row>
                </div>
            )
        }else if((fetchContentStatus == false) && (visible==true)){
            return (
                <div className={styles.code_view}>
                    <Row className={styles.blob_commit_info}>
                        <p className={styles.commit_info}>{pathName}</p>
                    </Row>
                    <Row>
                        <div className={styles.blob_commit_info}>

                        </div>
                    </Row>
                </div>
            )
        }else {return <div></div>}
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