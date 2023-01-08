import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HeaderHomePage.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE } from '../../utils';
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom'
import * as actions from "../../store/actions";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select'


const { Option } = components;
// const IconOption = props => (
//     <Option {...props}>
//         <img
//             src={require('./' + props.data.image)}
//             style={{ width: 36 }}
//             alt={props.data.label}
//         />
//         {props.data.label}
//     </Option>
// );

class HeaderHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            listClinic: [],
            listSpecialty: [],
            listDoctors: [],
            selectedOption: '',
        }
    }
    componentDidMount() {
        this.props.getAllRequiredDoctorInfo()
        this.props.fetchAllDoctor()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataClinic = this.buildDataInputSelect(resClinic, 'CLINIC')
            this.setState({
                listSpecialty: dataSpecialty,
                listClinic: dataClinic
            })
        }
    }
    buildDataInputSelect = (inputData, type) => {
        let result = []
        let language = this.props.language
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.firstName} ${item.lastName}`
                    let labelEn = `${item.lastName} ${item.firstName}`
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn
                    object.value = item.id
                    object.type = 'USERS'
                    object.image = item.image
                    result.push(object)
                })
            }
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
                    object.image = item.image
                    object.type = 'SPECIALTY'
                    result.push(object)
                })
            }
            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
                    object.image = item.image
                    object.type = 'CLINIC'
                    result.push(object)
                })
            }

        }
        return result
    }
    changLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }
    directToSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/Listing-specialty`)
        }
    }
    directToClinic = () => {
        if (this.props.history) {
            this.props.history.push(`/listing-clinic`)
        }
    }
    directToDoctor = () => {
        if (this.props.history) {
            this.props.history.push(`/listing-doctor`)
        }
    }
    directToParkage = () => {
        if (this.props.history) {
            this.props.history.push(`/listing-parkage`)
        }
    }
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/5`)
        }
    }
    handleViewDetailSpecialty2 = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/6`)
        }
    }
    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }
    // handleChange = (selectedOption) => {
    //     this.setState({ selectedOption }, () =>
    //       console.log(`Option selected:`, this.state.selectedOption)
    //     );
    //   };
    handleChange = (selectedOption) => {
        if (selectedOption.type === 'SPECIALTY') {
            this.props.history.push(`/detail-specialty/${selectedOption.value}`)
        }
        if (selectedOption.type === 'CLINIC') {
            this.props.history.push(`/detail-clinic/${selectedOption.value}`)
        }
        if (selectedOption.type === 'USERS') {
            this.props.history.push(`/detail-doctor/${selectedOption.value}`)
        }
    }

    render() {
        let language = this.props.language
        let { dropdownOpen, selectedOption, listSpecialty, listClinic, listDoctors } = this.state
        const groupedOptions = [
            {
                label: <FormattedMessage id='headerhomepage.speciality' />,
                options: listSpecialty,
            },
            {
                label: <FormattedMessage id='headerhomepage.health-facility' />,
                options: listClinic
            },
            {
                label: <FormattedMessage id='headerhomepage.doctor' />,
                options: listDoctors
            }
        ];
        return (
            <>
                <div className='Header-Container'>
                    <div className='Header-Content'>
                        <div className='Left-Content'  >
                            <div className="d-flex">
                                <div className='dropdown'>
                                    <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                                        <DropdownToggle >
                                            <button ><i className="fas fa-bars" ></i></button>
                                        </DropdownToggle>
                                        <DropdownMenu >
                                            <DropdownItem header>Menu</DropdownItem>
                                            <DropdownItem onClick={() => { this.directToSpecialty() }} ><FormattedMessage id='headerhomepage.speciality' /></DropdownItem>
                                            <DropdownItem onClick={() => { this.directToClinic() }}><FormattedMessage id='headerhomepage.health-facility' /></DropdownItem>
                                            <DropdownItem onClick={() => { this.directToDoctor() }}><FormattedMessage id='headerhomepage.doctor' /></DropdownItem>
                                            <DropdownItem onClick={() => { this.directToParkage() }}><FormattedMessage id='headerhomepage.fee' /></DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className='Header-Logo' onClick={() => { this.returnToHome() }}>
                            </div>
                        </div>
                        <div className='Center-Content'>
                            <div className='Child-Content' onClick={() => { this.directToSpecialty() }} >
                                <div><b><FormattedMessage id='headerhomepage.speciality' /></b></div>
                                <div className='sub-title'><FormattedMessage id='headerhomepage.searchdoctor' /></div>
                            </div>
                            <div className='Child-Content' onClick={() => { this.directToClinic() }}>
                                <div><b><FormattedMessage id='headerhomepage.health-facility' /></b></div>
                                <div className='sub-title'>< FormattedMessage id='headerhomepage.select-room' /></div>
                            </div>
                            <div className='Child-Content' onClick={() => { this.directToDoctor() }}>
                                <div><b><FormattedMessage id='headerhomepage.doctor' /></b></div>
                                <div className='sub-title'><FormattedMessage id='headerhomepage.select-doctor' /></div>
                            </div>
                            <div className='Child-Content' onClick={() => { this.directToParkage() }}>
                                <div><b><FormattedMessage id='headerhomepage.fee' /></b></div>
                                <div className='sub-title'><FormattedMessage id='headerhomepage.health-check' /></div>
                            </div>
                        </div>
                        <div className='Right-Content'>
                            <div className='support' ><i className="fas fa-question"></i><FormattedMessage id='headerhomepage.support' /></div>
                            <div className={language === LANGUAGE.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => { this.changLanguage(LANGUAGE.VI) }}>VN</span></div>
                            <div className={language === LANGUAGE.EN ? 'language-en active' : 'language-en'}><span onClick={() => { this.changLanguage(LANGUAGE.EN) }}>EN</span></div>
                        </div>
                    </div>
                </div>
                {
                    this.props.isShowBanner === true &&
                    <div className='home-banner'>
                        <div className='content-up'>
                            <div className='title-banner1'><FormattedMessage id='banner.title1' /></div>
                            <div className='title-banner2'><FormattedMessage id='banner.title2' /></div>
                            <div className='search'>
                                <i className="fas fa-search"></i>
                                {/* <input type='text' placeholder='Search' /> */}
                                <Select
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={groupedOptions}
                                    placeholder={'Search'}
                                    isSearchable={true}
                                    isLoading={true}
                                // components={{ Option: IconOption(groupedOptions) }}
                                />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='option'>
                                <div className='option-child' onClick={() => { this.directToSpecialty() }}>
                                    <div className='icon-child'><i className="far fa-hospital"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.icon1' /></div>
                                </div>
                                <div className='option-child' onClick={() => { this.directToClinic() }}>
                                    <div className='icon-child'><i className="fas fa-mobile"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.icon2' /></div>
                                </div>
                                <div className='option-child' onClick={() => { this.directToClinic() }}>
                                    <div className='icon-child'><i className="fas fa-user-md"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.icon3' /></div>
                                </div>
                                <div className='option-child' onClick={() => { this.directToClinic() }}>
                                    <div className='icon-child'><i className="fas fa-stethoscope"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.icon4' /></div>
                                </div>
                                <div className='option-child' onClick={() => { this.handleViewDetailSpecialty() }}>
                                    <div className='icon-child'><i className="fas fa-medkit"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.icon5' /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child' onClick={() => { this.handleViewDetailSpecialty2() }}><i className="fas fa-user-md"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.icon6' /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        )

    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (languageData) => dispatch(changeLanguageApp(languageData)),
        getAllRequiredDoctorInfo: () => dispatch(actions.getAllRequiredDoctorInfo()),
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderHomePage));
