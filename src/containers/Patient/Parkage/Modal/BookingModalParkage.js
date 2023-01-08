import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";
import { LANGUAGE } from '../../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ProfileParkage from './ProfileParkage';
import _ from 'lodash'
import DatePicker from '../../../../components/Input/DatePicker';
import Select from 'react-select'
import { toast } from 'react-toastify'
import { postPatientBookAppointmentParkage } from '../../../../services/userService'
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModalParkage extends Component {
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
            parkageId: '',
            timeType: '',
            isShowLoading: false,
            date: '',
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
                let timeType = this.props.dataTime.keyMap
                this.setState({
                    timeType: timeType
                })
            }
        }
        if (prevProps.parkageId !== this.props.parkageId) {
            let parkageId = this.props.parkageId
            this.setState({
                parkageId: parkageId,
            })
        }
        if (prevProps.date !== this.props.date) {
            let date = this.props.date
            this.setState({
                date: date
            })
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
    buildTimeData = (dataTime, date) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGE.VI ? dataTime.valueVi : dataTime.valueEn
            let timeString = language === LANGUAGE.VI ?
                moment.unix(+date / 1000).format('dddd DD/MM/YYYY')
                :
                moment.unix(+date / 1000).locale('en').format('ddd MM/DD/YYYY')

            return `${time} - ${timeString}`
        }

    }
    handleConfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeData(this.props.dataTime, this.state.date)
        this.setState({
            isShowLoading: true
        })
        let res = await postPatientBookAppointmentParkage({
            fullName: this.state.fullName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            selectedGender: this.state.selectedGender.value,
            reason: this.state.reason,
            date: this.state.date,
            birthday: date,
            parkageId: this.state.parkageId,
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
            console.log(res);
        }
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime, parkageId, } = this.props
        let { timeString, date } = this.state
        console.log('check timestring', date)
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
                                        <ProfileParkage
                                            parkageId={parkageId}
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingModalParkage);
