import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import NumberFormat from 'react-number-format';
import { getParkageById } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';

class ParkageExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {}
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getParkageById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }
    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getParkageById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }
    handleShowHideInfo = (status) => {
        this.setState({
            isShowDetailInfo: status
        })
    }
    render() {
        let { isShowDetailInfo, extraInfo } = this.state
        let { language } = this.props
        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='patient.extra-info-doctor.text-address' />
                    </div>
                    <div className='name-clinic'>
                        {extraInfo && extraInfo.name ? extraInfo.name : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfo && extraInfo.address ? extraInfo.address : ''}
                    </div>
                </div>
                <div className='content-down'>
                    {isShowDetailInfo === false &&
                        <div className='short-info'>
                            <FormattedMessage id='patient.extra-info-doctor.price' />
                            {extraInfo && extraInfo.priceIdData && language === LANGUAGE.VI &&
                                < NumberFormat
                                    className='currency'
                                    value={extraInfo.priceIdData.valueVi}
                                    displayType='text'
                                    thousandSeparator={true}
                                    suffix='VND'
                                />
                            }
                            {extraInfo && extraInfo.priceIdData && language === LANGUAGE.EN &&
                                < NumberFormat
                                    className='currency'
                                    value={extraInfo.priceIdData.valueEn}
                                    displayType='text'
                                    thousandSeparator={true}
                                    suffix='USD'
                                />
                            }
                            <span onClick={() => { this.handleShowHideInfo(true) }}><FormattedMessage id='patient.extra-info-doctor.see-more' /></span>
                        </div>
                    }
                    {isShowDetailInfo === true &&
                        <>
                            <div className='title-price'><FormattedMessage id='patient.extra-info-doctor.price' /></div>
                            <div className='detail-info'>
                                <div className='price'>
                                    <span className='left'><FormattedMessage id='patient.extra-info-doctor.price' /></span>
                                    <span className='right'>
                                        {extraInfo && extraInfo.priceIdData && language === LANGUAGE.VI &&
                                            < NumberFormat
                                                className='currency'
                                                value={extraInfo.priceIdData.valueVi}
                                                displayType='text'
                                                thousandSeparator={true}
                                                suffix='VND'
                                            />
                                        }
                                        {extraInfo && extraInfo.priceIdData && language === LANGUAGE.EN &&
                                            < NumberFormat
                                                className='currency'
                                                value={extraInfo.priceIdData.valueEn}
                                                displayType='text'
                                                thousandSeparator={true}
                                                suffix='USD'
                                            />
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => { this.handleShowHideInfo(false) }}><FormattedMessage id='patient.extra-info-doctor.hide' /></span>
                            </div>
                        </>
                    }
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ParkageExtraInfo);
