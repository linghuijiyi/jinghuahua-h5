<template>
    <div class='container'>
        <div class='img_wrap'>
            <img class='logo-img' src='./../../assets/logo.png' />
            <br>
            <img class='text-img' src='./../../assets/coding.png' />
            <img class='money-img' src='./../../assets/money.png' />
        </div>
        <div class='login-from'>
            <div class='form-item'>
                <input class='phone' v-model='phone' placeholder='请输入您的手机号' />
            </div>
            <div class='form-item-code form-item'>
                <input class='sms-code' v-model='smsCode' placeholder='请输入验证码' />
                <button class='smg-botton' @click='showMask' v-show='!sendStatus'>获取验证码</button>
                <button class='smg-botton' v-show='sendStatus'>{{sendTime}}s后在获取</button>
            </div>
            <button class='login' @click='login'>立即借款</button>
            <div class='insurance'>
                <div class='insurance-item'>
                    <el-checkbox class='insurance-item-checkbox' v-model='protocol'></el-checkbox>
                    <p>同意<router-link style='color: #fff;' to='/Protocol'>《鲸花花用户注册协议》</router-link></p>
                </div>
                <div class='insurance-item'>
                    <el-checkbox class='insurance-item-checkbox' v-model='insurance'></el-checkbox>
                    <p>赠您一份平安的百万意外险<router-link style='color: #fff;' to='/Insurance'>《出行意外及重要公告声明》</router-link></p>
                </div>
            </div>
        </div>
        <div class='mask' v-show='mask'>
            <div class='mask-model'>
                <div class='mask-model-header'>请输入图片验证码</div>
                <div class='mask-model-body'>
                    <input v-model='imgCode' placeholder='请输入图片验证码' />
                    <img :src='imgURl' @click='imgURl = `${baseUrl}login/captcha.jpg?${Math.random()}`' />
                </div>
                <div class='mask-modal-footer'>
                    <button @click='mask = false'>取消</button>
                    <button @click='handleSendSmsCode'>确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import fatch from './../../common/js/fatch.js';
    import Storage from './../../common/js/storage.js';
    import { baseUrl } from './../../common/js/config.js';
    export default {
        data() {
            return {
                protocol: true,
                insurance: true,
                mask: false,
                phone: '',
                imgURl: '',
                smsCode: '',
                imgCode: '',
                sendStatus: false,
                sendTime: 60,
                baseUrl
            }
        },
        created() {
            let num = '';
            for (let i = 0; i < 4; i++)  num += Math.floor(Math.random() * 10);
            if (!Storage.get('onlyid')) Storage.set('onlyid', (new Date()).valueOf() + num);
            fatch(`${baseUrl}h5/customer/send/channel/uv`, 'post', { random: Storage.get('onlyid') }, (err) => {});
        },
        methods: {
            showMask() {
                if (this.phone === '') {
                    this.$toast('请输入手机号！');
                    return;
                }
                if (!this.isPoneAvailable(this.phone)) {
                    this.$toast('手机号格式错误！');
                    return;
                }
                this.imgURl = `${baseUrl}login/captcha.jpg?${Math.random()}&JSESSIONID=4874E8E3F574258DD70F945B2C3999B4`;
                this.mask = true;
            },
            handleSendSmsCode() {
                if (this.sendStatus) return;
                if (this.imgCode === '') {
                    this.$toast('请输入图片验证码！');
                    return;
                }
                const params = {
                    phone: this.phone,
                    code: this.imgCode,
                }
                const url = `${baseUrl}h5/customer/Msg`;
                fatch(url, 'post', params, (err) => {
                    this.$toast('验证码发送失败。');
                }).then((res) => {
                    if (res.code === '0') {
                        this.sendStatus = true;
                        this.sendTime = 60;
                        this.computeSendTime();
                        this.mask = false;
                    } else {
                        this.$toast(res.msg);
                    }
                });
            },
            login() {
                if (this.phone === '') {
                    this.$toast('请输入手机号！');
                    return;
                }
                if (!this.isPoneAvailable(this.phone)) {
                    this.$toast('手机号格式错误！');
                    return;
                }
                if (this.smsCode === '') {
                    this.$toast('请输入短信验证码！');
                    return;
                }
                if (!this.protocol) {
                    this.$toast('请勾选同意协议');
                    return;
                }
                const url = `${baseUrl}h5/customer/login`;
                const params = {
                    phone: this.phone,
                    code: this.smsCode,
                    insurance: this.insurance ? 0 : 1,
                }
                fatch(url, 'post', params, (err) => {
                    this.$toast('登录失败！');
                }).then((res) => {
                    if (res.code === '0') {
                        Storage.set('user', this.setUserInfo('0', res));
                        this.$router.push({path: '/UserInfo'});
                    } else if (res.code === '44') {
                        Storage.set('user', this.setUserInfo('44', res));
                        this.$router.push({path: '/LoanInfo'});
                    } else if (res.code === '33') {
                        Storage.set('user', this.setUserInfo('33', res));
                        this.$router.push({path: '/Dc'});
                    } else {
                        this.$toast(res.msg);
                    }
                })
            },
            setUserInfo(code, data) {
                Storage.clear();
                let user = {};
                if (code === '0') {
                    user.id = data.userInfo.id;
                } else {
                    if (data.ubcList !== undefined && data.ubcList !== null && data.ubcList.length) data.bankCard = data.ubcList[0].bankCard;
                    user.id = data.userInfo.id;
                    user.name = data.userInfo.name;
                    user.idCard = data.userInfo.idCard;
                    user.phone = data.userInfo.phone;
                }
                return user;
            },
            isPoneAvailable(phone) {
                return /^[1][3,4,5,7,8][0-9]{9}$/.test(phone);
            },
            computeSendTime() {
                if (this.sendStatus) {
                    if (this.sendTime === 0) {
                        this.sendStatus = false;
                    } else {
                        this.sendTime = this.sendTime - 1;
                        setTimeout(() => { this.computeSendTime() }, 1000);
                    }
                }
            }
        }
    }
</script>

<style scoped lang='stylus'>
    .container
            height 100vh
            min-height 100vh
            background red
            position relative
        .img_wrap
            text-align center
            .logo-img
                width 28%
                margin-top 4px
            .text-img
                width 60%
            .money-img
                width 90%
        .login-from
            padding 0 .94rem
            box-sizing border-box
            margin 0 auto
            overflow hidden
            padding-top 1%
            .form-item
                display flex
                margin-bottom 12px
                .phone
                    flex 1
                    height .8rem
                    min-height .56rem
                    overflow hidden
                    font-size .32rem
                    padding-left .3rem
                    box-sizing border-box
                    border-radius .4rem
                    border 2px solid #ffd200
                    background #fff
                .sms-code
                    width 50%
                    height .8rem
                    overflow hidden
                    background #fff
                    font-size .32rem
                    padding-left .3rem
                    box-sizing border-box
                    border-radius .4rem
                    border 2px solid #ffd200
                .smg-botton
                    height .8rem
                    width 46%
                    background #ffEA00
                    font-size .28rem
                    color #333
                    margin-left 3%
                    border-radius .8rem
                    float right
            .login
                margin-bottom .24rem
                width 100%
                height .8rem
                background #ffEA00
                color #333
                font-size .3rem
                border-radius .8rem
                letter-spacing 1px
            .insurance
                width 100%
                color #fff
                .insurance-item
                    margin-bottom .1rem
                    display flex
                    .insurance-item-checkbox
                        color #fff
                        margin-right 5px
        .mask
            background rgba(0, 0, 0, .5)
            position fixed
            top 0
            right: 0
            left: 0
            bottom: 0
            .mask-model 
                width 6rem
                height 4.66rem
                margin 0 auto
                background #fff
                border-radius .2rem
                position absolute
                left 50%
                top 25%
                margin-left -3rem
                .mask-model-header 
                    background #ffEA00
                    width 100%
                    height .88rem
                    line-height .88rem
                    border-top-left-radius .2rem
                    border-top-right-radius .2rem
                    text-align center
                    font-size .26rem
                    color #333
                .mask-model-body
                    display flex
                    justify-content space-between
                    padding 0 .26rem
                    margin-top .6rem
                    margin-bottom .8rem
                    width 100%
                    box-sizing border-box
                    input
                        width 60%
                        height .88rem
                        border-radius .88rem
                        border 1px solid #ffd200
                        padding 0 .2rem
                        margin-right .08rem
                        box-sizing border-box
                    img
                        width: 35%
                        height: .88rem
                        float: right
                .mask-modal-footer
                display flex
                justify-content space-between
                padding 0 .26rem
                button:nth-child(1)
                    background: #fff
                button
                    width 2.6rem
                    height .88rem
                    border-radius .88rem
                    border 1px solid #ffEA00
                    background #ffEA00
                    color #333
                    font-size .3rem
</style>