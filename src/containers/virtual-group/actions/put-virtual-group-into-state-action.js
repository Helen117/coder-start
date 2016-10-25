/**
 * Created by zhaojp on 2016/10/25.
 */
import api from '../../../api';
import {PUT_VIRTUAL_GROUP_TO_STATE} from '../constants/virtual-group-action-types';

export default function putVirtualGroupToState(selectedItem) {
    return {
        type: PUT_VIRTUAL_GROUP_TO_STATE,
        payload: {
            data: selectedItem,
        }
    }
}


