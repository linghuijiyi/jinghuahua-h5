<template>
    <div class='container'>
        <Loading v-if='!banklist.length && !shwoLoading' />
        <div>
            <header>
                <div class='back' @click='back'>
                    <img src='./../../assets/user-back.png' />
                </div>
                <span>银行卡列表</span>
            </header>
            <div class='bank-list'>
                <div v-if='shwoLoading' style="text-align: center; line-height: 50px; font-size: 20px; font-weight: 700;color: #fff;margin: 50px 0;">{{errMsg}}</div>
                <van-card
                    class='van_card'
                    v-if='banklist.length'        
                    v-for='(item, index) in banklist'
                    :desc="item.bankCard"  
                    :thumb="item.imageURL"
                    :key='index'
                >
                    <div class='van_icon' slot="footer">
                        <div class='icon' :style="{background: item.color ? 'red' : ''}" @click='icon(index, item.bankCard)'></div>
                    </div>
                </van-card>
                <div v-if='createBankShow' class='createBank' @click='createBank'>
                    <el-button type='text' class='btn' icon='el-icon-plus' >添加银行卡</el-button>
                </div>
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
                banklist: [],
                shwoLoading: false,
                errMsg: '没有银行卡信息！',
                createBankShow: false
            }
        },
        created() {
            if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }
            this.getBnakList();
        },
        methods: {
            getBnakList() {
                const url = `${baseUrl}h5/customer/getBankList`;
                if (Storage.get('user').id === undefined) {
                    this.$toast('登录失效，请重新登录。');
                    this.$router.push({path: '/'});
                    return;
                }
                if (Storage.get('user')) {
                    fatch(url, 'get', { userId: Storage.get('user').id }, (err) => {
                        this.$toast('获取银行卡列表失败。');
                        this.shwoLoading = true;
                    }).then((res) => {
                        if (res.code === '0') {
                            const list = res.bankList;
                            let newUser = Storage.get('user');
                            if (newUser) {
                                if (list !== null && list !== undefined && list.length) {
                                    for (let i = 0; i < list.length; i++) {
                                        this.getBankCode(list[i].bankCard).then((res) => {
                                            list[i].imageURL = res;
                                            if (newUser.bankCard === list[i].bankCard) list[i].color = true;
                                            else list[i].color = false;
                                        });
                                    }
                                }
                            } else {
                                if (list !== null && list !== undefined && list.length) {
                                    for (let i = 0; i < list.length; i++) {
                                        this.getBankCode(list[i].bankCard).then((res) => {
                                            list[i].imageURL = res;
                                        });
                                    }
                                }
                            }
                            setTimeout(() => {
                                this.banklist = list;
                                this.createBankShow = true;
                            }, 1500)
                        } else {
                            this.shwoLoading = true;
                            this.$toast(res.msg);
                        }
                    })
                } else {
                    this.shwoLoading = true;
                    this.errMsg = '缺少参数！'
                }
            },
            getBankCode(bankCard) {
                const url = `https://ccdcapi.alipay.com/validateAndCacheCardInfo.json`;
                return fatch(url, 'get', {_input_charset: 'utf-8', cardNo: bankCard, cardBinCheck: true}).then((res) => {
                    if (res.bank !== null && res.bank !== undefined) return `https://apimg.alipay.com/combo.png?d=cashier&t=${res.bank}`;
                    else return '';
                });
            },
            icon(index, bankCard) {
                let banklist = this.banklist;
                for (let i = 0; i < banklist.length; i++) banklist[i].color = false;
                let newUser = Storage.get('user');
                if (newUser) {
                    newUser.bankCard = bankCard;
                    Storage.set('user', newUser);
                    banklist[index].color = true;
                } else {
                    let newUser = {};
                    newUser.bankCard = bankCard;
                    Storage.set('user', newUser);
                }
                this.$router.push({path: '/LoanInfo'});
            },
            createBank() {
                this.$router.push({path: '/CreateBank'});
            },
            back() {
                this.$router.push({path: '/LoanInfo'});
            }
        },
        components: {
            Loading
        }
    }
</script>

<style scoped lang='stylus'>
    .container >>> .van-card__thumb
        height 60px
        img
            display block
            height 100%
    .container >>> .van-card__content
        height 60px
        overflow hidden
        box-sizing border-box
    .container >>> .van-card__content .van-ellipsis
        max-height 60px
        height 60px
        line-height 60px
        font-size .28rem
    .container
        min-height 100vh
        background-color #333333
        padding 10px 15px
        box-sizing border-box
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
        .van_card
            position relative
            border-bottom 1px solid #ccc
            border-radius 6px
            margin-bottom 10px
            .icon
                position absolute
                width 15px
                height 15px
                border 1px solid #ccc
                border-radius 55%
                right 10px
                top 50%
                font-size .4rem
        .createBank
            height .8rem
            min-height .8rem
            line-height .8rem
            background #F2F2F2
            padding-left 15px
            text-align center
            background-color #0f95ff
            .btn
                color #fff
                height .8rem
                font-size .16rem
        .supportBank
            .title
                color red
                height .8rem
                line-height .8rem
                padding-left 15px
            .van-col-item
                text-align center
                heigth 30px
                line-height 30px
</style>