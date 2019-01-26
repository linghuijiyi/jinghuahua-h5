<template>
    <div>
        <div class='container'>
            <div class='userloan'>
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
            <div class='refund'>
                <h4>申请以下产品，被即可退款，最高可退25元</h4>
                <el-button class='button' size="small" type="primary" @click='refund'>我要退款</el-button>
            </div>
            <div v-if='productList.length' v-for='(item, index) in productList'  @click='product(item.url)'>
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
            product(url) {
                window.location.href = url;
            },
            refund() {
                this.$dialog.alert({
                    message: '您的借款申请失败，退款请联系鲸花花客服。'
                });
            }
        },
        components: {
            Loading
        }
    }
</script>

<style scoped lang='stylus'>
    .container >>> .van-card__thumb
        padding 10px 0
        width 70px
        box-sizing border-box
        img
            display block
            height 100%
            width 70px
    .container >>> .van-card__content
        padding 10px 0
        box-sizing border-box
    .container
        width 100%
        min-height 100vh
        background #F2F2F2
        .userloan
            height 106px
            background #fff
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
            border-bottom 1px solid #000
            h4
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
        .van_card
            width 100%
            position relative
            .title
                font-size 20px
                font-weight bold
            .desc
                width 100%
                margin-top 7px
                div:nth-child(1)
                    margin-bottom 7px
                div
                    span
                        margin-right .4rem
            .footer
                position absolute
                top 50%
                right .05rem
                transform translateY(-50%)
                font-size 26px
</style>