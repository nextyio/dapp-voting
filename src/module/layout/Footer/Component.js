import React from 'react';
import BaseComponent from '@/model/BaseComponent';
import { Col, Row, Icon } from 'antd'
import { Link } from 'react-router-dom'
import './style.scss'

export default class extends BaseComponent {
    ord_render() {
        return (
                <Row className="contentCenter defaultBackground textWhite">

                    <Row style = {{paddingTop : "30px"}}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Row>
                                <b>WHAT IS BLOCKCHAIN BETTING?</b>
                                <p>Comming soon!</p>
                                <a href="" target="_blank"><b>HOW TO USE</b></a>
                            </Row>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Row>
                                <Row>
                                    <b>FOLLOW US ON</b>
                                </Row>
                                <Row className="contentCenter">
                                    <a href="https://bitcointalk.org/"><Icon type="wechat" style={{ fontSize: 30, margin : 5 }} /></a>
                                    <a href="https://www.facebook.com/"><Icon type="facebook" style={{ fontSize: 30, margin : 5 }} /></a>
                                    <a href="https://twitter.com/"><Icon type="twitter" style={{ fontSize: 30, margin : 5 }} /></a>
                                </Row>
                                <Row>
                                    <b>Email</b>
                                    <p>
                                        <a>quyetthangnguyen1987@gmail.com</a>
                                    </p>
                                </Row>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <p>2018 © Blockchain Betting Platform.</p>
                    </Row>
                </Row>
        );
    }

    logout(e) {
        Modal.confirm({
            title: 'Are you sure you want to logout?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                this.props.logout()
            },
            onCancel() {
            }
        })

    }
}
