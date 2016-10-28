/**
 * Created by zhaojp on 2016/10/25.
 */
import api from '../../../api';
import {PUT_PROJECT_SET_TO_STATE} from '../constants/project-set-action-types';

export default function putProjectSetToState(selectedItem) {
    return {
        type: PUT_PROJECT_SET_TO_STATE,
        payload: {
            data: selectedItem,
        }
    }
}


