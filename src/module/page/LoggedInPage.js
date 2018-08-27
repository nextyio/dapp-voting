import React from 'react';
import BasePage from '@/model/BasePage';
import {
    Layout, Menu, Icon, Input, Upload, message, Button, Breadcrumb, Alert, BackTop, Row, Col } from 'antd';
import Header from '../layout/Header/Container';
// import './style.scss';
import Sidebar from '../layout/Sidebar/Container';
import Footer from '../layout/Footer/Container';

const { Sider, Content } = Layout;
const ReactRouter = require('react-router-dom');
const Link = ReactRouter.Link;

export default class extends BasePage {
    ord_renderPage() {
        return (
            <div>
            <Header />
                <Layout>
                    <BackTop />
                    <Sidebar />
                    <Layout>
                            {this.ord_renderBreadcrumb()}
                        <Content style={{ margin: '0px 0px', padding: 24, background: 'white', minHeight: 280 }}>
                            {this.ord_renderContent()}
                        </Content>
                    </Layout>
                </Layout>
            <Footer/>
            </div>
        );
    }

    ord_renderContent() {
        return null;
    }

    ord_renderBreadcrumb() {
        return null;
    }
}
