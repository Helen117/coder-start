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
        //团队缺陷分析报表
        case 'FETCH_MEMBER_RATE_PENDING':
            return {...state, getMemberRatePending:true,memberRate:null};
        case 'FETCH_MEMBER_RATE_SUCCESS':
            return {...state, memberRate: action.payload,condition_teamdefet:action.meta,getMemberRatePending:false};
        case 'FETCH_MEMBER_RATE_ERROR':
            return {...state, memberRate:null,condition_teamdefet:action.meta,getMemberRatePending:false,getMemberRateError:action.payload.errorMsg};
        //团队中成员每日的需求完成情况
        case 'FETCH_MEMBER_DEMAND_COMPLETE_PENDING':
            return {...state, getMemberDemandCompletePending:true,memberDemandComplete:null};
        case 'FETCH_MEMBER_DEMAND_COMPLETE_SUCCESS':
            return {...state, memberDemandComplete: action.payload,condition_memberdemond:action.meta,getMemberDemandCompletePending:false};
        case 'FETCH_MEMBER_DEMAND_COMPLETE_ERROR':
            return {...state, memberDemandComplete:null,condition_memberdemond:action.meta,getMemberDemandCompletePending:false,getMemberDemandCompleteError:action.payload.errorMsg};
        //多个团队横向比较每日需求完成情况分布
        case 'FETCH_TEAM_DEMAND_COMPLETE_PENDING':
            return {...state, getTeamDemandCompletePending:true,teamDemandComplete:null};
        case 'FETCH_TEAM_DEMAND_COMPLETE_SUCCESS':
            return {...state, teamDemandComplete: action.payload,condition_teamdemond:action.meta,getTeamDemandCompletePending:false};
        case 'FETCH_TEAM_DEMAND_COMPLETE_ERROR':
            return {...state, teamDemandComplete:null,condition_teamdemond:action.meta,getTeamDemandCompletePending:false,getTeamDemandCompleteError:action.payload.errorMsg};
        //横向对多个团队的情况进行对比分析
        case 'FETCH_TEAM_STATISTICS_PENDING':
            return {...state, getTeamStatisticsPending:true,teamStatistics:null};
        case 'FETCH_TEAM_STATISTICS_SUCCESS':
            return {...state, teamStatistics: action.payload,condition_teamStatistics:action.meta,getTeamStatisticsPending:false};
        case 'FETCH_TEAM_STATISTICS_ERROR':
            return {...state, teamStatistics:null,condition_teamStatistics:action.meta,getTeamStatisticsPending:false,getTeamStatisticsError:action.payload.errorMsg};
        //管理视角统计报表数据
        case 'FETCH_DEMAND_STATISTICS_PENDING':
            return {...state, getDemandStatisticsPending:true,demandStatistics:null};
        case 'FETCH_DEMAND_STATISTICS_SUCCESS':
            return {...state, demandStatistics: action.payload,condition_worksheet:action.meta,getDemandStatisticsPending:false};
        case 'FETCH_DEMAND_STATISTICS_ERROR':
            return {...state, demandStatistics:null,condition_worksheet:action.meta,getDemandStatisticsPending:false,getDemandStatisticsError:action.payload.errorMsg};
        //从团队leader视角展示当前团队中开发及测试人员整体情况
        case 'FETCH_DEVELOPER_TESTER_REPORT_PENDING':
            return {...state, getDeveloperTesterDataPending:true,developerTesterData:null};
        case 'FETCH_DEVELOPER_TESTER_REPORT_SUCCESS':
            return {...state, developerTesterData: action.payload,condition_developerTester:action.meta,getDeveloperTesterDataPending:false};
        case 'FETCH_DEVELOPER_TESTER_REPORT_ERROR':
            return {...state, developerTesterData:null,condition_developerTester:action.meta,getDeveloperTesterDataPending:false,getDeveloperTesterDataError:action.payload.errorMsg};
        //团队成员当前工作情况
        case 'FETCH_MEMBER_CURRENT_WORK_PENDING':
            return {...state, getMemberCurrentWorkPending:true,memberCurrentWork:null};
        case 'FETCH_MEMBER_CURRENT_WORK_SUCCESS':
            return {...state, memberCurrentWork: action.payload,condition_membercurrent:action.meta,getMemberCurrentWorkPending:false};
        case 'FETCH_MEMBER_CURRENT_WORK_ERROR':
            return {...state, memberCurrentWork:null,condition_membercurrent:action.meta,getMemberCurrentWorkPending:false,getMemberCurrentWorkError:action.payload.errorMsg};

        case 'FETCH_TEAM_CURRENT_WORK_PENDING':
            return {...state, getTeamCurrentWorkPending:true,teamCurrentWork:null};
        case 'FETCH_TEAM_CURRENT_WORK_SUCCESS':
            return {...state, teamCurrentWork: action.payload,condition_teamcurrent:action.meta,getTeamCurrentWorkPending:false};
        case 'FETCH_TEAM_CURRENT_WORK_ERROR':
            return {...state, teamCurrentWork:null,condition_teamcurrent:action.meta,getTeamCurrentWorkPending:false,getTeamCurrentWorkError:action.payload.errorMsg};
        //个人代码管理视角数据和查询条件
        case 'FETCH_PERSONAL_CODE_MANAGE_PENDING':
            return {...state, getPersonalCodeManagePending:true,personalCodeManage:null};
        case 'FETCH_PERSONAL_CODE_MANAGE_SUCCESS':
            return {...state, personalCodeManage: action.payload,condition_personal:action.meta,getPersonalCodeManagePending:false};
        case 'FETCH_PERSONAL_CODE_MANAGE_ERROR':
            return {...state, personalCodeManage:null,condition_personal:action.meta,getPersonalCodeManagePending:false,getPersonalCodeManageError:action.payload.errorMsg};
        //重置报表数据为[]，查询条件为null
        case 'RESET_REPORT_DATA':
            return {...state,
                reportData: action.meta,condition_business:null,
                demandStatistics:action.meta,condition_worksheet:null,
                personalCodeManage:action.meta,condition_personal:null,
                memberRate:action.meta,condition_teamdefet:null,
                memberDemandComplete:action.meta,condition_memberdemond:null,
                teamDemandComplete:action.meta,condition_teamdemond:null,
                teamStatistics:action.meta,condition_teamStatistics:null,
                developerTesterData:action.meta,condition_developerTester:null};

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
