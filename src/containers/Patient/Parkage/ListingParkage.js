import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllParkage, getSearchParkage, getParkageBySelectionClinicId, getParkageBySelectionPriceId, getParkageBySelectionProvinceId, getParkageBySelectioncategoryId } from '../../../services/userService'
import { withRouter } from 'react-router'
import HeaderHomePage from '../../HomePage/HeaderHomePage';
import './ListingParkage.scss'
import Select, { components } from 'react-select'
import * as actions from "../../../store/actions";
import { LANGUAGE, CRUD_ACTIONS } from '../../../utils/constant';
import ProfileParkage from './Modal/ProfileParkage';
import ParkageSchedule from './ParkageSchedule';
import ParkageExtraInfo from './ParkageExtraInfo';

class ListingParkage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataParkage: [],
            listPrice: [],
            listCategory: [],
            listProvince: [],
            listClinic: [],

            selectedPrice: '',
            selectedCategory: '',
            selectedProvince: '',
            selectedClinic: '',

            isQuery: false,
            SearchQ: '',
            arrParkage: []

        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevState.selectedProvince !== this.state.selectedProvince) {
        // let provinceId = this.state.selectedProvince.value
        //     let res = await getParkageBySelection({ provinceId: provinceId, categoryId: categoryId, priceId: priceId, clinicId: clinicId })
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             dataParkage: res.data
        //         })
        //     }
        // }
        if (prevState.selectedCategory !== this.state.selectedCategory) {
            let categoryId = this.state.selectedCategory.value
            let res = await getParkageBySelectioncategoryId({ categoryId: categoryId })
            if (res && res.errCode === 0) {
                this.setState({
                    dataParkage: res.data
                })
            }
        }
        if (prevState.selectedPrice !== this.state.selectedPrice) {
            let priceId = this.state.selectedPrice.value
            let res = await getParkageBySelectionPriceId({ priceId: priceId })
            if (res && res.errCode === 0) {
                this.setState({
                    dataParkage: res.data
                })
            }
        }
        if (prevState.selectedClinic !== this.state.selectedClinic) {
            let clinicId = this.state.selectedClinic.value
            let res = await getParkageBySelectionClinicId({ clinicId: clinicId })
            if (res && res.errCode === 0) {
                this.setState({
                    dataParkage: res.data
                })
            }
        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resCategory, resPrice, resProvince, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectCategory = this.buildDataInputSelect(resCategory, 'CATEGORY')
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            let dataClinic = this.buildDataInputSelect(resClinic, 'CLINIC')
            this.setState({
                listPrice: dataSelectPrice,
                listCategory: dataSelectCategory,
                listProvince: dataSelectProvince,
                listClinic: dataClinic,
            })
        }
    }
    async componentDidMount() {
        let res = await getAllParkage()
        if (res && res.errCode === 0) {
            this.setState({
                dataParkage: res.data ? res.data : []
            })
        }
    }
    buildDataInputSelect = (inputData, type) => {
        let result = []
        let language = this.props.language
        if (inputData && inputData.length > 0) {
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn} USD`
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if (type === 'CATEGORY' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn}`
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
                    result.push(object)
                })
            }
        }
        return result
    }
    getAllParkageListing = async () => {
        let res = await getAllParkage()
        if (res && res.errCode === 0) {
            this.setState({
                dataParkage: res.data ? res.data : []
            })
        }
    }
    handleViewDetailParkage = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-parkage/${item.id}`)
        }
    }
    handleOnchangeSelect = async (selectedOption, name) => {
        let stateName = name.name
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption
        this.setState({
            ...stateCopy
        }, async () => { await this.handleChangefilter() })
    }
    handleChangefilter = async () => {
        let provinceId = this.state.selectedProvince.value
        let res = await getParkageBySelectionProvinceId({ provinceId: provinceId })
        if (res && res.errCode === 0) {
            this.setState({
                dataParkage: res.data
            })
        }
    }
    handleSearch = async () => {
        let res = await getSearchParkage(this.state.SearchQ)
        if (res && res.errCode === 0) {
            this.setState({
                isQuery: true,
                arrParkage: res.data,
            })
        }
    }
    handleChangeSearch = (event) => {
        let queryS = event.target.value
        this.setState({
            SearchQ: queryS
        })
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleSearch()
        }
    }
    handleClickSearch = () => {
        this.handleSearch()
    }
    handleClear = () => {
        this.setState({
            selectedPrice: '',
            selectedCategory: '',
            selectedProvince: '',
            selectedClinic: '',
            isQuery: false,
            SearchQ: ''
        }, async () => { await this.getAllParkageListing() })
    }
    render() {
        let { dataParkage, isQuery, arrParkage } = this.state
        let { language } = this.props
        // console.log('check this shit', this.state.selectedPrice.value);
        return (
            <>
                <HeaderHomePage />
                <div className='parkage-header-container'>
                    <div className='background-img'>
                        <div className='parkage-title'>
                            <span className='text-parkage'><FormattedMessage id='parkage.title' /></span>
                        </div>
                    </div>
                    <div className='parkage-header-body'>
                        <div className='parkage-up'>
                            <div className='up-search'>
                                <div className='left-s'>
                                    <input
                                        onChange={(event) => { this.handleChangeSearch(event) }}
                                        onKeyDown={(event) => { this.handleKeyDown(event) }}
                                        placeholder='Search'
                                        value={this.state.SearchQ}
                                    />
                                    <span
                                        onClick={() => { this.handleClickSearch() }}
                                    >tim kiem</span>
                                </div>
                            </div>
                            <div className='parkage-select'>
                                <div className='select-form'>
                                    <Select
                                        value={this.state.selectedProvince}
                                        onChange={this.handleOnchangeSelect}
                                        options={this.state.listProvince}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.province' />}
                                        isSearchable={true}
                                        isLoading={true}
                                        name='selectedProvince'
                                    />
                                </div>
                                <div className='select-form'>
                                    <Select
                                        value={this.state.selectedCategory}
                                        onChange={this.handleOnchangeSelect}
                                        options={this.state.listCategory}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.category' />}
                                        isSearchable={true}
                                        isLoading={true}
                                        name='selectedCategory'
                                    />
                                </div>
                                <div className='select-form'>
                                    <Select
                                        value={this.state.selectedPrice}
                                        onChange={this.handleOnchangeSelect}
                                        options={this.state.listPrice}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.price' />}
                                        isSearchable={true}
                                        isLoading={true}
                                        name='selectedPrice'
                                    />
                                </div>
                                <div className='select-form'>
                                    <Select
                                        value={this.state.selectedClinic}
                                        onChange={this.handleOnchangeSelect}
                                        options={this.state.listClinic}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.select-clinic' />}
                                        isSearchable={true}
                                        isLoading={true}
                                        name='selectedClinic'
                                    />
                                </div>
                                <div className='reset-option'
                                    onClick={() => { this.handleClear() }}
                                >
                                    <i className="fas fa-undo-alt"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isQuery === false ?
                    <>
                        <div className='listing-container'>
                            <div className='listing-content'>
                                {dataParkage && dataParkage.length > 0 && dataParkage.map((item, index) => {
                                    let imageBase64 = ''
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                                    }
                                    return (
                                        <>
                                            <div className="card bg-light mb-3" key={index}
                                                onClick={() => { this.handleViewDetailParkage(item) }}
                                            >
                                                <div className="image" onClick={() => { this.handleViewDetailParkage(item) }}
                                                    style={{ backgroundImage: `url(${imageBase64})`, width: ' 278px', height: '150px' }}
                                                >
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title" onClick={() => { this.handleViewDetailParkage(item) }}>{item.name}</h5>
                                                    <div className='d-flex'>
                                                        <div className='p-2 font-weight-bold'><FormattedMessage id='parkage.price' />:</div>
                                                        <div className='ml-auto p-2 font-weight-bold'>
                                                            {language === LANGUAGE.VI ? item.priceIdData.valueVi : item.priceIdData.valueEn}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>

                                    )
                                })}
                            </div>
                        </div>
                    </>
                    :
                    <>
                        {arrParkage && arrParkage.length > 0 &&
                            arrParkage.map((item, index) => {
                                return (
                                    <div className='parkage-container-search'>
                                        <div className='each-parkage' key={index}>
                                            <div className='pk-content-left'>
                                                <div className='profile-doctor'>
                                                    <ProfileParkage
                                                        parkageId={item.id}
                                                        isShowDescriptionDoctor={true}
                                                        isShowLinkDetail={true}
                                                        isShowPrice={false}
                                                    />
                                                </div>
                                            </div>
                                            <div className='dt-content-right'>
                                                <div className='doctor-schedule'>
                                                    <ParkageSchedule
                                                        doctorIdFromParent={item.id}
                                                    />
                                                </div>
                                                <div className='doctor-extra-info'>
                                                    <ParkageExtraInfo
                                                        doctorIdFromParent={item.id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </>
                }

            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllRequiredDoctorInfo: () => dispatch(actions.getAllRequiredDoctorInfo()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListingParkage));
