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