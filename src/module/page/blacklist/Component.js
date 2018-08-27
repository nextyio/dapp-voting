import React from 'react';
import LoggedInPage from '../LoggedInPage';
import sha3 from 'solidity-sha3'
import './style.scss'

import { Col, Row, Icon, Select, Breadcrumb, Button, Modal, Notification } from 'antd'
const Option = Select.Option

const EPSILON= 1e-10
const CURRENCY= "NTY"
const TOKENNAME= "SP"
//dapps address list

const dapp = [
    {name : "Binary Betting", address: "0xe490384b5617068eb0aa04b45eefbef323fb0500"},
    {name : "Binary Betting2", address: "0xe490384b5617068eb0aa04b45eefbef323fb0500"},
]

export default class BinaryBetting extends LoggedInPage {

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
                <Breadcrumb.Item>SP Token</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
