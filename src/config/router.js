import BlacklistPage from '@/module/page/blacklist/Container'
import VotingPage from '@/module/page/voting/Container'
import PollCreatePage from '@/module/page/pollCreate/Container'
import LoginPage from '@/module/page/login/Container'
import TermsConditionsPage from '@/module/page/terms/Container'

import NotFound from '@/module/page/error/NotFound'

export default [
    {
        path: '/',
        page: LoginPage
    },
    {
        path: '/voting',
        page: VotingPage
    },
    {
        path: '/pollCreate',
        page: PollCreatePage
    },
    {
        path: '/blacklist',
        page: BlacklistPage
    },
    {
        path: '/login',
        page: LoginPage
    },
    {
        path: '/terms-conditions',
        page: TermsConditionsPage
    },
    {
        page: NotFound
    }
]
