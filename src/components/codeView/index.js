/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
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
        }
    }

    componentWillReceiveProps(nextProps){
    }

    render(){
        const {fileName,filePath,code} = this.props;
        let index =0,categary='',imgPath='';
        if(fileName){
            index = fileName.lastIndexOf('.');
            categary = fileName.substr(index+1,fileName.length);
        }
        if(filePath){
            imgPath = '/'+filePath
        }
        return (
            <div className={styles.code_view}>
                <Row className={styles.blob_commit_info}>
                    <p className={styles.commit_info}>{fileName}</p>
                </Row>
                <Row>
                    <div className={styles.blob_commit_info}>
                        {(categary=='png' || categary=='jpg')?(
                            <img src={imgPath}></img>
                        ):(
                            <SyntaxHighlighter style={this.state.style}
                                               showLineNumbers>
                                {code}
                            </SyntaxHighlighter>
                        )}
                    </div>
                </Row>
            </div>
        )

    }
}


export default (CodeView);