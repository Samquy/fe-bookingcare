import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import './ManagePatient.scss'
import { getAllPatientForDoctor, postSendremedy } from '../../../services/userService'
import moment from 'moment';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import RemedyModal from './RemedyModal';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
        this.getDataPatient()
    }
    getDataPatient = async () => {
        let { userInfo } = this.props
        let { currentDate } = this.state
        let formatDate = new Date(currentDate).getTime()
        let res = await getAllPatientForDoctor({
            doctorId: userInfo.id,
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
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state
        let { language } = this.props
        console.log('check', dataPatient);
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading'
                >
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Qu???n L?? b???nh nh??n kh??m b???nh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Ch???n ng??y kh??m</label>
                                <DatePicker
                                    className='form-control'
                                    value={this.state.currentDate}
                                    onChange={this.handleOnchangeDatePicker}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Th???i Gian</th>
                                            <th>H??? v?? T??n</th>
                                            <th>?????a ch???</th>
                                            <th>Gi???i T??nh</th>
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
                                                    <td>
                                                        <button className='mp-btn-confirm'
                                                            onClick={() => { this.handleBtnConfirm(item) }}
                                                        >
                                                            X??c nh???n
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }) :
                                            <tr>
                                                <td colSpan='6' style={{ textAlign: 'center' }}>Kh??ng c?? b???nh nh??n ?????t</td>
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
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
