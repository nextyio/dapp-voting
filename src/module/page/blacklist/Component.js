import React from 'react';
import LoggedInPage from '../LoggedInPage';
import sha3 from 'solidity-sha3'
import './style.scss'

import { Col, Row, Icon, Select, Breadcrumb, Button, Modal, Notification } from 'antd'
const Option = Select.Option

const EPSILON= 1e-10
const CURRENCY= "NTY"

export default class Blacklist extends LoggedInPage {

    constructor (props) {
        super(props)
        this.state = {data : []};
    }

    componentDidMount() {
        this.init()
    }

    init() {

        this.props.getWallet().then((_wallet) => {
            this.setState({
                walletAddress: _wallet.toString()
            })
            console.log("wallet = " + _wallet.toString())
        })

        this.props.getBlacklistAddress().then((_blacklistAddress) => {
            this.setState({
                blacklistAddress: _blacklistAddress
            })
            console.log("Blacklist Address = " + _blacklistAddress)
        })

        this.props.getBlacklistLength().then((_blacklistLength) => {
            this.setState({
                blacklistLength: _blacklistLength
            })
            console.log("Blacklist Length = " + _blacklistLength)
            for (var i = 0; i < _blacklistLength; i++) {
                this.props.getBlacklistedById(i).then((_address) => {
                    console.log(_address.toLocaleString())
                })
            }
        })

        this.loadData()
    }

    loadData() {

        this.props.getBalance().then((_value) => {
            this.setState({
                balance: _value,
                balance_display: _value.toLocaleString()
            })
            console.log("balance =" + _value)
        })
    }

    ord_renderContent () {
        return (
            <div className="mainDiv">
                
            </div>
        );
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb className= "breadcrumb" style={{ 'paddingLeft': '16px', 'paddingTop': '16px', float: 'right' ,background: 'white'}}>
                <Breadcrumb.Item><Icon type="bank" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item>Blacklist</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
