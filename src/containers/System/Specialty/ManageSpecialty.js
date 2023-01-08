import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE, CRUD_ACTIONS } from '../../../utils'
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils'
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty, deleteSpecialty, getAllSpecialtyById, createNewSpecialty, editSpecialtyById } from '../../../services/userService'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            arrSpecialty: [],
            previewImgUrl: '',
            action: '',
            isOpen: false
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    async componentDidMount() {
        this.handleGetAllSpecialty()
    }
    handleGetAllSpecialty = async () => {
        let { arrSpecialty } = this.state
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({
                arrSpecialty: res.data,
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
    handleSaveSpecialty = async () => {
        let { action } = this.state
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewSpecialty({
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            })
            if (res && res.errCode === 0) {
                toast.success('Save new specialty success')
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgUrl: ''
                })
                this.handleGetAllSpecialty()
            } else {
                toast.error('Something Wrong')
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await editSpecialtyById({
                id: this.state.id,
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            })
            if (res && res.errCode === 0) {
                toast.success('Save specialty success')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgUrl: ''
                }, async () => { await this.handleGetAllSpecialty() })

            } else {
                toast.error('Something Wrong')
            }
        }
    }
    handleDeleteSpecialty = async (item) => {
        let res = await deleteSpecialty(item.id)
        if (res && res.errCode === 0) {
            toast.success('Delete Specialty Success')
            this.handleGetAllSpecialty()
        } else {
            toast.error('Something Wrong')
            console.log(res);
        }
    }
    handleEditSpecialty = async (item) => {
        let res = await getAllSpecialtyById(item.id)
        if (res && res.errCode === 0) {
            let imageBase64 = ''
            if (res.data.image) {
                imageBase64 = Buffer.from(res.data.image, 'base64').toString('binary')
            }
            this.setState({
                // id : res.data.id,
                id: item.id,
                name: res.data.name,
                imageBase64: imageBase64,
                descriptionHTML: res.data.descriptionHTML,
                descriptionMarkdown: res.data.descriptionMarkdown,
                previewImgUrl: imageBase64,
                action: CRUD_ACTIONS.EDIT,
            })
        }
    }
    render() {
        let { arrSpecialty } = this.state
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý chuyên khoa</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên chuyên khoa</label>
                        <input
                            className='form-control'
                            onChange={(event) => { this.handleOnchangeInput(event, 'name') }}
                            value={this.state.name}
                            type='text'
                        />
                    </div>
                    <div className='col-3 form-group'>
                        <label>ảnh chuyên khoa</label>
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
                    <div className='col-12'>
                        <MdEditor style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className=' btn btn-primary btn-lg mt-3 '
                            onClick={() => { this.handleSaveSpecialty() }}
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
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrSpecialty && arrSpecialty.length > 0 && arrSpecialty.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td >{item.name}</td>
                                            <td>
                                                <button className='btn-edit' onClick={() => { this.handleEditSpecialty(item) }} >Edit</button>
                                                <button className='btn-delete' onClick={() => { this.handleDeleteSpecialty(item) }} >Delete</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
