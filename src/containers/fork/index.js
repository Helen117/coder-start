/**
 * Created by helen on 2016/10/9.
 */
import React, {PropTypes,Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fork from '../project-list/actions/fork-project-action';
import Box from '../../components/box';
import styles from './index.css';

class ForkList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const projectId = this.props.location.state.projectId;
        const {actions} = this.props;
        actions.getForkList(projectId);
    }

    render() {
        const { forkList } = this.props;
        //console.log('fork-list:',forkList);

        const list =forkList?forkList.map(data => <li key={data.id}>
            <div className={styles.forks_list} >
                <span>{data.author_name}/{data.project_name}</span>
                <p>
                    {data.description}
                </p>
            </div>
        </li>):[];

        return (
            <Box title="Fork信息">
                <div>
                    <ul>
                        {list}
                    </ul>
                </div>
            </Box>
        )
    }
}

function mapStateToProps(state) {
    return {
        forkList:state.forkProject.forksInfo
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(fork,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ForkList);