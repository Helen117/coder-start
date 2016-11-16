/**
 * Created by helen on 2016/11/15.
 */
import api from '../../../api';

export function workflowStage(projectId) {
    return {
        type: 'FULL_STAGE',
        payload: {
            promise: api.post('/jenkins/build', {
                params: {
                    projectId: projectId
                }
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

export function codeChanges(gitCommitId,oldId) {
    return {
        type: 'CODE_COMMIT',
        payload: {
            promise: api.post('/project/change', {
                params: {
                    newId: gitCommitId,
                    oldId:oldId
                }
            })
        }
    }
}