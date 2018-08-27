import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Layout, Menu, Icon, Badge, Avatar, Modal, Dropdown, Button, Row, Col } from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'
import './style.scss'

import { USER_ROLE } from '@/constant'

const { Header } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

export default class extends BaseComponent {
    componentDidMount() {
        document.title = "Betting on Blockchain"
    }

    buildAcctDropdown() {

        const isLogin = this.props.isLogin
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

        return (
            <Menu onClick={this.clickItem.bind(this)}>
                {isLogin ?
                    <Menu.Item key="profile">
                        {I18N.get('0200')}
                    </Menu.Item> :
                    <Menu.Item key="login">
                        {I18N.get('0201')}
                    </Menu.Item>
                }
                {isLogin && hasAdminAccess &&
                    <Menu.Item key="admin/tasks">
                        {I18N.get('0203')}
                    </Menu.Item>
                }
                {isLogin &&
                    <Menu.Item key="logout">
                        {I18N.get('0204')}
                    </Menu.Item>
                }
            </Menu>
        )
    }

    renderHeader() {
        const isLogin = this.props.isLogin;
        const divStyle = {
            width: '100%',
            height: '100%',
            padding: '0px',
          };
        const headerImg = {
            width: '100%',
            height: '100%',
            backgroundImage: `url("/assets/images/binary.png")`,
            backgroundSize: 'cover'  
          }
        if (isLogin) {
            return (
                <div style={ divStyle}>
                    <div className = "banner" style={headerImg}>
                    </div>
                    <div style={{width: '20px', height: '50px', position: 'fixed', top: '90%', right: '20px', zIndex : '99999'}}>
                        <Icon className="right-side" onClick={this.logout.bind(this)} type="logout" style={{ fontSize: 20, color: 'red' }}/>

                    </div>
                </div>
            )
        } else {
            return (
                <Row >
                    <img src='/assets/images/logo.png' style={{height : "200px"}}/>
                </Row>

            )
        }
    }

    ord_render() {

        const isLogin = this.props.isLogin

        return (
            <Header style={{ padding: 0 , width: "100%", height:"200px" }}>
                {this.renderHeader()}
            </Header>
        )
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
