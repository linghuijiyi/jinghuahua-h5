<template>
    <div class='container'>
        <header>
            <div class='back' @click='back'>
                <img src='./../../assets/jhh-back.png' />
            </div>
            <span>借贷额度</span>
        </header>
        <div class='banner'>
            <div class='banner-title'>您的贷款额度</div>
            <h4 class='banner-price'>￥20000元</h4>
        </div>
        <div class='loanterm'>
            <div class='loanterm-title'>- 贷款期限（月） -</div>
            <el-radio-group class='loanterm-group' v-model='loanTerm' fill='#0F95FF'>
                <el-radio-button label='7'>7月</el-radio-button>
                <el-radio-button label='14'>14月</el-radio-button>
                <el-radio-button label='21'>21月</el-radio-button>
            </el-radio-group>
        </div>
        <div class='payment'>
            
        </div>
        <div class='payment'>
            <van-nav-bar class='payment-title' :border='false'>
                <div class='payment-title-left' slot='left'>提现支付</div>
                <div class='payment-title-title' slot='right'>￥{{price}}</div>
            </van-nav-bar>
            <van-nav-bar :border='false'>
                <el-switch v-model='queue' active-color='#0F95FF' slot='right' inactive-color='#E6E6E6' @change='switchChange'></el-switch>
                <div class='payment-queue' slot='left'>我要插队</div>
            </van-nav-bar>
            <div  @click='icon'>
                <van-card class='van_card' :desc="'卡号:' + bankCard" :thumb='imageURL'>
                    <div class='van_icon' slot='footer'>
                        <van-icon  name='arrow' />
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
            },
            back() {
                this.$router.push({path: '/UserInfo'});
            },
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
        width 70px
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
        font-size 14px
    .container >>> .el-radio-button__inner
        padding 0
        width 60px
        height 60px
        line-height 60px
        text-align center
        border-radius 50%
        background-color #E6E6E6
        border none
    .container
        width 100%
        min-height 100vh
        header
            height 40px
            line-height 40px
            font-size 18px
            color #000
            text-align center
            font-family '微软雅黑'
            display flex
            position relative
            background-color #fff
            span
                flex 1
            .back
                position absolute
                left 10px
                top 8px
                img
                    display block
                    width 13px
                    height 24px
        .banner
            width 100%
            height 170px
            background #8FAEDB
            text-align center
            padding-top 50px
            box-sizing border-box
            font-family '微软雅黑'
            background url('./../../assets/bj-bank.png')
            background-size cover
            background-repeat no-repeat
            letter-spacing 3px
            .banner-title
                font-size 20px
                color #fff
                margin-bottom 5px
            .banner-price
                font-size 35px
                color #FFD429
        .loanterm
            height 130px
            width 95%
            margin 0 auto
            background-color #fff
            margin-top 10px
            border-radius 5px
            box-sizing border-box
            padding-top 15px
            font-family '微软雅黑'
            .loanterm-title
                text-align center
                font-size 18px
                margin-bottom 15px
            .loanterm-group
                width 100%
                display flex
                text-align center
                label
                    flex 1
        .payment
            width 95%
            margin 0 auto
            margin-top 10px
            padding 0 10px
            box-sizing border-box
            border-radius 5px
            background #fff
            .van-nav-bar
                height 55px
                border-bottom 1px solid #F2F2F2
                .payment-title-left
                    font-size 16px
                    color #363636
                .payment-title-title
                    color #FF9A28
                    font-size 16px
                .payment-queue
                    color #000
                    font-size 16px
                    img
                        display block
                        width 45px
                        height 45px
            .van_card
                background #fff
                position relative
                .van_icon
                    position absolute
                    right 10px
                    top 50%
                    font-size 18px
                    transform translateY(-50%)
        .button
            display block
            width 80%
            margin 50px auto 20px auto
            height 45px
            color #fff
            background #0F95FF
            border-radius 25px
            font-size 16px
            border: 1px solid #0F95FF
</style>