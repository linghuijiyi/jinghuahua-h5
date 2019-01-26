<template>
    <div>
        <div class='container'>
            <div class='opt'>
                <div class='user'>
                    <div class='pic'>
                        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=399118516,1470088676&fm=26&gp=0.jpg" />
                    </div>
                    <div class='desc'>
                        <h4>尊敬的用户，您好</h4>
                        <p>欢迎来到用户中心</p>
                    </div>
                </div>
                <div class='loan'>
                    <div class='pic'>
                        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=399118516,1470088676&fm=26&gp=0.jpg" />
                    </div>
                    <div class='desc'>
                        <p>我的借款</p>
                        <div class='icon' @click='play'>
                            <van-icon name="arrow" />
                        </div>
                    </div>
                </div>
                <div class='user'>
                    <div class='pic'>
                        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=399118516,1470088676&fm=26&gp=0.jpg" />
                    </div>
                    <div class='desc'>
                        <h4>联系客服</h4>
                        <p>微信公众号：鲸花花</p>
                    </div>
                </div>
            </div>
            <div class='recommend'>
                <div class='recommend-title'>
                    - 专题推荐 -
                </div>
                <div v-if='productList.length' v-for='(item, index) in productList' @click='product(item.url)'>
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
                            <van-icon  name="arrow" />
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
    </div>
</template>

<script>
    import fatch from './../../common/js/fatch.js';
    import { baseUrl } from './../../common/js/config.js';
    import Loading from './../../base/loading/loading';
    import Storage from './../../common/js/storage.js';
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
                        this.showLoading = false;
                        this.noList = true;
                    }
                })
            },
            product(url) {
                window.location.href = url;
            },
            play() {
                this.$router.push({path: '/UserLoan'});
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
        background #F2F2F2
        min-height 100vh
        .user
            width 100%
            height 90px
            display flex
            background #fff
            .pic
                width 85px
                height 90px
                text-align center
                line-height 90px
                position relative
                margin-right 10px
                img
                    display block
                    border 2px solid #666
                    height 45px
                    width 55px
                    position absolute
                    left 50%
                    top 50%
                    transform translate(-50%, -50%)
            .desc
                flex 1
                padding 15px 0
                font-family '微软雅黑'
                h4
                    font-size 16px
                    margin-bottom 15px
                p
                    font-size 14px
        .loan
            height 48px
            display flex
            background #fff
            margin 15px 0
            .pic
                width 85px
                height 48px
                text-align center
                line-height 90px
                position relative
                margin-right 10px
                img
                    display block
                    border 2px solid #666
                    width 55px
                    height 34px
                    position absolute
                    left 50%
                    top 50%
                    transform translate(-50%, -50%)
            .desc
                font-family '微软雅黑'
                flex 1
                line-height 48px
                width auto
                position relative
                .icon
                    position absolute
                    right 25px
                    top 0
                    font-size 18px
                    transform translatY(-50%)
        .recommend
            .recommend-title
                font-weight bold
                font-size 20px
                text-align center
                padding-top 56px
                padding-bottom 20px
                border-bottom 1px solid #000
                margin-bottom 25px
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