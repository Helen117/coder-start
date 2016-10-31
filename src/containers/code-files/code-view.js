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
        basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case "uname" in
    *CYGWIN*) basedir="cygpath -w "$basedir"";;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/node_modules/gulp/bin/gulp.js" "$@"
  ret=$?
else 
  node  "$basedir/node_modules/gulp/bin/gulp.js" "$@"
  ret=$?
fi
exit $ret
  `;
        this.state = {
            style: require('./styles/atelier-dune-light').default,
            code: initialCodeString,
            language:""
        }
    }

    componentWillMount(){

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location.state){
            let file_name = nextProps.location.state;
            let catIndex = file_name.lastIndexOf(".");
            let categary;
            if(catIndex < 0){
                categary = "";
            }else{
                categary = file_name.substr(catIndex+1,file_name.length);
            }
            this.setState({
                language:categary
            })
        }
        /*const { codeFile, fetchCodeStatus} = nextProps;
        if(codeFile != this.props.codeFile){
            if(fetchCodeStatus == true){
                this.state.code.splice(0,this.state.code.length);
                for(var i=0; i<codeFile.filetree.result.length; i++){
                    this.state.code.push(codeFile.filetree.result[i]);
                }
            }
        }*/
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
                 <SyntaxHighlighter language={this.state.language} style={this.state.style}
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
        codeFile:state.getCodeFile.codeFile,
        fetchCodeStatus:state.getCodeFile.fetchCodeStatus
    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeView);