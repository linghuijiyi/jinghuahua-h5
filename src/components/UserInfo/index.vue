<template>
    <div class='container'>
        <header>
            <div class='back' @click='back'>
                <img src='./../../assets/jhh-back.png' />
            </div>
            <span>信息填写</span>
        </header>
        <div class='jhh-user'>
            <div class='jhh-user-form-item'>
                <span class='user-form-text'>姓名</span>
                <el-input class='form-item-input' placeholder='请输入您的姓名' v-model='username'></el-input>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item'>
                <span class='user-form-text'>身份证号</span>
                <el-input class='form-item-input' placeholder='请输入您的身份证号' v-model='idCard'></el-input>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item'>
                <span class='user-form-text'>芝麻分</span>
                <el-input class='form-item-input' placeholder='请输入您的芝麻分' v-model='sesameScore'></el-input>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item' style="margin-bottom: .2rem;">
                <span class='user-form-text name'>工资发放</span>
                <el-select class='form-item-input' placeholder='请选择' v-model='payroll' size='small'>
                    <el-option v-for='item in salaryOtios' :key='item.value' :label='item.label' :value='item.value'>
                    </el-option>
                </el-select>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item' :style="{borderBottom: profession === '' ? 'none' : '1px solid #ccc'}">
                <span class='user-form-text'>职业身份</span>
                <el-select class='form-item-input' placeholder='请选择' v-model='profession' size='small'>
                    <el-option v-for='item in professionList' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item' :style="{display: profession === '0' ? 'flex' : 'none', borderBottom: 'none'}">
                <span class='user-form-text'>月工资(元)</span>
                <el-input v-model='incomeMonth' class='form-item-input' placeholder='请输入您的月工资'></el-input>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item' :style="{display: profession === '1' ? 'flex' : 'none', borderBottom: 'none'}">
                <span class='user-form-text'>月流水(元)</span>
                <el-input v-model='incomeMonth' class='form-item-input' placeholder='请输入您的月流水'></el-input>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item' :style="{display: profession === '2' ? 'flex' : 'none', borderBottom: 'none'}">
                <span class='user-form-text'>月收入(元)</span>
                <el-input v-model='incomeMonth' class='form-item-input' placeholder='请输入您的月收入'></el-input>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
        </div>
        <div class='jhh-user'>
            <div class='jhh-user-form-item'>
                <span class='user-form-text'>卡号</span>
                <el-input class='form-item-input' placeholder='请输入您的银行卡号' v-model='bankCard' @blur='handleBlur'></el-input>
                <i :class="bankCardIcon ? 'el-icon-circle-close' : 'el-icon-circle-check'"
                :style="{color: bankCardIcon ? 'red' : 'green', lineHeight: '55px', marginLeft: '5px', opacity: bankShowIcon ? 1 : 0}"></i>
            </div>
            <div class='jhh-user-form-item'>
                <span class='user-form-text'>银行</span>
                <el-select class='form-item-input' placeholder='请选择' v-model='bank' :size='size'>
                    <el-option v-for='item in bankOtios' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
            <div class='jhh-user-form-item' style="borderBottom: none">
                <span class='user-form-text'>手机号</span>
                <el-input class='form-item-input' placeholder='银行预留手机号' v-model='phone'></el-input>
                <i class='el-icon-circle-close from-item-icon'></i>
            </div>
        </div>
        <div class='jhh-user'>
            <van-collapse v-model='activeNames'>
                <van-collapse-item title='更多' :border='false'>
                    <div class='item'>
                        <div class='user-form-text'>房产信息</div>
                        <el-radio-group class='form-item-input' v-model='houseInfo' fill='#169bd5' :size='size'>
                            <el-radio-button label='1'>有房贷</el-radio-button>
                            <el-radio-button label='0'>无房</el-radio-button>
                            <el-radio-button label='2'>无房贷</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class='item'>
                        <div class='user-form-text'>车产信息</div>
                        <el-radio-group class='radio-group' v-model='carInfo' fill='#169bd5' :size='size'>
                            <el-radio-button label='1'>有</el-radio-button>
                            <el-radio-button label='0'>无</el-radio-button>
                            <el-radio-button label='2'>无车贷</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class='item'>
                        <div class='user-form-text'>公积金</div>
                        <el-radio-group class='radio-group' v-model='accumulationFund' fill='#169bd5' :size='size'>
                            <el-radio-button label='1'>有</el-radio-button>
                            <el-radio-button label='0'>无</el-radio-button>
                            <el-radio-button label='2'>有超过半年</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class='item'>
                        <div class='user-form-text'>社保</div>
                        <el-radio-group class='radio-group' v-model='socialSecurity' fill='#169bd5' :size='size'>
                            <el-radio-button label='1'>有</el-radio-button>
                            <el-radio-button label='0'>无</el-radio-button>
                            <el-radio-button label='2'>有超过半年</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class='item'>
                        <div class='user-form-text'>信用卡</div>
                        <el-radio-group class='radio-group' v-model='creditcard' fill='#169bd5' :size='size'>
                            <el-radio-button label='1'>有</el-radio-button>
                            <el-radio-button label='0'>无</el-radio-button>
                            <el-radio-button label='2'>半年内有逾期</el-radio-button>
                        </el-radio-group>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
        <div>
            <el-button class='button' size='small' type='primary'  v-if='!sendStatus' @click='handleSendCode'>获取我的借款额度</el-button>
            <el-button class='button' size='small' type='primary' disabled style='background: #ccc;border: 1px solid #ccc;color: red;' v-if='sendStatus'>{{sendTime}}后重新提交</el-button>
        </div>
        <van-dialog v-model='showDialog' show-cancel-button :before-close='handleUploadClick'>
            <div class='user-form-item user-form-item-dialog'>
                <el-input class='form-item-smscode' style="height: 50px; lineHeight: 50px; border: 1px solid #ccc; box-sizing: border-box;" placeholder='请输入短信验证码' v-model='smsCode'></el-input>
            </div>
        </van-dialog>
    </div>
</template>

<script>
    import fatch from './../../common/js/fatch.js';
    import Storage from './../../common/js/storage.js';
    import { baseUrl } from './../../common/js/config.js';
    export default {
        data() {
            return {
                professionList: [
                    {
                        value: '0',
                        label: '上班族'
                    }, {
                        value: '1',
                        label: '个体户'
                    }, {
                        value: '2',
                        label: '自由职业'
                    }
                ],
                salaryOtios: [
                    {
                        value: '0',
                        label: '银行代发'
                    }, {
                        value: '1',
                        label: '现金发放'
                    }
                ],
                bankOtios: [
                    {
                        value: '中国银行',
                        label: '中国银行'
                    }, 
                    {
                        value: '农业银行',
                        label: '农业银行'
                    },
                    {
                        value: '建设银行',
                        label: '建设银行'
                    },
                    {
                        value: '工商银行',
                        label: '工商银行'
                    },
                    {
                        value: '兴业银行',
                        label: '兴业银行'
                    },
                    {
                        value: '广大银行',
                        label: '广大银行'
                    },
                    {
                        value: '民生银行',
                        label: '民生银行'
                    },
                    {
                        value: '储蓄银行',
                        label: '储蓄银行'
                    },
                    {
                        value: '交通银行',
                        label: '交通银行'
                    },
                    {
                        value: '中信银行',
                        label: '中信银行'
                    },
                    {
                        value: '平安银行',
                        label: '平安银行'
                    },
                    {
                        value: '华夏银行',
                        label: '华夏银行'
                    },
                    {
                        value: '浦发银行',
                        label: '浦发银行'
                    },
                    {
                        value: '广发银行',
                        label: '广发银行'
                    },
                    {
                        value: '招商银行',
                        label: '招商银行'
                    },
                    {
                        value: '北京银行',
                        label: '北京银行'
                    },
                    {
                        value: '上海银行',
                        label: '上海银行'
                    },
                ],
                username: '',
                idCard: '',
                sesameScore: '',
                profession: '',
                payroll: '',
                bankCard: '',
                bank: '',
                phone: '',
                houseInfo: '1',
                carInfo: '1',
                accumulationFund: '1',
                socialSecurity: '1',
                creditcard: '1',
                incomeMonth:  '',
                smsCode: '',
                showDialog: false,
                activeNames: ['1'],
                sendStatus: false,
                sendTime: 60,
                bankCardIcon: false,
                bankShowIcon: false,
                namereg: /^([\u4e00-\u9fa5]){2,20}$/,
                cardReg : /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                regNum: /^[0-9]*$/,
                size: 'small'
            }
        },
        created() {
            if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }

        },
        methods: {
            handleBlur() {
                const url = `${baseUrl}h5/fuyoupay/querySupportCard`;
                fatch(url, 'get', { cardNo: this.bankCard }, (err) => {}).then((res) => {
                    if (res.code === '0') this.bankCardIcon = false;
                    else this.bankCardIcon = true;
                    this.bankShowIcon = true;
                });
            },
            handleSendCode() {
                if (this.sendStatus) return;
                if (this.username === '') {
                    this.$toast('姓名不能为空。');
                    return;
                }
                if(!this.namereg.test(this.username)){
                    this.$toast('姓名只能输入汉字且不少于两位。');
                    return;
                }
                if(this.idCard === ''){
                    this.$toast('身份证号码不能为空。');
                    return;
                }
                if(!this.cardReg.test(this.idCard)){
                    this.$toast('请输入18位正确的身份证号');
                    return;
                }
                if(this.sesameScore === ''){
                    this.$toast('芝麻分不能为空。');
                    return;
                }
                if(!this.regNum.test(this.sesameScore)){
                    this.$toast('芝麻分只能输入数字。');
                    return;
                }
                if (this.profession === '') {
                    this.$toast('请选择职业身份信息。');
                    return;
                }
                if (this.incomeMonth === '') {
                    this.$toast('请输入工资信息。');
                    return;
                }
                if(!this.regNum.test(this.incomeMonth)){
                    this.$toast('工资信息只能输入数字。');
                    return;
                }
                if (this.payroll === '') {
                    this.$toast('请选择工资发放方式。');
                    return;
                }
                if (this.bank === '') {
                    this.$toast('请选择发卡行。');
                    return;
                }
                if (this.bankCard === '') {
                    this.$toast('银行卡号不能为空。');
                    return;
                }
                if(!this.regNum.test(this.bankCard)){
                    this.$toast('银行卡号只能输入数字。');
                    return;
                }
                if (this.bankCardIcon) {
                    this.$toast('银行卡号输入错误，请重新输入。');
                    return;
                }
                if (this.phone === '') {
                    this.$toast('请输入手机号码。');
                    return;
                }
                if (!this.isPoneAvailable(this.phone)) {
                    this.$toast('手机号格式错误！');
                    return;
                }
                if (Storage.get('user').id === undefined) {
                    this.$toast('登录失效，请重新登录。');
                    this.$router.push({path: '/'});
                    return;
                }
                const url = `${baseUrl}h5/fuyoupay/sendBindCardSMS`;
                const params = {
                    id: Storage.get('user').id,
                    name: this.username,
                    phone: this.phone,
                    idCard: this.idCard,
                    bankCard: this.bankCard
                }
                fatch(url, 'get', params, (err) => {
                    this.$toast('短信发送失败。');
                }).then((res) => {
                    if (res.code === '0') {
                        this.sendStatus = true;
                        this.sendTime = 60;
                        this.computeSendTime();
                        this.showDialog = true;
                        this.$toast('短信发送成功。');
                    } else {
                        this.$toast(res.msg);
                    }
                });
            },
            handleUploadClick(action, done) {
                if (action === 'confirm') {
                    if (this.username === '') {
                        this.$toast('姓名不能为空。');
                        done(false)
                        return;
                    }
                    if(!this.namereg.test(this.username)){
                        this.$toast('姓名只能输入汉字且不少于两位。');
                        done(false);
                        return;
                    }
                    if(this.idCard === ''){
                        this.$toast('身份证号码不能为空。');
                        done(false);
                        return;
                    }
                    if(!this.cardReg.test(this.idCard)){
                        this.$toast('请输入18位正确的身份证号');
                        done(false);
                        return;
                    }
                    if(this.sesameScore === ''){
                        this.$toast('芝麻分不能为空。');
                        done(false);
                        return;
                    }
                    if(!this.regNum.test(this.sesameScore)){
                        this.$toast('芝麻分只能输入数字。');
                        done(false);
                        return;
                    }
                    if (this.profession === '') {
                        this.$toast('请选择职业身份信息。');
                        done(false);
                        return;
                    }
                    if (this.incomeMonth === '') {
                        this.$toast('请输入工资信息。');
                        done(false);
                        return;
                    }
                    if(!this.regNum.test(this.incomeMonth)){
                        this.$toast('工资信息只能输入数字。');
                        done(false);
                        return;
                    }
                    if (this.payroll === '') {
                        this.$toast('请选择工资发放方式。');
                        done(false);
                        return;
                    }
                    if (this.bank === '') {
                        this.$toast('请选择发卡行。');
                        done(false);
                        return;
                    }
                    if (this.bankCard === '') {
                        this.$toast('银行卡号不能为空。');
                        done(false);
                        return;
                    }
                    if(!this.regNum.test(this.bankCard)){
                        this.$toast('银行卡号只能输入数字。');
                        done(false);
                        return;
                    }
                    if (this.bankCardIcon) {
                        this.$toast('银行卡号输入错误，请重新输入。');
                        done(false);
                        return;
                    }
                    if (this.phone === '') {
                        this.$toast('请输入手机号码。');
                        done(false);
                        return;
                    }
                    if (!this.isPoneAvailable(this.phone)) {
                        this.$toast('手机号格式错误！');
                        done(false);
                        return;
                    }
                    if (this.smsCode === '') {
                        this.$toast('请输入短信验证码！');
                        done(false);
                        return;
                    }
                    if (Storage.get('user').id === undefined) {
                        this.$toast('登录失效，请重新登录。');
                        this.$router.push({path: '/'});
                        done(false)
                        return;
                    }
                    const url = `${baseUrl}h5/customer/detailInfo`;
                    const params = {
                        id: Storage.get('user').id,
                        name: this.username,
                        idCard: this.idCard,
                        sesameScore: this.sesameScore,
                        profession: this.profession,
                        payroll: this.payroll,
                        bankCard: this.bankCard,
                        bank: this.bank,
                        phone: this.phone,
                        houseInfo: this.houseInfo,
                        carInfo: this.carInfo,
                        socialSecurity: this.socialSecurity,
                        accumulationFund: this.accumulationFund,
                        creditcard: this.creditcard,
                        incomeMonth:  this.incomeMonth,
                        smsCode: this.smsCode,
                        insurance: '0',
                        loanAmount: '20000',
                        loanTerm: '3'
                    }
                    fatch(url, 'get', params, (err) => {
                        this.$toast('提交资料失败！');
                        done(false);
                    }).then((res) => {
                        if (res.code === '0') {
                            let user = {};
                            user.id = res.userInfo.id;
                            user.bankCard = res.userInfo.bankCard;
                            user.name = res.userInfo.name;
                            user.phone = res.userInfo.phone;
                            Storage.set('user', user);
                            this.$router.push({path: '/LoanInfo'});
                            done();
                        } else {
                            this.$toast(res.msg);
                            done(false);
                        }
                    });
                } else {
                    done();
                }
            },
            back() {
                this.$router.push({path: '/'});
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
    .container >>> input::-webkit-input-placeholder
        text-align right
    .container >>> .van-dialog
        padding 20px 10px 20px 10px
    .container >>> .van-dialog .van-button
        border 1px solid #ccc
        border-top none
    .container >>> [class*=van-hairline]::after
        content ''
        border none
    .container >>> .van-cell
        padding 0
        margin-bottom .2rem
        height 50px
    .container >>> .van-cell__title span
        display block
        width 1.5rem
        line-height 50px
        margin-right 10px
        color #333
        font-size 14px
    .container >>> .van-cell__right-icon
        top 50%
        margin-top -12px
    .container >>> .el-input__inner
        border none
        border-radius 20px
        padding-left 10px
        height 55px
        line-height 55px
    .container >>> .form-item-smscode .el-input__inner
        border none
        height 48px
    .container >>> .van-collapse-item__content
        padding 0
    .container >>> .van-button--mini
        width auto
        padding 0 .1rem
        min-width .8rem
    .container >>> .el-radio-button__inner
        border-radius 40px
        background #E6E6E6
        min-width 70px
        margin-right .25rem
    .container
        background #F2F2F2
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
        .jhh-user
            background #fff
            width 94%
            margin 0 auto
            margin-top 10px
            border-radius 8px
            box-sizing border-box
            padding 0 10px
            .jhh-user-form-item
                display flex
                height 55px
                line-height 55px
                border-bottom 1px solid #ccc
                .user-form-text
                    width 1.5rem
                .from-item-icon
                    line-height 55px
                    color red
                    opacity 0
                .form-item-input
                    flex 1
            .item
                .user-form-text
                    width 100%
                    margin-bottom 5px
                .el-radio-group
                    width 100%
                    margin-bottom 10px
        .button
            display block
            height 45px
            font-size 16px
            font-family '微软雅黑'
            padding none
            width 100%
            background #169BD5
            margin 0 auto
            margin-top 20px
            margin-bottom 20px
            border: 1px solid #169BD5
</style>