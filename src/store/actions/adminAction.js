// import { lang } from 'moment/moment';
import actionTypes from './actionTypes';
import {
    getallcodeServive, createNewUserAPI,
    deleteUserAPI, getAllUsers, editUserAPI,
    getTopDoctorHomeService, getAllDoctors, createDetailDoctor,
    getDetailInfoDoctor, getAllSpecialty, getAllClinic

}
    from '../../services/userService';
import { toast } from 'react-toastify';
// export const FetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// });

export const FetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await getallcodeServive('GENDER')
            if (res && res.errCode === 0) {
                dispatch(FetchGenderSuccess(res.data))
            } else {
                dispatch(FetchGenderFail())
            }
        } catch (error) {
            dispatch(FetchGenderFail())
        }
    }
};
export const FetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
});
export const FetchGenderFail = () => ({
    type: actionTypes.FETCH_GENDER_FAIL
});
export const FetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getallcodeServive('POSITION')
            if (res && res.errCode === 0) {
                dispatch(FetchPositionSuccess(res.data))
            } else {
                dispatch(FetchPositionFail())
            }
        } catch (error) {
            dispatch(FetchPositionFail())
        }
    }
};
export const FetchPositionSuccess = (Data) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: Data
});
export const FetchPositionFail = () => ({
    type: actionTypes.FETCH_POSITION_FAIL
});
export const FetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getallcodeServive('ROLE')
            if (res && res.errCode === 0) {
                dispatch(FetchRoleSuccess(res.data))
            } else {
                dispatch(FetchRoleFail())
            }
        } catch (error) {
            dispatch(FetchRoleFail())
        }
    }
};
export const FetchRoleSuccess = (Data) => ({
    type: actionTypes.FETCH_ROLEID_SUCCESS,
    data: Data
});

export const FetchRoleFail = () => ({
    type: actionTypes.FETCH_ROLEID_FAIL
});
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserAPI(data)
            if (res && res.errCode === 0) {
                toast.success('Create New User Success')
                dispatch(saveUserSuccess())
                dispatch(fetchAllUsersStart())
            } else {
                toast.error('Create New User Fail, Your email have been used')
                dispatch(saveUserFail())
            }
        } catch (error) {
            dispatch(saveUserFail())
        }
    }
};
export const saveUserSuccess = (data) => ({
    type: actionTypes.CREATE_USER_SUCCESS,
    // data: data
});
export const saveUserFail = () => ({
    type: actionTypes.CREATE_USER_FAIL
});
export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL')
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users))
            } else {
                toast.error('Fetch All User Error')
                dispatch(fetchAllUsersFail())
            }
        } catch (error) {
            toast.error('Fetch All User Error')
            dispatch(fetchAllUsersFail())
        }
    }
};
export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
});
export const fetchAllUsersFail = () => ({
    type: actionTypes.FETCH_ALL_USER_FAIL
});
export const deleteAUser = (userID) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserAPI(userID)
            if (res && res.errCode === 0) {
                dispatch(DeleteAUserSuccess())
                toast.success('Delete User Success')
                dispatch(fetchAllUsersStart())
            } else {
                toast.error('Delete User Error')
                dispatch(DeleteUsersFail())
            }
        } catch (error) {
            toast.error('Delete User Error')
            dispatch(DeleteUsersFail())
        }
    }
};
export const DeleteAUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
});
export const DeleteUsersFail = () => ({
    type: actionTypes.DELETE_USER_FAIL
});
export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserAPI(data)
            if (res && res.errCode === 0) {
                toast.success('Update User Success')
                dispatch(editAUserSuccess())
                dispatch(fetchAllUsersStart())
            } else {
                toast.error('Update User Error')
                dispatch(editUsersFail())
            }
        } catch (error) {
            dispatch(saveUserFail())
            toast.error('Update User Error')
        }
    }
};
export const editAUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
});
export const editUsersFail = () => ({
    type: actionTypes.EDIT_USER_FAIL
});
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('')
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    dataDoctors: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_FAIL,
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTOR_FAIL,
            })
        }
    }
}
export const fetchAllDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
                    dataDr: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_FAIL,
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTOR_FAIL,
            })
        }
    }
}
export const createDetailDoctorAction = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createDetailDoctor(data)
            if (res && res.errCode === 0) {
                toast.success('Create Detail Dr Success')
                dispatch({
                    type: actionTypes.CREATE_DETAIL_DOCTOR_SUCCESS,
                })
            } else {
                toast.error('Create Detail Dr Fail')
                dispatch({
                    type: actionTypes.CREATE_DETAIL_DOCTOR_FAIL,
                })
            }
        } catch (error) {
            toast.error('Create Detail Dr Fail')
            dispatch({
                type: actionTypes.CREATE_DETAIL_DOCTOR_FAIL,
            })
        }
    }
}
export const fetchDetailDoctor = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailInfoDoctor(id)
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_DOCTOR_SUCCESS,
                    dataDetailDoctor: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_DOCTOR_FAIL,
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_DETAIL_DOCTOR_FAIL,
            })
        }
    }
}
export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getallcodeServive('TIME')
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL,
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL,
            })
        }
    }
}
export const getAllRequiredDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START })
            let resPrice = await getallcodeServive('PRICE')
            let resPayment = await getallcodeServive('PAYMENT')
            let resProvince = await getallcodeServive('PROVINCE')
            let resCategory = await getallcodeServive('CATEGORY')
            let resSpecialty = await getAllSpecialty()
            let resClinic = await getAllClinic()
            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resCategory && resCategory.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0

            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resCategory: resCategory.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch(FetchRequireDoctorInfoSuccess(data))
            } else {
                dispatch(FetchRequireDoctorInfoFail())
            }
        } catch (error) {
            dispatch(FetchRequireDoctorInfoFail())
        }
    }
};
export const FetchRequireDoctorInfoSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
    data: allRequiredData
})
export const FetchRequireDoctorInfoFail = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAIL,
})