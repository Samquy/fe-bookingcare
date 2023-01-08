import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import 'react-markdown-editor-lite/lib/index.css';
import moment from 'moment/moment';
// import './ParkageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import BookingModalParkage from './Modal/BookingModalParkage'

class ParkageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
            parkageId: '',
            allDays: [],
            date: '',
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        let allDays = this.getArrDays()
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            // let { parkageId } = this.state
            this.setState({
                parkageId: this.props.doctorIdFromParent,
                allDays: allDays
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let res = this.props.allScheduleTime
            this.setState({
                allAvailableTime: res
            })
        }
        if (prevProps.language !== this.props.language) {
            this.setState({
                allDays: allDays
            })
        }
    }
    async componentDidMount() {
        this.props.fetchAllScheduleTime()
        let allDays = this.getArrDays()
        this.setState({
            parkageId: this.props.doctorIdFromParent
        })
        this.setState({
            allDays: allDays
        })
    }
    getArrDays = () => {
        let allDays = []
        for (let i = 0; i < 7; i++) {
            let object = {};
            object.label = moment(new Date()).add(i, 'days').format('dddd - DD/MM')
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf()
            allDays.push(object)
        }
        return allDays
    }
    handleOnchangeSelect = (event) => {
        let date = event.target.value
        this.setState({
            date: date
        })
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }
    handleCloseModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let { allAvailableTime, isOpenModalBooking, dataScheduleTimeModal, parkageId, allDays, date } = this.state
        let { language } = this.props
        console.log('check', date);
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => { this.handleOnchangeSelect(event) }}>

                            {allDays && allDays.length > 0 && allDays.map((item, index) => {
                                return (
                                    <option
                                        // defaultValue={allDays[0].value}
                                        value={item.value}
                                        key={index}
                                    >
                                        {item.label}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='title-calendar'>
                            <i className='fas fa-calendar-alt'><span>
                                <FormattedMessage id='patient.doctor-detail.schedule' /></span></i>
                        </div>
                        <div className='time-content'>
                            {allAvailableTime && allAvailableTime.length > 0 ?
                                <>
                                    <div className='time-content-btns'>
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay = language === LANGUAGE.VI ? item.valueVi : item.valueEn
                                            return (
                                                <button key={index}
                                                    className={language === LANGUAGE.VI ? 'btn-vi' : 'btn-en'}
                                                    onClick={() => { this.handleClickScheduleTime(item) }}
                                                >{timeDisplay}
                                                </button>
                                            )
                                        })
                                        }
                                    </div>
                                    <div className='book-free'>
                                        <span>
                                            <FormattedMessage id='patient.doctor-detail.choose' />
                                            <i className='far fa-hand-point-up'></i>
                                            <FormattedMessage id='patient.doctor-detail.book-free' />
                                        </span>
                                    </div>
                                </>
                                : <div className='no-schedule'>
                                    <FormattedMessage id='patient.doctor-detail.no-schedule' />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModalParkage
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.handleCloseModal}
                    dataTime={dataScheduleTimeModal}
                    parkageId={parkageId}
                    date={date}
                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // fetchDetailDoctor: (id) => dispatch(actions.fetchDetailDoctor(id))
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkageSchedule);
