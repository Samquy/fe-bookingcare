import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";
import { LANGUAGE } from '../../../../utils';
import './BookingModal.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash'
import DatePicker from '../../../../components/Input/DatePicker';
import Select from 'react-select'
import { toast } from 'react-toastify'
import { postPatientBookAppointment } from '../../../../services/userService'
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';



class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
            fullName: '',
            address: '',
            phoneNumber: '',
            email: '',
            genders: '',
            selectedGender: '',
            reason: '',
            birthday: '',
            doctorId: '',
            timeType: '',
            isShowLoading: false,

        }
    }
    componentDidMount() {
        this.props.FetchGenderStart()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (prevProps.dataTime !== this.props.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId
                let timeType = this.props.dataTime.timeType
                console.log('chekc timetype', this.props.dataTime.timeType);
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }
    buildDataGender = (data) => {
        let result = []
        let { language } = this.props
        if (data && data.length > 0) {
            data.map(item => {
                let object = {}
                object.label = language === LANGUAGE.VI ? item.valueVi : item.valueEn
                object.value = item.keyMap
                result.push(object)
            })
        }
        return result
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    handleOnchangeDatepicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }
    handleOnchangeSelect = (selectOption) => {
        this.setState({
            selectedGender: selectOption
        })
    }
    buildTimeData = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGE.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language === LANGUAGE.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd MM/DD/YYYY')

            return `${time} - ${date}`
        }

    }
    handleConfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeData(this.props.dataTime)
        this.setState({
            isShowLoading: true
        })
        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            selectedGender: this.state.selectedGender.value,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            timeString: timeString,
            language: this.props.language
        })
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success("Booking Appointment succeed")
            this.props.closeBookingModal()
        } else {
            toast.error("Something Wrong")
        }
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props
        let doctorId = ''
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId
        }
        let { timeString } = this.state
        console.log('check datatime accx', dataTime);
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading'
                >
                    <Modal
                        isOpen={isOpenModal}
                        className={'booking-modal-container'}
                        size='lg'
                        centered
                        toggle={closeBookingModal}
                    >

                        <div className='booking-modal-container'>
                            <ModalHeader toggle={closeBookingModal}>
                                <div className='booking-modal-header'>
                                    <span className='left'>
                                        <FormattedMessage id='booking-modal.title' />
                                    </span>
                                    {/* <span className='right'
                                onClick={closeBookingModal}
                            ></span> */}
                                </div>
                            </ModalHeader>

                            <ModalBody>
                                <div className='booking-modal-body'>
                                    <div className='doctor-info'>
                                    </div>
                                    <div className='price'>
                                        <ProfileDoctor
                                            doctorId={doctorId}
                                            dataTime={dataTime}
                                            isShowDescriptionDoctor={false}
                                            isShowLinkDetail={false}
                                            isShowPrice={true}
                                        />
                                    </div>
                                    <div className='row'>
                                        <div className='col-6 form-group'>
                                            <label><FormattedMessage id='booking-modal.fullname' /></label>
                                            <input className='form-control'
                                                value={this.state.fullName}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'fullName') }}
                                            />
                                        </div>
                                        <div className='col-3 form-group'>
                                            <label><FormattedMessage id='booking-modal.gender' /></label>
                                            <Select
                                                value={this.state.selectedGender}
                                                options={this.state.genders}
                                                onChange={this.handleOnchangeSelect}
                                            />
                                        </div>
                                        <div className='col-3 form-group'>
                                            <label><FormattedMessage id='booking-modal.birthday' /></label>
                                            <DatePicker
                                                className={'form-control'}
                                                value={this.state.birthday}
                                                onChange={this.handleOnchangeDatepicker}
                                            />
                                        </div>
                                        <div className='col-6 form-group'>
                                            <label>Email</label>
                                            <input className='form-control'
                                                value={this.state.email}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'email') }}
                                            />
                                        </div>
                                        <div className='col-6 form-group'>
                                            <label><FormattedMessage id='booking-modal.phonenumber' /></label>
                                            <input className='form-control'
                                                value={this.state.phoneNumber}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'phoneNumber') }}
                                            />
                                        </div>
                                        <div className='col-12 form-group'>
                                            <label><FormattedMessage id='booking-modal.address' /></label>
                                            <input className='form-control'
                                                value={this.state.address}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'address') }}
                                            />
                                        </div>
                                        <div className='col-12 form-group'>
                                            <label><FormattedMessage id='booking-modal.reasonbooking' /></label>
                                            <input className='form-control'
                                                value={this.state.reason}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'reason') }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        </div>
                        <ModalFooter>
                            <Button color="primary" className='px-3' onClick={() => { this.handleConfirmBooking() }}>
                                <FormattedMessage id='booking-modal.btnConfirm' />
                            </Button>
                            <Button color="secondary" className='px-3' onClick={closeBookingModal}>
                                <FormattedMessage id='booking-modal.btncancel' />
                            </Button>
                        </ModalFooter>
                    </Modal>
                </LoadingOverlay>
            </>
        )

    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        genders: state.admin.genders

    };
};

const mapDispatchToProps = dispatch => {
    return {
        FetchGenderStart: () => dispatch(actions.FetchGenderStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
