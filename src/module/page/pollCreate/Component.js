import React from 'react';
import LoggedInPage from '../LoggedInPage';
import './style.scss'
import moment from 'moment/moment'

import { Col, Row, Icon, Select, Breadcrumb, Input, Button, Modal, Notification, DatePicker } from 'antd'
const Option = Select.Option
const { RangePicker } = DatePicker;

const EPSILON= 1e-10
const CURRENCY= "NTY"
const dateFormat = 'YYYY-MM-DD';

let SHA3 = require('crypto-js/sha3');
let sha3 = (value) => {
    return SHA3(value, {
        outputLength: 256
    }).toString();
    }

export default class Voting extends LoggedInPage {

    constructor (props) {
        super(props)
        this.state = {data : []};
    }

    componentDidMount() {
        this.init()
    }

    init() {
        this.setState({
            targetStatus: false,
            duration: 7,
            enddate : moment(this.getEndDate(7), dateFormat)
        })
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

        this.props.getPollsLength().then((_value) => {
            this.setState({
                pollsLength: _value,
            })
            console.log("polls length =" + _value)
        })

        this.props.getPolls().then((_value) => {
            console.log("polls =" + _value.toLocaleString())
        })
    }

    isChecksumAddress (address) {
        // Check each case
        address = address.replace('0x','');
        let addressHash = sha3(address.toLowerCase());
    
        for (let i = 0; i < 40; i++ ) {
            // The nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
                (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }
        return true;
    };

    isWalletAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            // check if it has the basic requirements of an address
            return false;
        } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return true;
        } else {
            // Otherwise check each case
            return this.isChecksumAddress(address);
        }
    };

    onTargetChange(e) {
        var _val= e.target.value
        console.log(e.target.value, this.isWalletAddress(e.target.value))
        if ((!this.isWalletAddress(e.target.value)) || (e.target.value == "")) {
            this.setState({
                addressError: "invalid walletAddress",
                targetStatus: false,
                isTarget: false,
                inBlacklist: false
            })
        } else {
            this.setState({
                addressError: null,
                targetStatus: true
            }) 
            this.props.inBlacklist(_val).then((_inBlacklist) => {
                console.log(_val, _inBlacklist)
                this.setState({
                    inBlacklist: _inBlacklist
                }) 
            })

            this.props.isTargetByAddress(_val).then((_isTarget) => {
                if (_isTarget)
                this.setState({
                    isTarget: true,
                }) 
            })
        }
        

        this.setState({
            target: e.target.value,
            txhash: null,
        })
    }

    confirm() {
        var error = false;

        if ((this.state.addressError) || (!this.state.targetStatus)){
            Notification.error({
                message: "invalid walletAddress",
            });
            error = true;
        }

        if (!Number.isInteger(this.state.duration)) {
            Notification.error({
                message: "invalid duration",
            });
            error = true;
        }

        if (this.state.isTarget) {
            Notification.error({
                message: "this address is already a target of a poll",
            });
            error = true;
        }

        if (error) return false;

        const content = (
            <div>
                    <p>Target: {this.state.target} </p>
                    <p>Vote type: {this.state.inBlacklist ? "Unban request" : "Ban request"} </p>
                    <p>Vote duration : {this.state.duration} day(s) </p>
                    <p>Enddate : {this.state.enddate.format(dateFormat)} </p>
            </div>
        );

        Modal.confirm({
            title: 'Are you sure?',
            content: content,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                this.onConfirm()
            },
            onCancel() {
            }
        })
    }

    onConfirm() {
        this.setState({
            isLoading: true
        });

        const self= this;
        this.props.callFunction('pollCreateByDuration', [self.state.target, true, self.state.duration]).then((result) => {
            console.log("called Create func")
            if (!result) {
                Message.error('Cannot send transaction!')
            }

            var event= self.props.getEventCreatedSuccess()
            event.watch(function (err, response) {
                console.log(response.toString())
                if(response.args._from == self.state.walletAddress) {
                    self.setState({
                        tx_success: true,
                        isLoading: false
                    });
                    self.loadData();
                    Notification.success({
                        message: 'Created successfully!',
                    });
                    event.stopWatching()
                }
            });
        })
    }

    onEnddateChange(value) {
        var endTime = value.toISOString();
        var now = moment().format("YYYY-MM-DD");
        var end = moment.utc(value );
        var timeDiff = end.diff(now, 'days'); // 5
        //console.log("end time ", endTime)
        this.setState({
            enddate: moment.utc(value ),
            duration: timeDiff
        });
    }

    getEndDate(days) {
        var current = new Date(); 
        let oneday = 86400000;
        var endTime = new Date(current.getTime() + days*oneday);
        return endTime
    }

    disabledDate(current) {
        // Can not select days before today and today
        return current && current.valueOf() < Date.now();
    }

    onDurationChange(e) {
        var duration = Number(e.target.value)
        this.setState({
            duration: duration,
            enddate: moment(this.getEndDate(duration), dateFormat)
        });
    }

    ord_renderContent () {
        return (
            <div>
            <Col xs={1} sm={1} md={6} lg={6} xl={6}>
            </Col>

            <Col xs={22} sm={22} md={12} lg={12} xl={12}>
                <Row className= "defaultPadding">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        Target address:
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <Input
                            className= "defaultWidth"
                            defaultValue= {''}
                            value= {this.state.target}
                            onChange= {this.onTargetChange.bind(this)}
                        />
                    </Col>
                </Row>
                {this.state.targetStatus &&
                <Row className= "defaultPadding">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        Target Status:
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        {this.state.inBlacklist ? "blacklisted" : "not blacklisted"}
                        {this.state.isTarget && ", already targeted"}
                    </Col>
                </Row>
                }

                <Row className="defaultPadding">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        Vote duration:
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <Input 
                            style={{width:"80%"}}
                            type="number"
                            addonAfter=" day(s)"
                            defaultValue={"7"}
                            min={1}
                            value={this.state.duration}
                            onChange={this.onDurationChange.bind(this)}
                        />
                    </Col>
                </Row>

                <Row className="defaultPadding">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        Enddate:
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <DatePicker 
                            disabledDate={this.disabledDate}
                            style={{width:"80%"}}
                            defaultValue={moment(this.getEndDate(7), dateFormat)} format={dateFormat} 
                            value= {this.state.enddate}
                            onChange={this.onEnddateChange.bind(this)}
                            showTime={{ format: dateFormat }}
                            />
                    </Col>
                </Row>

                <Col xs={24} sm={24} md={12} lg={24} xl={24} className= "centerDraw defaultWidth defaultPadding">
                    <Button type= "primary" onClick= {this.confirm.bind(this)} className= "width50" >Poll Create</Button>
                </Col>
                
            </Col>
            </div>
        );
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb className= "breadcrumb" style={{ 'paddingLeft': '16px', 'paddingTop': '16px', float: 'right' ,background: 'white'}}>
                <Breadcrumb.Item><Icon type="bank" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item>Poll Create</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
