import Vue from 'vue'
import Router from 'vue-router'
import UserInfo from '@/components/UserInfo'
import LoanInfo from '@/components/LoanInfo'
import BankList from '@/components/BankList'
import CreateBank from '@/components/CreateBank'
import Dc from '@/components/Dc'
import User from '@/components/User'
import UserLoan from '@/components/UserLoan'
import Login from '@/components/Login'
import Insurance from '@/components/Agreement/insurance';
import  Protocol from '@/components/Agreement/protocol';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/UserInfo',
            name: 'UserInfo',
            component: UserInfo
        },
        {
            path: '/LoanInfo',
            name: 'LoanInfo',
            component: LoanInfo
        },
        {
            path: '/BankList',
            name: 'BankList',
            component: BankList
        },
        {
            path: '/CreateBank',
            name: 'CreateBank',
            component: CreateBank
        },
        {
            path: '/Dc',
            name: 'Dc',
            component: Dc
        },
        {
            path: '/User',
            name: 'User',
            component: User
        },
        {
            path: '/UserLoan',
            name: 'UserLoan',
            component: UserLoan
        },
        {
            path: '/Insurance',
            name: 'Insurance',
            component: Insurance
        },
        {
            path: '/Protocol',
            name: 'Protocol',
            component: Protocol
        }
    ]
})