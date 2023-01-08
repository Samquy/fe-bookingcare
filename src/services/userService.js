import axios from '../axios';

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password })
}
const getAllUsers = (id) => {
    return axios.get(`/api/get-all-users?id=${id}`)
}
const createNewUserAPI = (data) => {
    return axios.post('/api/create-new-user', data)
}
const deleteUserAPI = (userId) => {
    return axios.delete('/api/delete-user', {
        // headers: { Authorization: AuthorizationToken },
        data: { id: userId }
    })
}
const editUserAPI = (data) => {
    return axios.put('/api/edit-user', data)
}
const getallcodeServive = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}
const getTopDoctorHomeService = (inputLimit) => {
    return axios.get(`/api/get-top-doctor?limit=${inputLimit}`)
}
const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctor`)
}
const createDetailDoctor = (data) => {
    return axios.post(`/api/save-info-doctor`, data)
}
const getDetailInfoDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`)
}
const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-save-schedule`, data)
}
const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}
const getExtraInfoDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const postPatientBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}
const verifyBookingAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}
const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}
const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`)
}
const getAllSpecialtyById = (id) => {
    return axios.get(`/api/get-specialty-by-id?id=${id}`)
}
const editSpecialtyById = (data) => {
    return axios.put(`/api/edit-specialty-by-id`, data)
}
const deleteSpecialty = (inputId) => {
    return axios.delete(`/api/delete-specialty-by-id`, { data: { id: inputId } })
}
const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}
const getAllClinic = () => {
    return axios.get(`/api/get-clinic`)
}
const getDetailClinicById = (data) => {
    return axios.get(`/api/get-clinic-by-id?id=${data.id}`)
}
const deleteClinic = (inputId) => {
    return axios.delete(`/api/delete-clinic-by-id`, { data: { id: inputId } })
}
const getAllClinicById = (id) => {
    return axios.get(`/api/get-clinic-manage-by-id?id=${id}`)
}
const editClinicById = (data) => {
    return axios.put(`/api/edit-clinic-by-id`, data)
}
const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}
const postSendremedy = (data) => {
    return axios.post('/api/send-remedy', data)
}
const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook', data)
}
const getAllHandbook = () => {
    return axios.get(`/api/get-all-handbook`)
}
const getDetailHandbookById = (id) => {
    return axios.get(`/api/get-handbook-by-id?id=${id}`)
}
const editHandbookById = (data) => {
    return axios.put(`/api/edit-handbook-by-id`, data)
}
const deleteHandbook = (inputId) => {
    return axios.delete(`/api/delete-handbook-by-id`, { data: { id: inputId } })
}
const createParkage = (data) => {
    return axios.post('/api/create-parkage', data)
}
const getAllParkage = () => {
    return axios.get(`/api/get-all-parkage`)
}
const getParkageByClinic = (id) => {
    return axios.get(`/api/get-parkage-by-clinicId?clinicId=${id}`)
}
const deleteParkage = (inputId) => {
    return axios.delete(`/api/delete-parkage-by-id`, { data: { id: inputId } })
}
const getParkageById = (id) => {
    return axios.get(`/api/get-parkage-by-id?id=${id}`)
}
const editParkageById = (data) => {
    return axios.put(`/api/edit-parkage-by-id`, data)
}
const postPatientBookAppointmentParkage = (data) => {
    return axios.post('/api/patient-book-appointment-parkage', data)
}
const verifyBookAppointmentParkage = (data) => {
    return axios.post('/api/verify-book-appointment-parkage', data)
}
const getSearchParkage = (q) => {
    return axios.get(`/api/search-parkage?q=${q}`)
}
const getParkageBySelectionProvinceId = (data) => {
    return axios.get(`/api/get-parkage-by-selection?provinceId=${data.provinceId}`)
}
const getParkageBySelectioncategoryId = (data) => {
    return axios.get(`/api/get-parkage-by-selection-category?categoryId=${data.categoryId}`)
}
const getParkageBySelectionPriceId = (data) => {
    return axios.get(`/api/get-parkage-by-selection-price?priceId=${data.priceId}`)
}
const getParkageBySelectionClinicId = (data) => {
    return axios.get(`/api/get-parkage-by-selection-clinic?clinicId=${data.clinicId}`)
}
const getAllPatientForParkage = (data) => {
    return axios.get(`/api/get-list-patient-parkage?parkageId=${data.parkageId}&date=${data.date}`)
}
const postSendremedyParkage = (data) => {
    return axios.post('/api/send-remedy-parkage', data)
}
export {
    handleLoginApi, getAllUsers, createNewUserAPI,
    deleteUserAPI, editUserAPI, getallcodeServive, getTopDoctorHomeService,
    getAllDoctors, createDetailDoctor, getDetailInfoDoctor,
    saveBulkScheduleDoctor, getScheduleDoctorByDate,
    getExtraInfoDoctorById, getProfileDoctorById,
    postPatientBookAppointment, verifyBookingAppointment,
    createNewSpecialty, getAllSpecialty, getAllDetailSpecialtyById,
    createNewClinic, getAllClinic, getDetailClinicById,
    getAllPatientForDoctor, postSendremedy,
    deleteSpecialty, getAllSpecialtyById,
    editSpecialtyById, deleteClinic, getAllClinicById,
    editClinicById, createNewHandbook, getAllHandbook,
    getDetailHandbookById, editHandbookById,
    deleteHandbook, createParkage, getAllParkage,
    getParkageByClinic, deleteParkage, getParkageById,
    editParkageById, postPatientBookAppointmentParkage,
    verifyBookAppointmentParkage,
    getSearchParkage, getParkageBySelectionProvinceId,
    getParkageBySelectioncategoryId, getParkageBySelectionPriceId,
    getParkageBySelectionClinicId, getAllPatientForParkage,
    postSendremedyParkage,
}