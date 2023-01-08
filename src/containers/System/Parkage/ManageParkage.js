import React, { Component } from 'react';
import * as actions from "../../../store/actions";
import { connect } from 'react-redux';
import { LANGUAGE, CRUD_ACTIONS } from '../../../utils/constant';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageParkage.scss';
import Select from 'react-select'
import { deleteParkage, createParkage, getAllParkage, getParkageByClinic, getParkageById, editParkageById } from '../../../services/userService.js'
import { FormattedMessage } from 'react-intl';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import CommonUtils from '../../../utils/CommonUtils'
import { toast } from 'react-toastify';


const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageParkage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            contentMarkdown: '',
            contentHTML: '',
            name: '',
            description: '',
            address: '',
            imageBase64: '',
            //save to doctor info table

            listPrice: [],
            listCategory: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedCategory: '',
            selectedProvince: '',
            selectedClinic: {},
            selectedSpecialty: '',

            previewImgUrl: '',
            action: CRUD_ACTIONS.CREATE,
            isOpen: false,
            allParkage: {},
            clinicParkage: {},
        }
    }
    async componentDidMount() {
        this.props.getAllRequiredDoctorInfo()
        this.getAllParkage_()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let { resCategory } = this.props.allRequiredDoctorInfo
            let dataSelectCategory = this.buildDataInputSelect(resCategory, 'CATEGORY')
            this.setState({
                listCategory: dataSelectCategory,
            })
        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resCategory, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectCategory = this.buildDataInputSelect(resCategory, 'CATEGORY')
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            let dataSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataClinic = this.buildDataInputSelect(resClinic, 'CLINIC')
            this.setState({
                listPrice: dataSelectPrice,
                listCategory: dataSelectCategory,
                listProvince: dataSelectProvince,
                listSpecialty: dataSpecialty,
                listClinic: dataClinic,
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
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
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
    getAllParkage_ = async () => {
        let res = await getAllParkage()
        if (res && res.errCode === 0) {
            this.setState({
                allParkage: res.data,
                action: CRUD_ACTIONS.CREATE
            })
        }
    }
    getParkagebyClinicId = async (selectedClinic) => {
        this.setState({ selectedClinic })
        let { clinicParkage } = this.state
        let res = await getParkageByClinic(selectedClinic.value)
        if (res && res.errCode === 0) {
            this.setState({
                clinicParkage: res.data,
            })
        }
    }
    handleSaveContent = async () => {
        let { action, id } = this.state
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createParkage({
                selectedPrice: this.state.selectedPrice.value,
                selectedProvince: this.state.selectedProvince.value,
                selectedCategory: this.state.selectedCategory.value,
                clinicId: this.state.selectedClinic.value,
                specialtyId: this.state.selectedSpecialty.value,

                contentMarkdown: this.state.contentMarkdown,
                contentHTML: this.state.contentHTML,
                name: this.state.name,
                description: this.state.description,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
            })
            if (res && res.errCode === 0) {
                toast.success("Save Success")
                this.setState({
                    contentMarkdown: '',
                    contentHTML: '',
                    name: '',
                    description: '',
                    address: '',
                    imageBase64: '',
                    previewImgUrl: '',
                    selectedPrice: '',
                    selectedCategory: '',
                    selectedProvince: '',
                    selectedClinic: '',
                    selectedSpecialty: '',
                }, async () => { await this.getAllParkage_() })
            } else {
                toast.error("Something Wrong")
            }
        } if (action === CRUD_ACTIONS.EDIT) {
            let res = await editParkageById({
                id: id,
                selectedPrice: this.state.selectedPrice.value,
                selectedProvince: this.state.selectedProvince.value,
                selectedCategory: this.state.selectedCategory.value,
                clinicId: this.state.selectedClinic.value,
                specialtyId: this.state.selectedSpecialty.value,

                contentMarkdown: this.state.contentMarkdown,
                contentHTML: this.state.contentHTML,
                name: this.state.name,
                description: this.state.description,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
            })
            if (res && res.errCode === 0) {
                toast.success('Update success')
                this.setState({
                    id: '',
                    contentMarkdown: '',
                    contentHTML: '',
                    name: '',
                    description: '',
                    address: '',
                    imageBase64: '',
                    previewImgUrl: '',
                    selectedPrice: '',
                    selectedCategory: '',
                    selectedProvince: '',
                    selectedClinic: '',
                    selectedSpecialty: '',
                }, async () => { await this.getAllParkage_() })
            } else {
                toast.error('Something wrong')
            }
        }
    }
    handleOnchangeSelect = (selectedOption, name) => {
        let stateName = name.name
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption
        this.setState({
            ...stateCopy
        })
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }
    handleOnchangeText = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
    }
    handleOnchangeImage = async (event) => {
        let data = event.target.files
        let file = data[0]
        let base64 = await CommonUtils.getBase64(file)
        if (file) {
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                imageBase64: base64,
                previewImgUrl: objectUrl,
            })
        }
    }
    openPreviewImage = async () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true
        })
    }
    handleDeleteParkage = async (item) => {
        let res = await deleteParkage(item.id)
        if (res && res.errCode === 0) {
            toast.success('Delete Parkage Success')
            this.getAllParkage_()
            console.log(res);
        } else {
            toast.error('something wrong')
        }
    }
    handleEditParkage = async (item) => {
        let { listPrice,
            listCategory,
            listProvince,
            listClinic,
            listSpecialty
        } = this.state
        let { language } = this.props
        let res = await getParkageById(item.id)
        if (res && res.errCode === 0) {
            this.setState({
                id: item.id,
                contentMarkdown: res.data.contentMarkdown,
                contentHTML: res.data.contentHTML,
                name: res.data.name,
                description: res.data.description,
                address: res.data.address,
                imageBase64: res.data.image,
                previewImgUrl: res.data.image,
                action: CRUD_ACTIONS.EDIT,
                selectedPrice: listPrice.find(item => {
                    return item && item.value === res.data.priceId
                }),
                selectedCategory: listCategory.find(item => {
                    return item && item.value === res.data.categoryId
                }),
                selectedProvince: listProvince.find(item => {
                    return item && item.value === res.data.provinceId
                }),
                selectedClinic: listClinic.find(item => {
                    return item && item.value === res.data.clinicId
                }),
                selectedSpecialty: listSpecialty.find(item => {
                    return item && item.value === res.data.specialtyId
                }),
            })
        }
    }
    render() {
        let { allRequiredDoctorInfo } = this.props
        let { allParkage, clinicParkage } = this.state
        return (
            < div className='manage-doctor-container' >
                <div className='manage-doctor-title'>
                    <FormattedMessage id='admin.manage-doctor.parkage' />
                </div>
                <div className='more-doctor-info'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.name' /></label>
                        <input className='form-control'
                            onChange={(event) => { this.handleOnchangeText(event, 'name') }}
                            value={this.state.name}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id='admin.manage-doctor.intro' /></label>
                        <textarea className='form-control' rows='4'
                            onChange={(event) => { this.handleOnchangeText(event, 'description') }}
                            value={this.state.description}
                        ></textarea>
                    </div>
                    <div className='col-4 form-group'>
                        <label>ảnh Thumbnail</label>
                        <input
                            className='form-control' id='previewImg'
                            onChange={(event) => { this.handleOnchangeImage(event) }}
                            type='file'
                        />
                        <div className='preview-image'
                            style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                            onClick={() => { this.openPreviewImage() }}
                        >
                        </div>
                    </div>
                </div>
                <div className='more-info-extra-row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.price' /> </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleOnchangeSelect}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id='admin.manage-doctor.price' />}
                            name='selectedPrice'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.province' /></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleOnchangeSelect}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id='admin.manage-doctor.province' />}
                            name='selectedProvince'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.category' /></label>
                        <Select
                            value={this.state.selectedCategory}
                            onChange={this.handleOnchangeSelect}
                            options={this.state.listCategory}
                            placeholder={<FormattedMessage id='admin.manage-doctor.category' />}
                            name='selectedCategory'
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.specialty' /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleOnchangeSelect}
                            options={this.state.listSpecialty}
                            placeholder={<FormattedMessage id='admin.manage-doctor.specialty' />}
                            name='selectedSpecialty'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.select-clinic' /></label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.getParkagebyClinicId}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id='admin.manage-doctor.select-clinic-a' />}
                            name='selectedClinic'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.address' /></label>
                        <input className='form-control'
                            onChange={(event) => { this.handleOnchangeText(event, 'address') }}
                            value={this.state.address}
                        />
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover table-bordered table-striped text-center" >
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clinicParkage && clinicParkage.length > 0 && clinicParkage.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td >{item.name}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => { this.handleEditParkage(item) }} >Edit</button>
                                            <button className='btn-delete' onClick={() => { this.handleDeleteParkage(item) }} >Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor style={{ height: '400px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <div className='col-12 form-group'>
                    <button
                        onClick={() => { this.handleSaveContent() }}
                        type="button" className="btn btn-primary btn-lg mt-3 ml-3">
                        <span><FormattedMessage id="admin.manage-doctor.save" /></span>
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover table-bordered table-striped text-center" >
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allParkage && allParkage.length > 0 && allParkage.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td >{item.name}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => { this.handleEditParkage(item) }} >Edit</button>
                                            <button className='btn-delete' onClick={() => { this.handleDeleteParkage(item) }} >Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div >
        )
    }
}
const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo

    };
};
const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        createDetailDoctorAction: (data) => dispatch(actions.createDetailDoctorAction(data)),
        getAllRequiredDoctorInfo: () => dispatch(actions.getAllRequiredDoctorInfo()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageParkage);
