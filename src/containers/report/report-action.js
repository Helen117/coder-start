/**
 * Created by helen on 2016/12/27.
 */
import api from '../../api';
export function fetchReportData(milestoneId) {
    return {
        type: 'FETCH_REPORT_DATA',
        payload: {
            promise: api.post('/report/labels',{
                params: {
                    id: milestoneId,
                }
            })
        }
    }
}

export function fetchTeamMemberDemandProportion(milestoneId,groupId) {
    return {
        type: 'FETCH_MEMBER_RATE',
        payload: {
            promise: api.post('/report/team',{
                params: {
                    milestone_id: milestoneId,
                    group_id:groupId
                }
            })
        }
    }
}

export function fetchTeamMemberDemandComplete(milestoneId,groupId) {
    return {
        type: 'FETCH_MEMBER_DEMAND_COMPLETE',
        payload: {
            promise: api.post('/report/member-demand',{
                params: {
                    milestone_id: milestoneId,
                    group_id:groupId
                }
            })
        }
    }
}

export function fetchTeamDemandComplete(milestoneId) {
    return {
        type: 'FETCH_TEAM_DEMAND_COMPLETE',
        payload: {
            promise: api.post('/report/team-demand',{
                params: {
                    milestone_id: milestoneId
                }
            })
        }
    }
}

export function fetchMemberInfo(milestoneId) {
    return {
        type: 'FETCH_MEMBER',
        payload: {
            promise: api.post('/project/milestone-developer',{
                params: {
                    milestone_id: milestoneId,
                }
            })
        }
    }
}