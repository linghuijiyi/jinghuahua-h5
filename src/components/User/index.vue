<template>
    <div>
        <div class='container'>
            <div class='user'>
                <header>
                    <div class='back' @click='back'>
                        <img src='./../../assets/user-back.png' />
                    </div>
                    <span>我的</span>
                </header>
                <div class='user-warp'>
                    <div class='pic'>
                        <img src='./../../assets/user-logo.png' />
                    </div>
                    <div class='user-info'>
                        <div class='username'>{{username}}</div>
                        <div class='desc'>欢迎来到用户中心</div>
                    </div>
                </div>
            </div>
            <div class='opt'>
                <div class='loan' @click='play'>
                    <div class='pic'>
                        <img src="./../../assets/jiekuan.png" />
                    </div>
                    <div class='desc'>
                        <p>我的借款</p>
                        <div class='icon'>
                            <van-icon name="arrow" />
                        </div>
                    </div>
                </div>
                <div class='loan'>
                    <div class='pic'>
                        <img src="./../../assets/kefu.png" />
                    </div>
                    <div class='desc'>
                        <p>联系客服</p>
                        <div class='kefu'>
                            微信公众号：鲸花花
                        </div>
                    </div>
                </div>
            </div>
            <div class='recommend'>
                <div class='recommend-title'>
                    - 被拒包赔 -
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
                username: ''
            }
        },
        created() {
            if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }
            this.username = Storage.get('user').name;
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
            product(url, id) {
                const path = `${baseUrl}h5/customer/send/advertisingUvNumber`;
                fatch(path, 'get', {advertisingId: id, phone: Storage.get('user').phone}).then((res) => {});
                window.location.href = url;
            },
            play() {
                this.$router.push({path: '/UserLoan'});
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
        background #F2F2F2
        min-height 100vh
        .user
            width 100%
            height 130px
            background url('./../../assets/bj-bank.png')
            background-repeat no-repeat
            background-size cover
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
            .user-warp
                height 90px
                display flex
                .pic
                    padding-left 20px
                    padding-top 10px
                    img
                        display block
                        width 60px
                        height 60px
                .user-info
                    color #fff
                    padding-top 18px
                    margin-left 10px
                    font-size 12px
                    .username
                        font-size 16px
                        font-weight 400
                        margin-bottom 3px
        .loan
            height 48px
            width 95%
            display flex
            background #fff
            margin 15px auto 15px auto
            border-radius 8px
            .pic
                width 23px
                height 48px
                text-align center
                margin-right 10px
                padding-left 20px
                line-height 60px
                img
                    width 23px
                    height 23px
            .desc
                font-family '微软雅黑'
                flex 1
                line-height 48px
                width auto
                position relative
                font-size 14px
                .icon
                    position absolute
                    right 15px
                    top 0
                    font-size 18px
                    transform translatY(-50%)
                .kefu
                    position absolute
                    right 15px
                    top 0
                    font-size 14px
                    color #0F95FF
        .recommend
            .recommend-title
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