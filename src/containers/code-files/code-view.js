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
            style: require('react-syntax-highlighter/dist/styles/atelier-dune-light').default,
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
        let imgPath = '',categary='',fileName = '';
        if(fetchContentStatus || false){
            let index = pathName.lastIndexOf('.');
            categary = pathName.substr(index+1,pathName.length);
            imgPath = '/'+filePath;
            fileName = pathName;
        }
        if(visible==true){
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
                                    <SyntaxHighlighter style={this.state.style}
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
        codeView:state.getCodeFile.codeView,
        fetchContentStatus:state.getCodeFile.fetchContentStatus
    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeView);