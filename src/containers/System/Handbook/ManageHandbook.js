import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE, CRUD_ACTIONS } from '../../../utils'
import './ManageHandbook.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils'
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl';
import { getAllHandbook, deleteHandbook, getDetailHandbookById, createNewHandbook, editHandbookById } from '../../../services/userService'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            imageBase64: '',
            contentHTML: '',
            contentMarkdown: '',
            userId: '',

            arrHandbook: [],
            previewImgUrl: '',
            action: '',
            isOpen: false
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    async componentDidMount() {
        this.handleGetAllHandbook()
    }
    handleGetAllHandbook = async () => {
        let { arrHandbook } = this.state
        let res = await getAllHandbook()
        if (res && res.errCode === 0) {
            this.setState({
                arrHandbook: res.data,
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
            contentHTML: html,
            contentMarkdown: text
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
    handleSaveHandbook = async () => {
        let { action } = this.state
        if (action === CRUD_ACTIONS.CREATE) {
            let { userInfo } = this.props
            let res = await createNewHandbook({
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                userId: userInfo.id,
            })
            if (res && res.errCode === 0) {
                toast.success('Save new specialty success')
                this.setState({
                    name: '',
                    imageBase64: '',
                    contentHTML: '',
                    contentMarkdown: '',
                    previewImgUrl: ''
                }, async () => { await this.handleGetAllHandbook() })

            } else {
                toast.error('Something Wrong')
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await editHandbookById({
                id: this.state.id,
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
            })
            if (res && res.errCode === 0) {
                toast.success('Save specialty success')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    contentHTML: '',
                    contentMarkdown: '',
                    previewImgUrl: ''
                }, async () => { await this.handleGetAllHandbook() })

            } else {
                toast.error('Something Wrong')
            }
        }

    }
    handleDeleteHandbook = async (item) => {
        let res = await deleteHandbook(item.id)
        if (res && res.errCode === 0) {
            toast.success('Delete Specialty Success')
            this.handleGetAllHandbook()
        } else {
            toast.error('Something Wrong')
        }
    }
    handleEditHandbook = async (item) => {
        let res = await getDetailHandbookById(item.id)
        if (res && res.errCode === 0) {
            let imageBase64 = ''
            if (res.data.image && res.data.image !== null) {
                imageBase64 = Buffer.from(res.data.image, 'base64').toString('binary')
            }
            this.setState({
                id: item.id,
                name: res.data.name,
                imageBase64: imageBase64,
                contentHTML: res.data.contentHTML,
                contentMarkdown: res.data.contentMarkdown,
                previewImgUrl: imageBase64,
                action: CRUD_ACTIONS.EDIT,
            })
        }
    }
    render() {
        let { arrHandbook } = this.state
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý Handbook</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên Handbook</label>
                        <input
                            className='form-control'
                            onChange={(event) => { this.handleOnchangeInput(event, 'name') }}
                            value={this.state.name}
                            type='text'
                        />
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
                    <div className='col-12'>
                        <MdEditor style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className=' btn btn-primary btn-lg mt-3 '
                            onClick={() => { this.handleSaveHandbook() }}
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
                                {arrHandbook && arrHandbook.length > 0 && arrHandbook.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td >{item.name}</td>
                                            <td>
                                                <button className='btn-edit' onClick={() => { this.handleEditHandbook(item) }} >Edit</button>
                                                <button className='btn-delete' onClick={() => { this.handleDeleteHandbook(item) }} >Delete</button>
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
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
