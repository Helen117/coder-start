/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
        const initialCodeString = `
        const woah = fun => fun + 1;
    const dude = woah(2) + 3;
    function thisIsAFunction() {
     return [1,2,3].map(n => n + 1).filter(n !== 3);
    }
    console.log('making up fake code is really hard');

    function itIs() {
     return 'no seriously really it is';
    }
  `;
        this.state = {
            style: require('./styles/atelier-dune-light').default,
            code: initialCodeString
        }
    }

    render(){

        return (
            <div className={styles.code_view}>
                <Row className={styles.blob_commit_info}>
                    <div className={styles.commit_info}>
                        <p>merge</p>
                        <p>毕佩珊 authored 12 days ago</p>
                    </div>
                </Row>
                <Row className={styles.blob_commit_info}>
                    <p className={styles.commit_info}>index.js 1.84kb</p>
                </Row>
                <Row>
                 <div className={styles.blob_commit_info}>
                 <SyntaxHighlighter language='javascript' style={this.state.style}
                                    showLineNumbers>
                 {this.state.code}
                 </SyntaxHighlighter>
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

    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeView);