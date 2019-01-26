<template>
	<div class='container'>
		<div class='user-from'>
			<div class='user-from-title'>
				<span class='user-from-title-realname'>实名认证</span>
				<span>默认填充您已在平台认证的信息</span>
			</div>
			<van-cell-group>
				<div class='user-from-item'>
					<span class='user-from-item-label'>姓名</span>
					<el-input class='usre-from-item-input' placeholder='请输入您的姓名' v-model='username'></el-input>
					<i class='el-icon-circle-close user-from-item-icon'></i>
				</div>
				<div class='user-from-item'>
					<span class='user-from-item-label'>身份证号</span>
					<el-input class='usre-from-item-input'  placeholder='请输入身份证号' v-model='idCard'></el-input>
					<i class='el-icon-circle-close user-from-item-icon'></i>
				</div>
			</van-cell-group>
		</div>
		<div class='user-bank'>
			<div class='user-bank-titie'>
				<span class='user-bank-titie-bank'>银行卡信息</span>
				<span>请添加 <span class='user-bank-titie-username' v-text='showname'></span> 本人的银行卡</span>
			</div>
			<van-cell-group>
				<div class='user-from-item'>
					<span class='user-from-item-label'>银行卡号</span>
					<el-input class='usre-from-item-input'  placeholder='请输入您的银行卡号' v-model='bankCard' @blur='handleBlur'></el-input>
					<i :class="bankCardIcon ? 'el-icon-circle-close' : 'el-icon-circle-check'"
					:style="{color: bankCardIcon ? 'red' : 'green', lineHeight: '35px', marginLeft: '5px', opacity: bankShowIcon ? 1 : 0}"></i>
				</div>
				<div class='bankList'>
					<span class='user-from-item-label'>银行</span>
					<el-select
						class='usre-from-item-input'
						placeholder='请选择发卡行'
						v-model='bankValue'
						size='small'
					>
						<el-option
							v-for='item in bankOtios'
							:key='item.value'
							:label='item.label'
							:value='item.value'
						>
						</el-option>
					</el-select>
				</div>
				<div class='user-from-item'>
					<span class='user-from-item-label'>手机号</span>
					<el-input class='usre-from-item-input' placeholder='银行预留手机号' v-model='phone'></el-input>
					<i class='el-icon-circle-close user-from-item-icon'></i>
				</div>
			</van-cell-group>
		</div>
		<div>
			<el-button class='button' size='small' type='primary' @click='Submission' v-if='!sendStatus'>提交</el-button>
			<el-button class='button' size='small' type='primary' style='background: #ccc;border: 1px solid #666; color: red;' disabled v-if='sendStatus'>{{sendTime}}后重新提交</el-button>
		</div>
		<van-dialog v-model='showDialog' show-cancel-button :before-close='play'>
			<div class='user-from-item user-from-item-smscode' style='padding: 10px 10px; margin: 0; border-bottom: 1px solid #ccc;'>
				<el-input class='sms'  placeholder='请输入短信验证码' style='flex: 1; border: 1px solid #ccc;' v-model='smsCode'></el-input>
			</div>
		</van-dialog>
	</div>
</template>

<script>
	import Storage from './../../common/js/storage.js';
	import fatch from './../../common/js/fatch.js';
	import { baseUrl } from './../../common/js/config.js';
	export default {
		data() {
			return {
				bankValue: '',
				username: '',
				showname: '',
				idCard: '',
				bankCard: '',
				phone: '',
				smsCode: '',
				showDialog: false,
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
				sendStatus: false,
				sendTime: 60,
				bankCardIcon: false,
				bankShowIcon: false,
				regName: /^([\u4e00-\u9fa5]){2,20}$/,
				regCard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
				resNum: /^[0-9]*$/
			}
		},
		created() {
			let user = Storage.get('user');
			if (!Storage.get('user')) {
                this.$router.push({path: '/'});
                return;
            }
			if (user) {
				this.username = user.name === undefined ? '' : user.name;
				this.showname = user.name === undefined ? '' : user.name;
				this.idCard = user.idCard === undefined ? '' : user.idCard;
			}
		},
		methods: {
			computeSendTime() {
				if (this.sendStatus) {
					if (this.sendTime === 0) {
						this.sendStatus = false;
					} else {
						this.sendTime = this.sendTime - 1;
						setTimeout(() => { this.computeSendTime() }, 1000);
					}
				}
			},
			handleBlur() {
				fatch(`${baseUrl}h5/fuyoupay/querySupportCard`, 'get', { cardNo: this.bankCard }, (err) => {}).then((res) => {
					if (res.code === '0') this.bankCardIcon = false;
					else this.bankCardIcon = true;
					this.bankShowIcon = true;
				});
			},
			play(action, done) {
				if (action === 'confirm') {
					if (this.username === '') {
						this.$toast('姓名不能为空。');
						done(false);
						return;
					}
					if(!this.regName.test(this.username)){
						this.$toast('姓名只能输入汉字且不少于两位。');
						done(false);
						return;
					}
					if(this.idCard === ''){
						this.$toast('身份证号码不能为空。');
						done(false);
						return;
					}
					if(!this.regCard.test(this.idCard)){
						this.$toast('请输入18位正确的身份证号');
						done(false);
						return;
					}
					if (this.bankCard === '') {
						this.$toast('银行卡号不能为空。');
						done(false);
						return;
					}
					if(!this.resNum.test(this.bankCard)){
						this.$toast('银行卡号只能输入数字。');
						done(false);
						return;
					}
					if (this.bankCardIcon) {
	                    this.$toast('银行卡号输入错误，请重新输入。');
	                    done(false);
	                    return;
	                }
					if (this.bankValue === '') {
						this.$toast('请选择发卡行。');
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
						done(false);
						return;
					}
					const url = `${baseUrl}h5/fuyoupay/bindCard`;
					const params = {
						id: Storage.get('user').id,
						name: this.username,
						phone: this.phone,
						idCard: this.idCard,
						bankCard: this.bankCard,
						smsCode: this.smsCode
					}
					fatch(url, 'get', params, (err) => {
						this.$toast('添加失败。');
						done(false);
					}).then((res) => {
						if (res.code === '0') {
							done();
							this.$toast('添加成功。');
							this.$router.push({path: '/BankList'});
						} else {
							done(false);
							this.$toast(res.msg);
						}
					})
				} else {
					done();
				}
			},
			Submission() {
				if (this.sendStatus) return;
				if (this.username === '') {
					this.$toast('姓名不能为空。');
					return;
				}
				if(!this.regName.test(this.username)){
					this.$toast('姓名只能输入汉字且不少于两位。');
					return;
				}
				if(this.idCard === ''){
					this.$toast('身份证号码不能为空。');
					return;
				}
				if(!this.regCard.test(this.idCard)){
					this.$toast('请输入18位正确的身份证号');
					return;
				}
				if (this.bankCard === '') {
					this.$toast('银行卡号不能为空。');
					return;
				}
				if(!this.resNum.test(this.bankCard)){
					this.$toast('银行卡号只能输入数字。');
					return;
				}
				if (this.bankCardIcon) {
                    this.$toast('银行卡号输入错误，请重新输入。');
                    return;
                }
				if (this.bankValue === '') {
					this.$toast('请选择发卡行。');
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
					this.$toast('验证码获取失败。');
				}).then((res) => {
					if (res.code === '0') {
						this.showDialog = true;
						this.sendStatus = true;
						this.sendTime = 60;
						this.computeSendTime();
					} else {
						this.$toast(res.msg);
					}
				})
			},
			isPoneAvailable(phone) {
				return /^[1][3,4,5,7,8][0-9]{9}$/.test(phone);
			}
		}
	}
</script>

<style scoped lang='stylus'>
	.container >>> .van-dialog
		padding 10px 0px 0 0px
	.container >>> .van-dialog .van-button
		border-right 1px solid #ccc
	.container >>> .el-input__inner
		border none
		padding-left 0
	.container >>> .van-cell:not(:last-child)::after
		content ''
		border none
	.container >>> .van-cell
		border-bottom 1px solid #ebedf0
	.container >>> .sms .el-input__inner
		border none
		height 33px
	.container
		width 100%
		height 100vh
		background #CCCCCC
		.user-from
			width 100%
			.user-from-title
				width 100%
				height 40px
				line-height 40px
				background #D6D6D6
				font-size 14px
				.user-from-title-realname
					font-weight bold
			.user-from-item
				display flex
				box-sizing border-box
				padding 10px 15px
				line-height 40px
				border-bottom 1px solid #ebedf0
				.user-from-item-label
					width 90px
					min-width 90px
					max-width 90px
				.usre-from-item-input
					flex 1
				.user-from-item-icon
					color red
					font-size 16px
					line-height 35px
					margin-left 5px
					opacity 0
		.user-bank
			width 100%
			.user-from-item
				display flex
				box-sizing border-box
				padding 10px 15px
				line-height 40px
				border-bottom 1px solid #ebedf0
				.user-from-item-label
					width 90px
					min-width 90px
					max-width 90px
				.usre-from-item-input
					flex 1
				.user-from-item-icon
					color red
					font-size 16px
					line-height 35px
					margin-left 5px
					opacity 0
			.user-bank-titie
				width 100%
				height 40px
				line-height 40px
				background #D6D6D6
				font-size 14px
				.user-bank-titie-bank
					font-weight bold
				.user-bank-titie-username
					color red
			.bankList
				padding 10px 15px
				display flex
				border-bottom 1px solid #ebedf0
				.user-from-item-label
					display block
					width 90px
					line-height 32px
					min-width 90px
					max-width 90px
		.button
			margin-top 2.8rem
			width 100%
			background #FFFF00
			border 1px solid #FFFF00
			color #000
			font-size 16px
			font-family '微软雅黑'
</style>