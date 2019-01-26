<template>
    <div class='container'>
        <div class='banner'>
            <div class='banner-title'>- 您的贷款额度 -</div>
            <h2 class='banner-price'>20000元</h2>
        </div>
        <div class='loanterm'>
            <div class='loanterm-title'>- 贷款期限（月） -</div>
            <el-radio-group class='loanterm-group' v-model='loanTerm' fill='#FF3300'>
                <el-radio-button label='7'>7月</el-radio-button>
                <el-radio-button label='14'>14月</el-radio-button>
                <el-radio-button label='21'>21月</el-radio-button>
            </el-radio-group>
        </div>
        <div class='payment'>
            <van-nav-bar class='payment-title' :border='false'>
                <div class='payment-title-left' slot='left'>提现支付</div>
                <div class='payment-title-title' slot='title'>￥{{price}}</div>
            </van-nav-bar>
            <van-nav-bar :border='false'>
                <el-switch v-model='queue' active-color='#FF3300' slot='left' inactive-color='#999999' @change='switchChange'></el-switch>
                <div class='payment-queue' slot='title'>我要插队</div>
                <div class='payment-queue' slot='right'>
                    <img src="./../../assets/sz.png">
                </div>
            </van-nav-bar>
            <div>
                <van-card class='van_card' :desc="'卡号:' + bankCard" :thumb='imageURL'>
                    <div class='van_icon' slot='footer'>
                        <van-icon  name='arrow' @click='icon' />
                    </div>
                </van-card>
            </div>
        </div>
        <div>
            <el-button class='button' type='primary' size='small' @click='updDetailInfo'>确认支付{{price}}元</el-button>
        </div>
    </div>
</template>

<script>
    import Storage from './../../common/js/storage.js';
    import fatch from './../../common/js/fatch.js';
    import { baseUrl } from './../../common/js/config.js';
    export default {
        data() {
            return {
                queue: false,
                loanTerm: '7',
                price: '39.9',
                imageURL: '',
                bankCard: ''
            }
        },
        created() {
            let user = Storage.get('user');
            if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }
            if (user) {
                fatch(`${baseUrl}h5/customer/isOrNotPurchaseRecords`, 'post', {userId: user.id}, (err => {}));
                fatch(`${baseUrl}h5/customer/send/loginpurchasenumber`, 'post', {phone: user.phone}, (err) => {});
                this.bankCard = user.bankCard === undefined ? '暂未绑卡，请绑卡在支付。' : user.bankCard;
                if (this.bankCard !== '') this.getBankCode(this.bankCard);
                else this.imageURL = 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=426249697,2730327521&fm=26&gp=0.jpg';
            } else {
                this.bankCard = '暂未绑卡，请绑卡在支付。';
            }
        },
        methods: {
            getBankCode(bankCard) {
                const url = `https://ccdcapi.alipay.com/validateAndCacheCardInfo.json`;
                fatch(url, 'get', {_input_charset: 'utf-8', cardNo: bankCard, cardBinCheck: true}).then((res) => {
                    if (res.bank !== null && res.bank !== undefined) this.imageURL = `https://apimg.alipay.com/combo.png?d=cashier&t=${res.bank}`;
                    else this.imageURL = 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=426249697,2730327521&fm=26&gp=0.jpg';
                });
            },
            updDetailInfo() {
                if (Storage.get('user').id === undefined) {
                    this.$toast('登录失效，请重新登录。');
                    this.$router.push({path: '/'});
                    return;
                }
                if (this.bankCard === '暂未绑卡，请绑卡在支付。') {
                    this.$toast('没有可以支付的卡， 请先绑定银行卡.');
                    return;
                }
                const url = `${baseUrl}h5/customer/updDetailInfo`;
                const params = {
                    id: Storage.get('user').id,
                    loanAmount: '20000',
                    loanTerm: this.loanTerm,
                    bankCard: this.bankCard
                }
                fatch(url, 'get', params, (err) => {
                    this.$toast('支付失败。');
                }).then((res) => {
                    res.code === '0' ? (this.payment()) : (this.$toast(res.msg));
                })
            },
            payment() {
                if (this.bankCard === '' || this.bankCard === undefined) {
                    this.$toast('登录失效，请重新登录。');
                    this.$router.push({path: '/'});
                    return;
                }
                if (this.bankCard === '暂未绑卡，请绑卡在支付。') {
                    this.$toast('没有可以支付的卡， 请先绑定银行卡.');
                    return;
                }
                const url = `${baseUrl}h5/fuyoupay/pay`;
                const params = {
                    userId: Storage.get('user').id,
                    bankCard: this.bankCard,
                    price: this.price
                }
                fatch(url, 'get', params, (err) => {
                    this.$toast('支付失败。');
                }).then((res) => {
                    if (res.code === '0') {
                        this.$toast('支付成功。');
                        this.$router.push({path: '/Dc'});
                    } else {
                        this.$toast(res.msg);
                    }
                });
            },
            switchChange(value) {
                value ? (this.price = '99.9') : (this.price = '39.9');
            },
            icon() {
                this.$router.push({path: '/BankList'});
            }
        }
    }
</script>

<style scoped lang='stylus'>
    .container >>> .el-radio-button__inner
        border-radius 5px
        background #999999
        border: 1px solid #999999;
    .container >>> .van-card__thumb
        height 60px
    .container >>> .van-card__thumb img
        height 100%
    .container >>> .van-card__content
        height 60px
        overflow hidden
        padding-right 20px
    .container >>> .van-card__content .van-card__desc
        max-height 60px
        height 60px
        line-height 60px
        font-size .28rem
    .container
        width 100%
        .banner
            width 100%
            height 3.4rem
            background #8FAEDB
            text-align center
            padding-top .5rem
            box-sizing border-box
            font-family '微软雅黑'
            .banner-title
                font-size .4rem
                margin-bottom .8rem
            .banner-price
                font-size .7rem
        .loanterm
            width 100%
            height 3.4rem
            padding-top .9rem
            box-sizing border-box
            font-family '微软雅黑'
            background #8FAEDB
            margin .24rem 0
            .loanterm-title
                font-size .4rem
                text-align center
                margin-bottom .7rem
            .loanterm-group
                width 100%
                display flex
                text-align center
                label
                    flex 1
        .payment
            width 100%
            background #8FAEDB
            .van-nav-bar
                background #8FAEDB
                border-bottom 1px solid #999999
                .payment-title-left
                    font-size .35rem
                .payment-title-title
                    color #FF0046
                    font-size .35rem
                .payment-queue
                    color #000
                    font-size .35rem
                    img
                        display block
                        width 45px
                        height 45px
            .van_card
                background #8FAEDB
                position relative
                .van_icon
                    position absolute
                    right 10px
                    top 50%
                    font-size .4rem
                    transform translateY(-50%)
        .button
            display block
            width 100%
            background #FFFF00
            color #000000
            margin 0 auto
            margin-top .5rem
            border-radius 15px
            border: 1px solid #FFFF00;
</style>