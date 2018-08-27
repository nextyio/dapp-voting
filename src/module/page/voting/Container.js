import {createContainer} from '@/util'
import Component from './Component'
import ContractService from '@/service/Voting'
import UserService from '@/service/UserService'
import WalletService from '@/service/WalletService'

export default createContainer(Component, (state) => {
    return {
        ...state.user
    }
}, () => {
    const contractService= new ContractService()
    const userService= new UserService()

    return {
        //Basic Functions
        async callFunction(functionName, params) {
            return await contractService.callFunction(functionName, params)
        },
        getBalance() {
            return userService.getBalance()
        },
        getWallet() {
            return userService.getWallet()
        },
    }
})
