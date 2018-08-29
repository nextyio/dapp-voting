import BaseService from '../model/BaseService'
import _ from 'lodash'
import Tx from 'ethereumjs-tx'
const SolidityFunction = require('web3/lib/web3/function')
import {WEB3} from '@/constant'

export default class VotingService extends BaseService {

    //Basic Functions
    async callFunction(functionName, params) {
        const storeUser = this.store.getState().user
        let {contract, web3, wallet} = storeUser.profile
        
        const functionDef = new SolidityFunction('', _.find(WEB3.PAGE["Voting"].ABI, { name: functionName }), '')
        const payloadData = functionDef.toPayload(params).data
        console.log(params)

        const nonce = web3.eth.getTransactionCount(wallet.getAddressString())
        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: '0x0',
            to: contract.Voting.address,
            data: payloadData
        }
        const gas = this.estimateGas(rawTx)
        rawTx.gas = gas
        return this.sendRawTransaction(rawTx)
    }

    sendRawTransaction(rawTx) {
        const storeUser = this.store.getState().user
        let {web3, wallet} = storeUser.profile

        const privatekey = wallet.getPrivateKey()
        const tx = new Tx(rawTx)
        tx.sign(privatekey)
        const serializedTx = tx.serialize()

        return web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))
    }

    estimateGas(rawTx) {
        const storeUser = this.store.getState().user
        let {web3} = storeUser.profile
        let gas

        try {
            gas = web3.eth.estimateGas(rawTx)
        } catch (err) {
            gas = 100000
            //gas = 6021975
        }

        return gas
    }

    //Read Functions

    async getContractAddress() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract) {
            return
        }
        return WEB3.PAGE["Voting"].ADDRESS
    }

    async isTargetByAddress(address) {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract) {
            return
        }
        return contract.Voting.isTargetByAddress(address)
    }

    async getPollsLength() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract) {
            return
        }
        return Number(contract.Voting.getPollsLength())
    }

    async getPollById(id) {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract) {
            return
        }
        return contract.Voting.getPollById(id)
    }

    getJoinedByAddress(id) {
        const storeUser = this.store.getState().user
        let {contract, wallet} = storeUser.profile
        const walletAddress = wallet.getAddressString()
        if (!contract) {
            return
        }
        return contract.Voting.getJoinedByAddress(walletAddress, id)
    }

    getVotesByAddress(id) {
        const storeUser = this.store.getState().user
        let {contract, wallet} = storeUser.profile
        const walletAddress = wallet.getAddressString()
        if (!contract) {
            return
        }
        return contract.Voting.getVotesByAddress(walletAddress, id)
    }

    async getPolls() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract) {
            return
        }

        var pollsLength = contract.Voting.getPollsLength()
        var polls = []

        for (let i = 0; i < pollsLength; i++) {
            var pollById = contract.Voting.getPollById(i)
            polls.push({
                index : i ,
                target : pollById[0],
                banType : pollById[1],
                startTime : pollById[2],
                endTime : pollById[3],
                result : pollById[5] ? pollById[4] : 2,
                ...pollById
            })
        }
        return polls;
    }

    //Events
    getEventCreatedSuccess() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract) {
            return
        }
        return contract.Voting.PollCreatedSuccess()
    }

    getEventVoteSuccess() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract) {
            return
        }
        return contract.Voting.VoteSuccess()
    }
}
