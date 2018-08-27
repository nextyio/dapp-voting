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

        this.props.getContractAddress().then((_value) => {
            this.setState({
                contractAddress: _value
            })
            console.log("Contract Address =" + _value)
        })

        this.props.getWallet().then((_wallet) => {
            this.setState({
                walletAddress: _wallet.toString()
            })
            console.log("wallet = " + _wallet.toString())
        })

        this.props.getTotalSupply().then((_value) => {
            this.setState({
                totalSupply: _value,
                totalSupply_display: _value.toLocaleString()
            })
            console.log("Total Supply =" + _value)
        })

        this.props.getTokenAmount().then((_value) => {
            this.setState({
                tokenAmount: _value,
                tokenAmount_display: _value.toLocaleString()
            })
            console.log("TokenAmount =" + _value)
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

        this.props.getTotalProfit().then((_value) => {
            this.setState({
                totalProfit: _value,
                totalProfit_display: _value.toLocaleString()
            })
            console.log("TotalProfit =" + _value  )
        })

        var self=this
        var arr=[]
        dapp.map(function(e){
            self.props.getProfitByAddress(e.address).then((_value) => {
                //console.log(e.name + " at " + e.address + " = " + _value * 1e-18 )
                arr.push({name : e.name, address: e.address, value : _value})
            })
        })

        this.setState({
            data: arr
        })

        this.props.getClaimableAmount().then((_value) => {
            this.setState({
                claimableAmount: _value
            })
            console.log("claimableAmount =" + _value  )
        })
    }

    claim() {
       this.props.callFunction("profitCollect",[]).then((result) => {
            if (!result) {
                Message.error('Something wrong, collect failure!')
            }

            const self = this
            const collectEvent = self.props.getEventProfitCollectSuccess()
            const claimEvent = self.props.getEventProfitClaimSuccess()

            collectEvent.watch(function (err, response) {
                if (response.args._address.toString() === self.state.walletAddress) {
                    Notification.success({
                        message: 'Collect successfully!',
                    });
                    collectEvent.stopWatching()

                    self.props.callFunction("profitClaim",[]).then((result) => {
                        if (!result) {
                            Message.error('Something wrong, collect failure!')
                        }
                        claimEvent.watch(function (err, response) {
                            if (response.args._address.toString() === self.state.walletAddress) {
                                Notification.success({
                                    message: 'Claim successfully!',
                                });
                                self.loadData()
                                claimEvent.stopWatching()
                                return
                            }
                        })
                    })

                }
            })
       })
    }

    onClaim() {
        const content = (
            <div>
                <p>Claim Amount : {this.state.claimableAmount} NTY</p>
            </div>
        );

        Modal.confirm({
            title: 'Are you sure?',
            content: content,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                this.claim()
            },
            onCancel() {
            }
        })
    }

    renderClaimBtn(){
        return (
            <div> 
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="contentCenter">
                    <Button disabled={this.state.claimableAmount < EPSILON} onClick={this.onClaim.bind(this)} type="primary" className="primary selectBtn"> 
                        Claim
                    </Button>
                </Col>
            </div>
        )
    }

    dappsListRender() {
        return (
        <div> 
            {this.state.data.map(e => <p> {e.name}  = {(e.value.toLocaleString())} {CURRENCY} </p>)} 
        </div>)
    }

    ord_renderContent () {
        return (
            <div className="mainDiv">
                <Row style={{fontSize: 20}}>
                    <Row className="contentCenter">
                        <h3>Share Profit</h3>
                    </Row>
                    <Col xs={0} sm={0} md={0} lg={3} xl={3} />

                    <Col xs={24} sm={24} md={24} lg={9} xl={9} className="contentCenter">
                        <p>Your Token : {this.state.tokenAmount_display}</p>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={9} xl={9} className="contentCenter">
                        <p>Total Supply : {this.state.totalSupply_display} {TOKENNAME}</p>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="contentCenter">
                        <p>Your balance : {this.state.balance_display}</p>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="contentCenter">
                        <p>Current total profit : {this.state.totalProfit_display}</p>
                    </Col>
                </Row>
                <Row className="contentCenter" style={{fontSize: 20}}>
                    {this.dappsListRender()}
                </Row>
                <Row style={{fontSize: 20}}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="contentCenter">
                        <p>claimable amount : {this.state.claimableAmount} {CURRENCY}</p>
                    </Col>
                    {this.renderClaimBtn()}
                </Row>
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
