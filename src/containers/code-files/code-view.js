/**
 * Created by Administrator on 2016-10-24.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, input} from 'antd';
import SyntaxHighlighter from './syntaxhighlighter';

class CodeView extends React.Component {
    constructor(){
        super();
        const initialCodeString = `const woah = fun => fun + 1;
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
            selected: 'docco',
            style: require('./styles/docco').default,
            code: initialCodeString
        }
    }

    render(){

        return (
            <div>
                <Row>
                    <span>merge</span>
                    <span>毕佩珊 authored 12 days ago</span>
                </Row>
                <Row>
                    <span>index.js 1.84kb</span>
                </Row>
                <Row>
                 <div >
                 <input
                 type="textarea"
                 rows={40}
                 cols={100}
                 value={this.state.code}
                 onChange={(e) => this.setState({code: e.target.value})}
                 />
                 <div >
                 <SyntaxHighlighter language='javascript' style={this.state.style}>
                 {this.state.code}
                 </SyntaxHighlighter>
                 </div>
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