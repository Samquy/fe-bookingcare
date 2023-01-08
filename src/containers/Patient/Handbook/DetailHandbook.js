import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import HeaderHomePage from '../../../containers/HomePage/HeaderHomePage'
import './DetailHandbook.scss'
import { getallcodeServive, getDetailHandbookById } from '../../../services/userService'
import _ from 'lodash';


class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handbookData: {}
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let res = await getDetailHandbookById(id)
            if (res && res.errCode === 0) {
                this.setState({
                    handbookData: res.data
                })
            }
        }
    }
    render() {
        let { handbookData } = this.state
        let { language } = this.props
        return (
            <>
                <div className='detail-handbook-container'>
                    <HeaderHomePage />
                    <div className='detail-handbook-body'>
                        <div className='name-handbook'>
                            <span>{handbookData.name}</span>
                        </div>
                    </div>
                    <div className='markdown-handbook'>
                        {handbookData && !_.isEmpty(handbookData)
                            && <div dangerouslySetInnerHTML={{ __html: handbookData.contentHTML }}>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
