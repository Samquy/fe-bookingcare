import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";
import { LANGUAGE } from '../../../../utils';
import { getParkageById } from '../../../../services/userService'
import NumberFormat from 'react-number-format';
import _ from 'lodash'
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom'


class ProfileParkage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.parkageId !== prevProps.parkageId) {
            let id = this.props.parkageId
            let res = await getParkageById(id)
            this.setState({
                dataProfile: res.data
            })
        }
    }
    async componentDidMount() {
        let res = await getParkageById(this.props.parkageId)
        this.setState({
            dataProfile: res.data
        })
    }
    // getInfoParkage = async (id) => {
    //     let result = {}
    //     if (id) {
    //         let res = await getParkageById(id)
    //         if (res && res.errCode === 0) {
    //             result = res.data
    //         }
    //     }
    //     return result
    // }
    renderTimeBooking = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGE.VI ? dataTime.valueVi : dataTime.valueEn
            return (
                <>
                    <div>{time}</div>
                    <div><FormattedMessage id='patient.doctor-detail.book-free' /></div>
                </>
            )

        } return <></>
    }
    render() {
        let { dataProfile } = this.state
        console.log('check dataprofile', dataProfile);
        let { language, isShowDescriptionDoctor, dataTime, isShowPrice, isShowLinkDetail } = this.props
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {dataProfile.name}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.description &&
                                        <span>{dataProfile.description}</span>
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
                        <Link to={`/detail-parkage/${dataProfile.id}`}>
                            <button className='btn btn-outline-secondary'>Xem thêm</button>
                        </Link>
                    </div>
                }
                {isShowPrice === true &&
                    <div className='price'>
                        <FormattedMessage id='patient.extra-info-doctor.price' />
                        <span> : </span>
                        {dataProfile && dataProfile.priceIdData && language === LANGUAGE.VI &&
                            < NumberFormat
                                className='currency'
                                value={dataProfile.priceIdData.valueVi}
                                displayType='text'
                                thousandSeparator={true}
                                suffix='VND'
                            />
                        }
                        {dataProfile && dataProfile.priceIdData && language === LANGUAGE.EN &&
                            < NumberFormat
                                className='currency'
                                value={dataProfile.priceIdData.valueEn}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileParkage);
