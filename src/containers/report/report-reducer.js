/**
 * Created by helen on 2016/12/27.
 */
export default function report(state={}, action = {}) {
    switch (action.type) {
        case 'FETCH_REPORT_DATA_PENDING':
            return {...state, getReportDataPending:true,reportData:null};
        case 'FETCH_REPORT_DATA_SUCCESS':
            return {...state, reportData: action.payload,getReportDataPending:false};
        case 'FETCH_REPORT_DATA_ERROR':
            return {...state, reportData:null,getReportDataPending:false,getReportDataError:action.payload.errorMsg};

        case 'FETCH_MEMBER_PENDING':
            return {...state, getMemberDataPending:true,member:null};
        case 'FETCH_MEMBER_SUCCESS':
            return {...state, member: action.payload,getMemberDataPending:false};
        case 'FETCH_MEMBER_ERROR':
            return {...state, member:null,getMemberDataPending:false,getMemberDataError:action.payload.errorMsg};

        default:
            return state;
    }
}
