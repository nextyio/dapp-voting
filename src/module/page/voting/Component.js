import React from 'react';
import LoggedInPage from '../LoggedInPage';
import './style.scss'
import moment from 'moment/moment'

import { Col, Row, Icon, Select, Breadcrumb, Table, Input, Button, Modal, Notification, DatePicker } from 'antd'
const Option = Select.Option

const EPSILON= 1e-10
const CURRENCY= "NTY"
const dateFormat = 'YYYY-MM-DD';

export default class Voting extends LoggedInPage {
    state = {
        filteredInfo: null,
        sortedInfo: null,
    };

    handleChange = (pagination, filters, sorter) => {
        //console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    clearFilters = () => {
        this.setState({ filteredInfo: null });
    }

    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    }

    constructor (props) {
        super(props)
        this.state = {data : []};
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowSizeChange); 
        this.init()
        this.setScroll(window.innerWidth)
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

    handleWindowSizeChange = () => {
        this.setScroll(window.innerWidth)
    }

    setScroll(width){
        var scroll= 0;
        if (width < 1000) scroll= 800;
        this.setState({ scroll : scroll });
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
            this.setState({
                polls: _value
            })
            console.log("polls =" + _value.toLocaleString())
        })
    }

    tryToFinalize(id) {
        const self= this;
        this.props.callFunction('tryToFinalize', [id]).then((result) => {
            console.log("called tryToFinalize func")
            if (!result) {
                Message.error('Cannot send transaction!')
            }

            if (result == true) {
                console.log("finalized")
                self.loadData()
            }
        })
    }

    renderDatetime(time, formatString) {
        if (time < Date.now) console.log(time)
        return ( 
        <div>
            <p>{moment(time * 1000).format(formatString) }</p>
            <p>{moment(time * 1000).format("HH:MM") }</p>
        </div>
        )
    }

    agreeSelect(value) {
        this.setState({
            agree: value,
        })
    }

    vote(dataSource, id) {
        this.tryToFinalize(id)
        if (dataSource[id][5]) return false; //if vote ended
        let target=dataSource[id][0];
        let voteType=dataSource[id][1];
        let joinedByAddress= this.props.getJoinedByAddress(Number(id))
        let votesByAddress= this.props.getVotesByAddress(Number(id))

        this.setState({
            agree: (joinedByAddress) ? !votesByAddress : true,
            selectedId : id
        })
        
        const content = (
            <div>
                    <p>Target: {target} </p>
                    <p>Vote type: {voteType ? <Icon style={{ fontSize: 20 }} type="lock" /> : <Icon style={{ fontSize: 20 }} type="unlock" />}</p>
                    {joinedByAddress && <div>
                        Your last vote : {votesByAddress ?<Icon type="like" /> : <Icon type="dislike" />}
                    </div>
                    }
                    <p>joined : {Number(joinedByAddress)}</p>
                    <p>vote : {Number(votesByAddress)} </p>
                    <Select defaultValue={(joinedByAddress) ? !votesByAddress : true} style={{ width: 120 }} onChange={this.agreeSelect.bind(this)}>
                        <Option value={true}>Agree <Icon type="like" /> </Option>
                        <Option value={false}>Not Agree <Icon type="dislike" /></Option>
                    </Select>
            </div>
        );

        Modal.confirm({
            title: 'Are you sure?',
            content: content,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                this.onVote()
            },
            onCancel() {
            }
        })
        
    }

    onVote() {
        const self= this;
        this.props.callFunction('vote', [self.state.selectedId, self.state.agree]).then((result) => {
            console.log("called vote func")
            if (!result) {
                Message.error('Cannot send transaction!')
            }

            var event= self.props.getEventVoteSuccess()
            event.watch(function (err, response) {
                console.log(response)
                if(response.args._from == self.state.walletAddress) {
                    self.setState({
                        tx_success: true,
                        isLoading: false
                    });
                    self.loadData();
                    Notification.success({
                        message: 'Voted successfully!',
                    });
                    event.stopWatching()
                }
            });
        })
    }

    renderVoteButton(dataSource, id){
        var buttonName = "Vote";
        var ended= dataSource[id][5]
        if (ended) return (<div> </div>)
        var endTime= dataSource[id][3]
        if (endTime *1000 < Date.now) buttonName= "Result"
        return (
            <div><Button type= "primary" className= "defaultWidthButton" >{buttonName}</Button></div>
       )
    }

    renderTable() {
        var dataSource = this.state.polls;
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        var columns = [
            {
                title: 'Action',
                dataIndex: "index",
                key: 'index',
                sorter: (a, b) => a.index - b.index,
                sortOrder: sortedInfo.columnKey === 'index' && sortedInfo.order,
                render: (index) => {
                    return this.renderVoteButton(dataSource, index)
                }
            }, 
            {
                title: 'Target',
                dataIndex: 0,
                key: 'target',
                render: (target) => {
                    return <p>{target}</p>
                }
            }, 
            {
                title: 'Ban/Unban',
                dataIndex: 1,
                key: 'ban',
                sorter: (a, b) => a[1] - b[1],
                sortOrder: sortedInfo.columnKey === 'ban' && sortedInfo.order,
                render: (ban) => {
                    //return this.renderDatetime(endTime, 'DD/MM/YYYY')
                    return <p>{ban ? <Icon style={{ fontSize: 30 }} type="lock" /> : <Icon style={{ fontSize: 30 }} type="unlock" />}</p>
                    
                }
            }, 
            {
                title: 'Start',
                dataIndex: 2,
                key: 'startTime',
                sorter: (a, b) => a[2] - b[2],
                sortOrder: sortedInfo.columnKey === 'startTime' && sortedInfo.order,
                render: (time) => {
                    return this.renderDatetime(time, 'DD/MM/YY')
                }
            },
            {
                title: 'End',
                dataIndex: 3,
                key: 'endTime',
                sorter: (a, b) => a[3] - b[3],
                sortOrder: sortedInfo.columnKey === 'endTime' && sortedInfo.order,
                render: (time) => {
                    return this.renderDatetime(time, 'DD/MM/YY')
                }
            },
            {
                title: 'Result',
                dataIndex: "result",
                key: 'result',
                sorter: (a, b) => a[4] - b[4],
                sortOrder: sortedInfo.columnKey === 'result' && sortedInfo.order,
                render: (result) => {
                    if (result == 2) return <p> </p>
                    return <p>({result ? <Icon type="check" /> : <Icon type="close" />})</p>
                }
            }
        ];

        return (
            <Table   
                onChange={this.handleChange}
                onRow={(record) => {
                    return {
                        onClick: () => {this.vote(this.state.polls, record.index)},       // click row, index =  rowNumber
                    };
                }} 
                pagination= {false} dataSource= {this.state.polls} columns= {columns} scroll= { {x: this.state.scroll} } 
            />
        );
    }

    ord_renderContent () {
        return (
            <Row>
                <Col xs={0} sm={0} md={0} lg={2} xl={3}/>
                <Col xs={24} sm={24} md={24} lg={20} xl={18}>
                    { this.renderTable() }
                </Col>
            </Row>
        );
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb className= "breadcrumb" style={{ 'paddingLeft': '16px', 'paddingTop': '16px', float: 'right' ,background: 'white'}}>
                <Breadcrumb.Item><Icon type="bank" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item>Voting</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
