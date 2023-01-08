import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import { getParkageById } from '../../../services/userService'
import HeaderHomePage from '../../HomePage/HeaderHomePage';
import 'react-markdown-editor-lite/lib/index.css';
import ParkageSchedule from './ParkageSchedule';
import ParkageExtraInfo from './ParkageExtraInfo';

class DetailParkage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailParkage: [],
            parkageId: '',
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            this.setState({
                parkageId: id
            })
            let res = await getParkageById(id)
            if (res && res.errCode === 0) {
                this.setState({
                    detailParkage: res.data,
                })
            }
        }
    }
    render() {
        let { language } = this.props
        let { detailParkage, parkageId } = this.state
        return (
            <>
                <HeaderHomePage
                    isShowBanner={false}
                />
                <div className='doctor-detail-container'>
                    <div className='doctor-info'>
                        <div className='content-left'
                            style={{ backgroundImage: `url(${detailParkage && detailParkage.image ? detailParkage.image : ''})` }}>
                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {detailParkage.name}
                            </div>
                            <div className='down'>
                                {detailParkage && detailParkage.description &&
                                    <span>{detailParkage.description}</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <ParkageSchedule
                                doctorIdFromParent={this.state.parkageId}
                            />
                        </div>
                        <div className='content-right'>
                            <ParkageExtraInfo doctorIdFromParent={this.state.parkageId} />
                        </div>
                    </div>
                    <div className='detail-info-doctor'>
                        {detailParkage && detailParkage.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailParkage.contentHTML }}></div>
                        }
                    </div>
                    <div className='comment-doctor'></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailParkage);
