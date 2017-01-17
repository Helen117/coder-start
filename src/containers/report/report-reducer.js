/**
 * Created by helen on 2016/12/27.
 */
export default function report(state={}, action = {}) {
    switch (action.type) {
        //业务范畴报表
        case 'FETCH_REPORT_DATA_PENDING':
            return {...state, getReportDataPending:true,reportData:null};
        case 'FETCH_REPORT_DATA_SUCCESS':
            return {...state, reportData: action.payload,condition_business:action.meta,getReportDataPending:false};
        case 'FETCH_REPORT_DATA_ERROR':
            return {...state, reportData:null,condition_business:action.meta,getReportDataPending:false,getReportDataError:action.payload.errorMsg};

        case 'FETCH_MEMBER_PENDING':
            return {...state, getMemberDataPending:true,member:null};
        case 'FETCH_MEMBER_SUCCESS':
            return {...state, member: action.payload,getMemberDataPending:false};
        case 'FETCH_MEMBER_ERROR':
            return {...state, member:null,getMemberDataPending:false,getMemberDataError:action.payload.errorMsg};

        case 'FETCH_MEMBER_RATE_PENDING':
            return {...state, getMemberRatePending:true,memberRate:null};
        case 'FETCH_MEMBER_RATE_SUCCESS':
            return {...state, memberRate: action.payload,getMemberRatePending:false};
        case 'FETCH_MEMBER_RATE_ERROR':
            return {...state, memberRate:null,getMemberRatePending:false,getMemberRateError:action.payload.errorMsg};

        case 'FETCH_MEMBER_DEMAND_COMPLETE_PENDING':
            return {...state, getMemberDemandCompletePending:true,memberDemandComplete:null};
        case 'FETCH_MEMBER_DEMAND_COMPLETE_SUCCESS':
            return {...state, memberDemandComplete: action.payload,getMemberDemandCompletePending:false};
        case 'FETCH_MEMBER_DEMAND_COMPLETE_ERROR':
            return {...state, memberDemandComplete:null,getMemberDemandCompletePending:false,getMemberDemandCompleteError:action.payload.errorMsg};

        case 'FETCH_TEAM_DEMAND_COMPLETE_PENDING':
            return {...state, getTeamDemandCompletePending:true,teamDemandComplete:null};
        case 'FETCH_TEAM_DEMAND_COMPLETE_SUCCESS':
            return {...state, teamDemandComplete: action.payload,getTeamDemandCompletePending:false};
        case 'FETCH_TEAM_DEMAND_COMPLETE_ERROR':
            return {...state, teamDemandComplete:null,getTeamDemandCompletePending:false,getTeamDemandCompleteError:action.payload.errorMsg};

        case 'FETCH_TEAM_STATISTICS_PENDING':
            return {...state, getTeamStatisticsPending:true,teamStatistics:null};
        case 'FETCH_TEAM_STATISTICS_SUCCESS':
            return {...state, teamStatistics: action.payload,getTeamStatisticsPending:false};
        case 'FETCH_TEAM_STATISTICS_ERROR':
            return {...state, teamStatistics:null,getTeamStatisticsPending:false,getTeamStatisticsError:action.payload.errorMsg};
        //管理视角统计报表数据
        case 'FETCH_DEMAND_STATISTICS_PENDING':
            return {...state, getDemandStatisticsPending:true,demandStatistics:null};
        case 'FETCH_DEMAND_STATISTICS_SUCCESS':
            return {...state, demandStatistics: action.payload,condition_worksheet:action.meta,getDemandStatisticsPending:false};
        case 'FETCH_DEMAND_STATISTICS_ERROR':
            return {...state, demandStatistics:null,condition_worksheet:action.meta,getDemandStatisticsPending:false,getDemandStatisticsError:action.payload.errorMsg};

        case 'FETCH_DEVELOPER_TESTER_REPORT_PENDING':
            return {...state, getDeveloperTesterDataPending:true,developerTesterData:null};
        case 'FETCH_DEVELOPER_TESTER_REPORT_SUCCESS':
            return {...state, developerTesterData: action.payload,getDeveloperTesterDataPending:false};
        case 'FETCH_DEVELOPER_TESTER_REPORT_ERROR':
            return {...state, developerTesterData:null,getDeveloperTesterDataPending:false,getDeveloperTesterDataError:action.payload.errorMsg};

        case 'FETCH_MEMBER_CURRENT_WORK_PENDING':
            return {...state, getMemberCurrentWorkPending:true,memberCurrentWork:null};
        case 'FETCH_MEMBER_CURRENT_WORK_SUCCESS':
            return {...state, memberCurrentWork: action.payload,getMemberCurrentWorkPending:false};
        case 'FETCH_MEMBER_CURRENT_WORK_ERROR':
            return {...state, memberCurrentWork:null,getMemberCurrentWorkPending:false,getMemberCurrentWorkError:action.payload.errorMsg};

        case 'FETCH_TEAM_CURRENT_WORK_PENDING':
            return {...state, getTeamCurrentWorkPending:true,teamCurrentWork:null};
        case 'FETCH_TEAM_CURRENT_WORK_SUCCESS':
            return {...state, teamCurrentWork: action.payload,getTeamCurrentWorkPending:false};
        case 'FETCH_TEAM_CURRENT_WORK_ERROR':
            return {...state, teamCurrentWork:null,getTeamCurrentWorkPending:false,getTeamCurrentWorkError:action.payload.errorMsg};
        //个人代码管理视角数据和查询条件
        case 'FETCH_PERSONAL_CODE_MANAGE_PENDING':
            return {...state, getPersonalCodeManagePending:true,personalCodeManage:null};
        case 'FETCH_PERSONAL_CODE_MANAGE_SUCCESS':
            return {...state, personalCodeManage: action.payload,condition_personal:action.meta,getPersonalCodeManagePending:false};
        case 'FETCH_PERSONAL_CODE_MANAGE_ERROR':
            return {...state, personalCodeManage:null,condition_personal:action.meta,getPersonalCodeManagePending:false,getPersonalCodeManageError:action.payload.errorMsg};
        //重置报表数据为[]，查询条件为null
        case 'RESET_REPORT_DATA':
            return {...state, reportData: action.meta,demandStatistics:action.meta,
                condition_business:null,condition_worksheet:null,personalCodeManage:action.meta,
                condition_personal:null};

        case 'FETCH_GROUPS_PENDING':
            return {...state, getGroupsPending:true,groups:null};
        case 'FETCH_GROUPS_SUCCESS':
            return {...state, groups: action.payload,getGroupsPending:false};
        case 'FETCH_GROUPS_ERROR':
            return {...state, groups:null,getGroupsPending:false,getGroupsError:action.payload.errorMsg};

        default:
            return state;
    }
}
