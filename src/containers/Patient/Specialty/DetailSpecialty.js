import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import HeaderHomePage from '../../../containers/HomePage/HeaderHomePage'
import './DetailSpecialty.scss'
import DoctorSchedule from '../Doctor/DoctorSchedule'
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo'
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getallcodeServive, getAllDetailSpecialtyById } from '../../../services/userService'
import _ from 'lodash';


class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            dataDetailSpecialty: {},
            listProvince: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: 'ALL'
            })
            let resProvince = await getallcodeServive("PROVINCE")
            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data
                let arrDoctors = []
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctors.push(item.doctorId)
                        })
                    }
                }
                let dataProvince = resProvince.data
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createAt: null,
                        keyMap: 'ALL',
                        type: "PROVINCE",
                        valueVi: "Toàn Quốc",
                        valueEn: "ALL"
                    })
                }
                this.setState({
                    arrDoctors: arrDoctors,
                    listProvince: dataProvince ? dataProvince : [],
                    dataDetailSpecialty: res.data
                })
            }
        }
    }
    handleOnchangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let location = event.target.value
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: location
            })
            if (res && res.errCode === 0) {
                let data = res.data
                let arrDoctors = []
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctors.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    arrDoctors: arrDoctors,
                    dataDetailSpecialty: res.data
                })
            }
        }
    }
    render() {
        let { arrDoctors, listProvince, dataDetailSpecialty } = this.state
        let { language } = this.props
        return (
            <>
                <div className='detail-specialty-container'>
                    <HeaderHomePage />
                    <div className='detail-specialty-body'>
                        <div className='description-specialty'>
                            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty)
                                && <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}>
                                </div>
                            }
                        </div>
                        <div className='search-sp-doctor'>
                            <select onChange={(event) => { this.handleOnchangeSelect(event) }}>
                                {
                                    listProvince && listProvince.length > 0 &&
                                    listProvince.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        {arrDoctors && arrDoctors.length > 0 &&
                            arrDoctors.map((item, index) => {
                                return (
                                    <div className='each-doctor' key={index}>
                                        <div className='dt-content-left'>
                                            <div className='profile-doctor'>
                                                <ProfileDoctor
                                                    doctorId={item}
                                                    isShowDescriptionDoctor={true}
                                                    isShowLinkDetail={true}
                                                    isShowPrice={false}
                                                />
                                            </div>
                                        </div>
                                        <div className='dt-content-right'>
                                            <div className='doctor-schedule'>
                                                <DoctorSchedule
                                                    doctorIdFromParent={item}
                                                />
                                            </div>
                                            <div className='doctor-extra-info'>
                                                <DoctorExtraInfo
                                                    doctorIdFromParent={item}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
