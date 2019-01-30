<template>
    <div>
        <div class='container'>
            <header>
                <div class='back' @click='back'>
                    <img src='./../../assets/jhh-back.png' />
                </div>
                <div class='user'>
                    <img src='./../../assets/user.png' @click='user' />
                </div>
            </header>
            <div class='swipe'>
                <van-swipe :autoplay="3000" :show-indicators='false'>
                    <van-swipe-item
                        v-if='advertisingList.length'
                        class='swipe-item'
                        v-for='(item, inex) of advertisingList'
                        :key='item.id'
                    >
                        <img :src="item.phonoUrl" @click='advertisingUvNumber(item.url, item.id)' />
                    </van-swipe-item>
                    <van-swipe-item v-if='!advertisingList.length' class='swipe-item'>
                        <img src="./../../assets/0.jpg" />
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class='quota'>
                <div class='title'>
                    今日平台可借额度已用完
                </div>
                <div class='desc'>
                    48小时内额度会重新恢复，您可以继续使用您的借款权益
                </div>
                <div class='btn'>
                    <el-button class='button' type="danger" round @click='bespoke'>提前预约</el-button>
                </div>
            </div>
            <div>
                <div class='recommend'>
                    - 专题推荐 -
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
                            :centered='true'
                            class='van_card'
                            :key='index'
                        >
                            <div class='title' slot="title" v-text='item.productName'></div>
                            <div slot="desc" class='desc'>
                                <p>
                                    <span>利率低至{{item.dayRate}}%</span>
                                    <span>审核通过率：{{item.passRate}}%</span>
                                </p>
                                <p>
                                    <span>{{item.productDescribe}}</span>
                                    <span>最高放款金额{{item.maxLoanAmount}}</span>
                                </p>
                            </div>
                            <div class='footer' slot='footer'>
                                <van-icon  name='arrow' />
                            </div>
                        </van-card>
                    </div>
                </div>
                <div v-if='noList' style="text-align: center; line-height: 50px; margin-top: 30px;">
                    暂时没有相关数据。。。
                </div>
                <div class='loading' v-if='showLoading' style="text-align: center; margin-top: 100px;">
                    <img src='./../../base/loading/loading.gif' width='30' height='30' />
                    <p>加载中...</p>
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
                productList: [],
                showLoading: false,
                noList: false,
                advertisingList: []
            }
        },
        created() {
            if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }
            this.getProductlist();
            this.getAhowAdvert();
            const url = `${baseUrl}h5/customer/send/loginloanshopnumber`;
            fatch(url, 'post', { phone: Storage.get('user').phone }, (err) => {}).then((res) => {});
        },
        methods: {
            advertisingUvNumber(path, id) {
                const url = `${baseUrl}h5/customer/send/advertisingUvNumber`;
                fatch(url, 'get', {advertisingId: id, phone: Storage.get('user').phone}).then((res) => {});
                window.location.href = path;
            },
            getAhowAdvert() {
                const url = `${baseUrl}h5/customer/ahowAdvert`;
                fatch(url, 'get', null, (err) => {

                }).then((res) => {
                    if (res.code === '0') {
                        this.advertisingList = res.advertising;
                    } else {
                        
                    }
                })
            },
            getProductlist() {
                this.showLoading = true;
                const url = `${baseUrl}h5/customer/productDisplay`;
                fatch(url, 'get', null, (err) => {
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
                        this.noList = true;
                    }
                })
            },
            product(url, id) {
                const path = `${baseUrl}h5/customer/send/advertisingUvNumber`;
                fatch(path, 'get', {advertisingId: id, phone: Storage.get('user').phone}).then((res) => {});
                window.location.href = url;
            },
            user() {
                this.$router.push({path: '/User'});
            },
            bespoke() {
                this.$toast('预约成功。');
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
            .back
                position absolute
                left 10px
                top 8px
                img
                    display block
                    width 13px
                    height 24px
            .user
                position absolute
                right 10px
                top 8px
                img
                    display block
                    width 20px
                    height 20px
        .swipe
            height 100px
            position relative
            .van-swipe
                height 100%
                .swipe-item
                    height 100%
                    img
                        display block
                        height 100%
                        width 100%
            .my
                position absolute
                top 5px
                right 5px
                .van-tag
                    height 30px
                    width 25px
                    line-height 30px
                    text-align center
                    font-size 10px
                    border-radius 50%
                    background #FFB3B3!important
                    color #fff!important
        .quota
            width 90%
            margin 0 auto
            margin-top 15px
            border-radius 8px
            background-color #fff
            text-align center
            box-sizing border-box
            padding 15px 0
            .title
                font-weight bold
                font-size 20px
                color #FF9A28
                margin-bottom 5px
            .desc
                font-size .12rem
            .button
                width 4.52rem
                margin-top 15px
                background-color #0F95FF
                border none
        .recommend
            text-align center
            margin 20px 0
            font-size 18px
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