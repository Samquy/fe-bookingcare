import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import { getProfileDoctorById } from '../../../services/userService'
import NumberFormat from 'react-number-format';
import './ProfileDoctor.scss'
import _ from 'lodash'
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom'


class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (this.props.doctorId !== prevProps.doctorId) {
        //     let data = await this.getProfileDoctorById(this.props.doctorId);
        //     this.setState({
        //         dataProfile: data,
        //     });
        // }
    }
    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }
    getInfoDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }
    renderTimeBooking = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGE.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language === LANGUAGE.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id='patient.doctor-detail.book-free' /></div>
                </>
            )

        } return <></>
    }
    render() {
        let { dataProfile } = this.state
        let { language, isShowDescriptionDoctor, dataTime, isShowPrice, isShowLinkDetail, doctorId } = this.props
        let nameVi = '', nameEn = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.firstName} ${dataProfile.lastName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.lastName} ${dataProfile.firstName}`
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGE.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                        <span>{dataProfile.Markdown.description}</span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }

                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true &&
                    <div className='view-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>
                            <button className='btn btn-outline-secondary'>Xem thêm</button>
                        </Link>
                    </div>
                }
                {isShowPrice === true &&
                    <div className='price'>
                        <FormattedMessage id='patient.extra-info-doctor.price' />
                        <span> : </span>
                        {dataProfile && dataProfile.Doctor_Info && language === LANGUAGE.VI &&
                            < NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Info.priceIdTypeData.valueVi}
                                displayType='text'
                                thousandSeparator={true}
                                suffix='VND'
                            />
                        }
                        {dataProfile && dataProfile.Doctor_Info && language === LANGUAGE.EN &&
                            < NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Info.priceIdTypeData.valueEn}
                                displayType='text'
                                thousandSeparator={true}
                                suffix='USD'
                            />
                        }
                    </div>
                }
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
