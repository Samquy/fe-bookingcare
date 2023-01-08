import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import HeaderHomePage from '../../HomePage/HeaderHomePage';
import _ from 'lodash'
import { getDetailClinicById } from '../../../services/userService';
import DoctorSchedule from '../Doctor/DoctorSchedule'
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo'
import ProfileDoctor from '../Doctor/ProfileDoctor';


class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            dataDetailClinic: {},
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let res = await getDetailClinicById({
                id: id,
            })
            if (res && res.errCode === 0) {
                let data = res.data
                let arrDoctors = []
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctors.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    arrDoctors: arrDoctors,
                    dataDetailClinic: res.data
                })
            }
        }
    }
    render() {
        let { arrDoctors, dataDetailClinic } = this.state
        let { language } = this.props
        return (
            <>
                <div className='detail-specialty-container'>
                    <HeaderHomePage />
                    <div className='detail-specialty-body'>
                        <div className='description-specialty'>
                            {dataDetailClinic && !_.isEmpty(dataDetailClinic)
                                && <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}>
                                </div>
                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
