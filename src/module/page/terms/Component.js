import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import { Link } from 'react-router-dom'

import './style.scss'

import { Breadcrumb, Icon, Button } from 'antd'

export default class extends LoggedInPage {

    ord_renderContent () {
        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Terms & Conditions</h3>

                    <Button type="primary"><Link to="/deposit">Back</Link></Button>
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Terms & Conditions</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
