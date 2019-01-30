<template>
    <div>
        <div class='container'>
            <div class='userloan'>
                <header>
                    <div class='back' @click='back'>
                        <img src='./../../assets/user-back.png' />
                    </div>
                    <span>我的借款</span>
                </header>
                <div class='userloan-time'>
                    <div>
                        <p>借款金额</p>
                        <h4>{{loanAmount}}元</h4>
                    </div>
                    <div>
                        <p>借款期限</p>
                        <h4>{{loanTerm}}月</h4>
                    </div>
                    <div>
                        <p>借款进度</p>
                        <h4>{{auditMsg}}</h4>
                    </div>
                </div>
            </div>
            <div class='refund'>
                <p>申请以下产品，注册返现，被拒包赔</p>
                <el-button class='button' size="small" type="primary" @click='refund'>我要退款</el-button>
            </div>
            <div class='productList'>
                <div
                    class='productList-item'
                    v-if='productList.length'
                    v-for='(item, index) in productList'
                    @click='product(item.url, item.id)'
                >
                    <van-card
                        :thumb="item.icon"
                        :key='index'
                        :centered='true'
                        class='van_card'
                    >
                        <div class='title' slot="title" v-text='item.productName'></div>
                        <div slot="desc" class='desc'>
                            <div>
                                <span>利率低至{{item.dayRate}}%</span>
                                <span>审核通过率：{{item.passRate}}%</span>
                            </div>
                            <div>
                                <span>{{item.productDescribe}}</span>
                                <span>最高放款金额{{item.maxLoanAmount}}</span>
                            </div>
                        </div>
                        <div class='footer' slot='footer'>
                            <van-icon  name="arrow"/>
                        </div>
                    </van-card>
                </div>
            </div>
            <div v-if='noList' style="text-align: center; line-height: 50px;">
                暂时没有相关数据。。。
            </div>
            <div class='loading' v-if='showLoading' style="text-align: center; margin-top: 100px;">
                <img src='./../../base/loading/loading.gif' width='30' height='30' />
                <p>加载中...</p>
            </div>
        </div>
    </div>
</template>

<script>
    import Storage from './../../common/js/storage.js';
    import fatch from './../../common/js/fatch.js';
    import { baseUrl } from './../../common/js/config.js';
    import Loading from './../../base/loading/loading';
    export default {
        data() {
            return {
                productList: [],
                showLoading: false,
                noList: false,
                loanAmount: '',
                loanTerm: '',
                auditMsg: '',
            }
        },
        created() {
            if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }
            this.getProductlist();
            this.playInfo();
        },
        methods: {
            playInfo() {
                if (Storage.get('user').id === undefined) {
                    this.$toast('登录失效，请重新登录。');
                    this.$router.push({path: '/'});
                    return;
                }
                const url = `${baseUrl}h5/customer/vipInfo`;
                fatch(url, 'get', { id: Storage.get('user').id }, (err) => {
                    this.$toast('获取用户信息失败。');
                    this.loanAmount = 'null';
                    this.loanTerm = 'null';
                    this.auditMsg = 'null';
                }).then((res) => {
                    if (res.code === '0') {
                        const vipInfo = res.vipInfo;
                        this.loanAmount = vipInfo.loanAmount;
                        this.loanTerm = vipInfo.loanTerm;
                        this.auditMsg = vipInfo.auditMsg;
                    } else {
                        this.loanAmount = '20000';
                        this.loanTerm = '7';
                        this.auditMsg = '审核未通过';
                    }
                })
            },
            getProductlist() {
                this.showLoading = true;
                const url = `${baseUrl}h5/customer/productDisplay`;
                fatch(url, 'get', {}, (err) => {
                    this.showLoading = false;
                    this.noList = true;
                }).then((res) => {
                    if (res.code === '0') {
                        this.showLoading = false;
                        if (res.list.length) {
                            this.productList = res.list;
                        } else {
                            this.noList = true;
                        }
                    } else {
                        this.showLoading = false;
                        this.noList = true;
                    }
                })
            },
            product(url, id) {
                const path = `${baseUrl}h5/customer/send/advertisingUvNumber`;
                fatch(path, 'get', {advertisingId: id, phone: Storage.get('user').phone}).then((res) => {});
                window.location.href = url;
            },
            refund() {
                this.$dialog.alert({
                    message: '您的借款申请失败，退款请联系鲸花花客服。'
                });
            },
            back() {
                this.$router.back(-1)
            },
        },
        components: {
            Loading
        }
    }
</script>

<style scoped lang='stylus'>
    .container >>> .van-card__thumb
        padding 10px 0
        box-sizing border-box
        margin 0
        img
            display block
            height 100%
            width 70px
            margin 0
    .container >>> .van-card__content
        padding 10px 0
        margin-right 25px
        box-sizing border-box
        min-width 0
    .container
        width 100%
        min-height 100vh
        background #F2F2F2
        .userloan
            background #fff
            background url('./../../assets/jk-gj.png')
            background-repeat no-repeat
            background-size cover
            color #fff
            header
                height 40px
                line-height 40px
                font-size 18px
                color #000
                text-align center
                font-family '微软雅黑'
                display flex
                position relative
                span
                    flex 1
                    color #fff
                .back
                    position absolute
                    left 10px
                    top 8px
                    img
                        display block
                        width 13px
                        height 24px
            .userloan-time
                display flex
                div
                    width 33.333%
                    height 100%
                    text-align center
                    padding 30px 0
                    box-sizing border-box
                    font-family '微软雅黑'
                    p
                        margin-bottom 5px
                    h4
                        font-weight bold
                        font-size 16px
        .refund
            padding 20px 0 30px 0
            p
                text-align center
                margin-bottom 15px
            .button
                color #000
                display block
                margin 0 auto
                width 120px
                font-size 14px
                border-radius 20px
                color #fff
                font-family '微软雅黑'
        .productList
            width 90%
            margin 0 auto
            background-color #fff
            border-radius 8px
            .productList-item
                padding 0 10px
                .van_card
                    width 100%
                    position relative
                    background-color #fff
                    padding 0
                    border-bottom 1px solid #F2F2F2
                    .title
                        font-size 18px
                        font-weight bold
                    .desc
                        margin-top 7px
                        margin-right 5px
                        p
                            line-height 20px
                            height 20px
                            overflow hidden
                            text-overflow ellipsis
                            white-space nowrap
                            span:nth-child(1)
                                margin-right 5px
                    .footer
                        position absolute
                        top 40%
                        right 0
                        font-size 25px
</style>