/**
 * Created by helen on 2016/12/27.
 */
import api from '../../api';
export function fetchReportData(milestoneId,labelId) {
    return {
        type: 'FETCH_REPORT_DATA',
        payload: {
            promise: api.post('/report/labels',{
                params: {
                    id: milestoneId,
                    label_id_list:labelId
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

export function fetchTeamDemandComplete(milestoneId,groupId) {
    return {
        type: 'FETCH_TEAM_DEMAND_COMPLETE',
        payload: {
            promise: api.post('/report/team-demand',{
                params: {
                    milestone_id: milestoneId,
                    group_id_list:groupId
                }
            })
        }
    }
}

export function fetchTeamStatistics(milestoneId,groupId) {
    return {
        type: 'FETCH_TEAM_STATISTICS',
        payload: {
            promise: api.post('/report/team-scale',{
                params: {
                    milestone_id: milestoneId,
                    group_id_list:groupId
                }
            })
        }
    }
}

export function fetchDemandStatistics(milestoneId) {
    return {
        type: 'FETCH_DEMAND_STATISTICS',
        payload: {
            promise: api.post('/report/ranking-demand',{
                params: {
                    milestone_id: milestoneId
                }
            })
        }
    }
}

export function fetchDeveloperTesterReport(milestoneId,groupId,type) {
    return {
        type: 'FETCH_DEVELOPER_TESTER_REPORT',
        payload: {
            promise: api.post('/report/team-devoptest',{
                params: {
                    milestone_id: milestoneId,
                    group_id:groupId,
                    type:type
                }
            })
        }
    }
}

export function fetchMemberCurrentWork(groupId) {
    return {
        type: 'FETCH_MEMBER_CURRENT_WORK',
        payload: {
            promise: api.post('/report/member-everyday',{
                params: {
                    group_id:groupId
                }
            })
        }
    }
}

export function fetchTeamCurrentWork(groupId) {
    return {
        type: 'FETCH_TEAM_CURRENT_WORK',
        payload: {
            promise: api.post('/report/team-everyday',{
                params: {
                    group_id_list:groupId
                }
            })
        }
    }
}

export function fetchPersonalCodeManage(milestoneId,userId) {
    return {
        type: 'FETCH_PERSONAL_CODE_MANAGE',
        payload: {
            promise: api.post('/report/code-commit',{
                params: {
                    milestone_id: milestoneId,
                    user_id:userId
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

export function fetchGroupsInfo() {
    return {
        type: 'FETCH_GROUPS',
        payload: {
            promise: api.post('/groups/all-group')
        }
    }
}