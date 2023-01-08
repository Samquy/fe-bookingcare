import React, { Component } from 'react';
import * as actions from "../../../store/actions";
import { connect } from 'react-redux';
import { LANGUAGE, CRUD_ACTIONS } from '../../../utils/constant';
import './ManagePatientAdmin.scss';
import Select from 'react-select'
import { getAllPatientForDoctor, postSendremedy } from '../../../services/userService.js'
import DatePicker from '../../../components/Input/DatePicker';
import { FormattedMessage } from 'react-intl';
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import RemedyModal from '../Doctor/RemedyModal';
import moment from 'moment';

class ManagePatientAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoctor: '',
            listDoctors: [],

            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
            doctorId: ''
        }
    }
    async componentDidMount() {
        this.props.fetchAllDoctor()
        this.getDataPatient()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect
            })
        }
    }
    buildDataInputSelect = (inputData, type) => {
        let result = []
        let language = this.props.language
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.firstName} ${item.lastName}`
                    let labelEn = `${item.lastName} ${item.firstName}`
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn
                    object.value = item.id
                    result.push(object)
                })
            }
        }
        return result
    }
    handleChange = (selectedDoctor) => {
        let doctorId = selectedDoctor.value
        this.setState({
            selectedDoctor: selectedDoctor,
            doctorId: doctorId
        }, async () => {
            await this.getDataPatient()
        })
    };
    getDataPatient = async () => {
        let { currentDate, doctorId } = this.state
        let formatDate = new Date(currentDate).getTime()
        let res = await getAllPatientForDoctor({
            doctorId: doctorId,
            date: formatDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }
    handleOnchangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }
    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patienId: item.patienId,
            timeType: item.timeType,
            email: item.patientData.email,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        }, async () => {
            await this.getDataPatient()
        })
    }
    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }
    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state
        this.setState({
            isShowLoading: true
        })
        let res = await postSendremedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patienId: dataModal.patienId,
            timeType: dataModal.timeType,
            patientName: dataModal.patientName,
            language: this.props.language,
        })
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy Success')
            this.closeRemedyModal()
            await this.getDataPatient()
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something Wrong')
        }
    }
    render() {
        let { listDoctors } = this.state
        let { allDoctors, allRequiredDoctorInfo } = this.props
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading'
                >
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quản Lý bệnh nhân khám bệnh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    className='form-control'
                                    value={this.state.currentDate}
                                    onChange={this.handleOnchangeDatePicker}
                                />
                            </div>
                            <div className='col-4 form-group '>
                                <label><FormattedMessage id='admin.manage-doctor.select-doctor' /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChange}
                                    options={this.state.listDoctors}
                                    placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor' />}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời Gian</th>
                                            <th>Họ và Tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới Tính</th>
                                            <th>Lý do khám</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ? dataPatient.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.timeTypeDataPatient.valueVi}</td>
                                                    <td>{item.patientData.firstName}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{item.patientData.genderData.valueVi}</td>
                                                    <td>{item.reason}</td>
                                                    <td>
                                                        <button className='mp-btn-confirm'
                                                            onClick={() => { this.handleBtnConfirm(item) }}
                                                        >
                                                            Xác nhận
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }) :
                                            <tr>
                                                <td colSpan='6' style={{ textAlign: 'center' }}>Không có bệnh nhân đặt</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>
        )
    }

}
const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};
const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatientAdmin);
