/**
 * Created by helen on 2016/11/15.
 */
import api from '../../../api';

export function workflowStage(projectId) {
    return {
        type: 'FULL_STAGE',
        payload: {
            promise: api.post('/getBuildList', {
                params: {
                    projectId: projectId
                },
                urlType:"ci"
            })
        }
    }
}

export function getStageDetail(stageId) {
    return {
        type: 'STAGE_DETAIL',
        payload: {
            promise: api.post('/jenkins/stage/detail', {
                params: {
                    stageId: stageId
                }
            })
        }
    }
}

export function codeChanges(projectId,gitCommitId,oldId) {
    return {
        type: 'CODE_COMMIT',
        payload: {
            promise: api.post('/repository/compare-commits', {
                params: {
                    projectId:projectId,
                    from: gitCommitId,
                    to:oldId
                }
            })
        }
    }
}