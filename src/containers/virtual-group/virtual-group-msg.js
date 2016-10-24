/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import { Transfer, Button } from 'antd';

export default class virtualGroupMsg extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    createVirtualGroup(){
        this.context.router.push({
            pathname: '/createVirtualGroup',
        });
    }

    render(){
        return (
            <div style={{margin:15}}>
                <div >
                    <Button className="pull-right" type="primary"  onClick={this.createVirtualGroup.bind(this,'add',null)}>创建虚拟组</Button>
                </div>
            </div>
        );
    }
}

virtualGroupMsg.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};