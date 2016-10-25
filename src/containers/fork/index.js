/**
 * Created by helen on 2016/10/9.
 */
import React, {PropTypes,Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fork from '../project-list/actions/fork-project-action';
import Box from '../../components/box';
import styles from './index.css';

class Forks extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const projectId = this.props.location.state.projectId;
        const {actions} = this.props;
        actions.getForks(projectId);
    }

    render() {
        const { forks } = this.props;

        const list =forks?forks.map(data => <li key={data.id}>
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
        forks:state.forkProject.forksInfo
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(fork,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Forks);