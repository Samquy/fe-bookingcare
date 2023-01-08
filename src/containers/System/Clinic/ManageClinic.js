import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import './ManageClinic.scss'
import { LANGUAGE, CRUD_ACTIONS } from '../../../utils'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils'
import { toast } from 'react-toastify'
import { createNewClinic, getAllClinic, deleteClinic, getAllClinicById, editClinicById } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            arrClinic: [],
            previewImgUrl: '',
            action: '',
            isOpen: false
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
        this.handleGetAllClinic()
    }
    handleGetAllClinic = async () => {
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                arrClinic: res.data,
                action: CRUD_ACTIONS.CREATE,
            })
        }
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
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
    handleSaveClinic = async () => {
        let { action } = this.state
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewClinic({
                name: this.state.name,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            })
            if (res && res.errCode === 0) {
                toast.success('Save new Clinic success')
                this.setState({
                    name: '',
                    address: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgUrl: '',
                }, async () => { await this.handleGetAllClinic() })
            } else {
                toast.error('Something Wrong')
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await editClinicById({
                id: this.state.id,
                name: this.state.name,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            })
            if (res && res.errCode === 0) {
                toast.success('Save new Clinic success')
                this.setState({
                    name: '',
                    address: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgUrl: '',
                }, async () => { await this.handleGetAllClinic() })
            } else {
                toast.error('Something Wrong')
            }
        }
    }
    handleDeleteClinic = async (item) => {
        let res = await deleteClinic(item.id)
        if (res && res.errCode === 0) {
            toast.success("Delete success Clinic")
            this.handleGetAllClinic()
        } else {
            toast.error("Something wrong")
        }
    }
    handleEditClinic = async (item) => {
        let res = await getAllClinicById(item.id)
        if (res && res.errCode === 0) {
            let imageBase64 = ''
            if (res.data.image) {
                imageBase64 = Buffer.from(res.data.image, 'base64').toString('binary')
            }
            this.setState({
                id: item.id,
                name: res.data.name,
                address: res.data.address,
                imageBase64: imageBase64,
                descriptionHTML: res.data.descriptionHTML,
                descriptionMarkdown: res.data.descriptionMarkdown,
                previewImgUrl: imageBase64,
                action: CRUD_ACTIONS.EDIT,
            })
        }
    }
    render() {
        let { arrClinic } = this.state
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý Phòng khám</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên Phòng khám</label>
                        <input
                            className='form-control'
                            onChange={(event) => { this.handleOnchangeInput(event, 'name') }}
                            value={this.state.name}
                            type='text'
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Địa chỉ Phòng khám</label>
                        <input
                            className='form-control'
                            onChange={(event) => { this.handleOnchangeInput(event, 'address') }}
                            value={this.state.address}
                            type='text'
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>ảnh phòng khám</label>
                        <input
                            className='form-control'
                            onChange={(event) => { this.handleOnchangeImage(event) }}
                            type='file'
                        />
                    </div>
                    <div className='col-3 form-group preview-image'
                        style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                        onClick={() => { this.openPreviewImage() }}
                    >
                    </div>
                    <div className='col-12'>
                        <MdEditor style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className=' btn btn-primary btn-lg mt-3 '
                            onClick={() => { this.handleSaveClinic() }}
                        >
                            SAVE
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover table-bordered table-striped text-center" >
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">name</th>
                                    <th scope="col">address</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrClinic && arrClinic.length > 0 && arrClinic.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td >{item.name}</td>
                                            <td >{item.address}</td>
                                            <td>
                                                <button className='btn-edit' onClick={() => { this.handleEditClinic(item) }} >Edit</button>
                                                <button className='btn-delete' onClick={() => { this.handleDeleteClinic(item) }} >Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
