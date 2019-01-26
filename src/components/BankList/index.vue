<template>
    <div class='container'>
        <Loading v-if='!banklist.length && !shwoLoading' />
        <div class='bank-list'>
            <div v-if='shwoLoading' style="text-align: center; line-height: 50px; font-size: 20px; font-weight: 700;">{{errMsg}}</div>
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
            <div class='createBank'>
                <el-button type='text' class='btn' icon='el-icon-plus' @click='createBank'>添加银行卡</el-button>
            </div>
            <div class='supportBank'>
                <div class='title'>*目前只支持以下银行*</div>
                <div class='list'>
                    <van-row>
                        <van-col class='van-col-item' span='6'>中国银行</van-col>
                        <van-col class='van-col-item' span='6'>农业银行</van-col>
                        <van-col class='van-col-item' span='6'>建设银行</van-col>
                        <van-col class='van-col-item' span='6'>公商银行</van-col>
                        <van-col class='van-col-item' span='6'>兴业银行</van-col>
                        <van-col class='van-col-item' span='6'>广大银行</van-col>
                        <van-col class='van-col-item' span='6'>民生银行</van-col>
                        <van-col class='van-col-item' span='6'>储蓄银行</van-col>
                        <van-col class='van-col-item' span='6'>交通银行</van-col>
                    </van-row>
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
                errMsg: '没有银行卡信息！'
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
                            setTimeout(() => { this.banklist = list }, 1500)
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
        .van_card
            background #fff
            position relative
            border-bottom 1px solid #ccc
            .icon
                position absolute
                width 15px
                height 15px
                border 1px solid #ccc
                border-radius 50%
                right 10px
                top 50%
                font-size .4rem
                transform translateY(-50%)
        .createBank
            height .8rem
            min-height .8rem
            line-height .8rem
            background #F2F2F2
            padding-left 15px
            .btn
                color #666
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