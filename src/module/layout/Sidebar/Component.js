import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Layout, Menu, Icon, Modal } from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'
const { Sider } = Layout

import {USER_ROLE} from '@/constant';
import './style.scss';

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobi l e') !== -1);
};

const isMobile = isMobileDevice();

export default class extends BaseComponent {
  constructor() {
  super();
  //this.state = {
   // height: window.innerHeight,
    //width: window.innerWidth
  //};
  this.updateDimensions = this.updateDimensions.bind(this);
}

updateDimensions() {
  if ((!this.state.collapsed) && (this.state.width>window.innerWidth))
  this.setState({
      collapsed: true,
      siderWidth: '0px'
  });

  if ((this.state.collapsed) && (this.state.width<window.innerWidth))
  this.setState({
      collapsed: false,
      siderWidth: '200px'
  });

  this.setState({
    height: window.innerHeight,
    width: window.innerWidth
  });
}
  componentDidMount() {
      document.title = "Blockchain Betting"
      window.addEventListener("resize", this.updateDimensions);
      this.loadData()
  }
  state = {
  collapsed: isMobile,
  }
toggleCollapsed = () => {
  this.setState({
    collapsed:!this.state.collapsed,
    siderWidth: this.state.collapsed?'200px':'0px'
  });
  //console.log(this.state.siderWidth)
}

loadData() {
  this.setState({
    siderWidth: this.state.collapsed?'0px':'200px'
  });
}


    ord_render() {
        const isAdmin = this.props.isAdmin
        return (

            <Sider collapsed={this.state.collapsed}
                trigger={null}
                collapsedWidth="0px"
                collapsible
                style={{position: "absolute",left: "0px", }}
                >

                <div style={{width: '50px', height: '50px', position: 'fixed', bottom: '20px', left: '20px', zIndex : '99999'}}>
                    <a href="https://t.me/" target="_blank" rel="noopener"><img style ={{width: '50px', zIndex : '99999'}} src="/assets/images/telegram.png" /></a>
                </div>

                <Icon onClick={this.toggleCollapsed} type={"menu-unfold"}
                style={{ position: 'absolute',top: 0, right: -20, fontSize: 20, zIndex : '1', display:!this.state.collapsed?'none':'block' }}
                />

                <Icon onClick={this.toggleCollapsed} type={"menu-fold"}
                style={{ position: 'absolute',top: 0, right: -20, fontSize: 20, display:this.state.collapsed?'none':'block' }}
                />

                <Menu onClick={this.clickItem.bind(this)} theme="dark" mode="inline" className="menu-sidebar" defaultSelectedKeys={this.detectUrl()}>
                    <Menu.Item key="home">
                        <Icon type="coffee" /> {I18N.get('0012')}
                    </Menu.Item>
                    <Menu.Item key="blacklist">
                        <Icon type="bank" /> {I18N.get('0013')}
                    </Menu.Item>
                    <Menu.Item key="voting">
                        <Icon type="fork" /> {I18N.get('0014')}
                    </Menu.Item>
                </Menu>

            </Sider>

        )
    }

    clickItem(e) {
        const key = e.key
        if (_.includes([
            'home',
            'SPToken',
            'binaryBetting',
            'lotto',
            'logout'
        ], key)) {
            this.props.history.push('/' + e.key)
        }
        else if (key === 'logout') {
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

    detectUrl() {
        let url = window.location.pathname;

        let sidebar = [
            'home',
            'SPToken',
            'binaryBetting',
            'lotto',
        ];

        if (!url) {
            return ['binaryBetting']
        }

        for(var menu in sidebar) {
            try {
                if(url.indexOf(sidebar[menu]) > -1) {
                    return [sidebar[menu]];
                    break;
                }
            } catch (e) {
                return [sidebar[0]];
            }
        }
        return [sidebar[0]];
    }
}
