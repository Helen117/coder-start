/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Row, input, Spin} from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from "./index.css";

class CodeView extends React.Component {
    constructor(){
        super();
        this.state = {
            style: require('react-syntax-highlighter/dist/styles/agate').default,
            code: '',
        }
    }

    componentWillReceiveProps(nextProps){
        const { code} = nextProps;
        if(code && code != this.props.code){
            this.setState({
                code:code.content
            })
        }
    }

    render(){
        const {code,visible,pathName,filePath} = this.props;
        let imgPath = '',categary='',fileName = '';
        if(code){
            const index = pathName.lastIndexOf('.');
            categary = pathName.substr(index+1,pathName.length);
            imgPath = '/'+filePath;
            fileName = pathName;
        }
        if(visible){
            return (
                <Spin spinning={this.props.loading} tip="正在加载数据...">
                    <div >
                        <Row className={styles.blob_commit_info}>
                            <p className={styles.commit_info}>{fileName}</p>
                        </Row>
                        <Row>
                            <div className={styles.blob_commit_info}>
                                {(categary=='png' || categary=='jpg')?(
                                    <img src={imgPath}></img>
                                ):(
                                    <SyntaxHighlighter
                                        language={categary=="diff"?"diff":""}
                                        style={this.state.style}
                                        showLineNumbers>
                                        {this.state.code}
                                    </SyntaxHighlighter>
                                )}
                            </div>
                        </Row>
                    </div>
                </Spin>
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
        code:state.getCodeFile.codeView,
    }
}

function mapDispatchToProps(){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeView);