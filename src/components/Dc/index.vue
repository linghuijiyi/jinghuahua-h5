<template>
    <div>
        <div class='container'>
            <div class='swipe'>
                <van-swipe :autoplay="3000" :show-indicators='false'>
                    <van-swipe-item class='swipe-item'>
                        <img src="./../../assets/0.jpg" />
                    </van-swipe-item>
                    <van-swipe-item class='swipe-item'>
                        <img src="./../../assets/0.jpg" />
                    </van-swipe-item>
                    <van-swipe-item class='swipe-item'>
                        <img src="./../../assets/0.jpg" />
                    </van-swipe-item>
                    <van-swipe-item class='swipe-item'>
                        <img src="./../../assets/0.jpg" />
                    </van-swipe-item>
                </van-swipe>
                <div class='my'  @click='user'>
                    <van-tag type="danger">我的</van-tag>
                </div>
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
                <div class='recommend'>
                    - 专题推荐 -
                </div>
            </div>
            <div>
                <div v-if='productList.length' v-for='(item, index) in productList' @click='product(item.url)'>
                    <van-card
                        :thumb="item.icon"
                        :centered='true'
                        class='van_card'
                        :key='index'
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
                            <van-icon  name="arrow" />
                        </div>
                    </van-card>
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
            }
        },
        created() {
            if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }
            this.getProductlist();
            const url = `${baseUrl}h5/customer/send/loginloanshopnumber`;
            fatch(url, 'post', { phone: Storage.get('user').phone }, (err) => {}).then((res) => {});
        },
        methods: {
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
            product(url) {
                window.location.href = url;
            },
            user() {
                this.$router.push({path: '/User'});
            },
            bespoke() {
                this.$toast('预约成功。');
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
            width 100%
            height 238px
            text-align center
            box-sizing border-box
            padding 32px 0 20px 0
            .title
                font-weight bold
                font-size 25px
                margin-bottom 25px
            .desc
                font-size .12rem
            .button
                width 4.52rem
                margin-top 18px
                margin-bottom 35px
            .recommend
                font-size 20px
                line-height 50px
                border-bottom 1px solid #ccc
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
                right .1rem
                transform translateY(-50%)
                font-size 26px
</style>