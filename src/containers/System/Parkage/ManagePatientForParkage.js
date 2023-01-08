import React, { Component } from 'react';
import * as actions from "../../../store/actions";
import { connect } from 'react-redux';
import { LANGUAGE, CRUD_ACTIONS } from '../../../utils/constant';
import Select from 'react-select'
import { getAllParkage, getAllPatientForParkage, postSendremedyParkage } from '../../../services/userService.js'
import DatePicker from '../../../components/Input/DatePicker';
import { FormattedMessage } from 'react-intl';
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import RemedyModal from '../Doctor/RemedyModal';
import moment from 'moment';

class ManagePatientForParkage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedParkage: '',
            listParkages: [],
            allParkages: [],
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
            parkageId: ''
        }
    }
    async componentDidMount() {
        let res = await getAllParkage()
        if (res && res.errCode === 0) {
            this.setState({
                allParkages: res.data
            })
            let { allParkages } = this.state
            let dataSelect = this.buildDataInputSelect(allParkages, 'PARKAGE')
            this.setState({
                listParkages: dataSelect
            })
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevState.allParkages !== this.state.allParkages) {
        //     let { allParkages } = this.state
        //     let dataSelect = this.buildDataInputSelect(allParkages, 'PARKAGE')
        //     this.setState({
        //         listParkages: dataSelect
        //     })
        // }
    }
    buildDataInputSelect = (inputData, type) => {
        let result = []
        let language = this.props.language
        if (inputData && inputData.length > 0) {
            if (type === 'PARKAGE') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
                    result.push(object)
                })
            }
        }
        return result
    }
    handleChange = (selectedParkage) => {
        let parkageId = selectedParkage.value
        this.setState({
            selectedParkage: selectedParkage,
            parkageId: parkageId
        }, async () => {
            await this.getDataPatient()
        })
    };
    getDataPatient = async () => {
        let { currentDate, parkageId } = this.state
        let formatDate = new Date(currentDate).getTime()
        let res = await getAllPatientForParkage({
            parkageId: parkageId,
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
            parkageId: item.parkageId,
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
        let res = await postSendremedyParkage({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            parkageId: dataModal.parkageId,
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
        let { listParkages } = this.state
        let { dataPatient, isOpenRemedyModal, dataModal, allParkages } = this.state
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
                                <label>{'Chọn gói khám'}</label>
                                <Select
                                    value={this.state.selectedParkage}
                                    onChange={this.handleChange}
                                    options={this.state.listParkages}
                                    placeholder={'Chọn Gói khám'}
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
        language: state.app.language,
    };
};
const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatientForParkage);
