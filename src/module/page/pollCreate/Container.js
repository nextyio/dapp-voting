import {createContainer} from '@/util'
import Component from './Component'
import VotingService from '@/service/Voting'
import BlacklistService from '@/service/Blacklist'
import UserService from '@/service/UserService'
import WalletService from '@/service/WalletService'

export default createContainer(Component, (state) => {
    return {
        ...state.user
    }
}, () => {
    const votingService= new VotingService()
    const blacklistService= new BlacklistService()
    const userService= new UserService()

    return {
        //Basic Functions
        async callFunction(functionName, params) {
            return await votingService.callFunction(functionName, params)
        },
        getBalance() {
            return userService.getBalance()
        },
        getWallet() {
            return userService.getWallet()
        },
        inBlacklist(address) {
            return blacklistService.inBlacklist(address)
        },
        isTargetByAddress(address) {
            return votingService.isTargetByAddress(address)
        },
        async getPollsLength() {
            return await votingService.getPollsLength()
        },
        async getPollById(id) {
            return await votingService.getPollById(id)
        },

        async getPolls() {
            return await votingService.getPolls()
        },

        //Events
        getEventCreatedSuccess() {
            return votingService.getEventCreatedSuccess()
        },
    }
})
