<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="schoolForm.value"  clearable filterable @change="getShopId" placeholder="请选择校区">
						<el-option
						v-for="item in schoolForm.options"
						:key="item.schoolId"
						:label="item.schoolName"
						:value="item.schoolId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="shopForm.value" clearable filterable placeholder="请选择商家">
						<el-option
						v-for="item in shopForm.options"
						:key="item.shopId"
						:label="item.shopName"
						:value="item.shopId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.order_id" placeholder="订单编号"></el-input>
				</el-form-item>
				<el-form-item class="dateTimePicker">
					<el-date-picker
						v-model = "dateTimePicker"
						placeholder = "选择日期范围 可查询最近三个月的信息"
						type="datetimerange"
						range-separator="    至    "
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						>
					</el-date-picker>
				</el-form-item>
				<el-form-item class="inquire">
					<el-button type="primary" @click="getOrders" >查询</el-button>
				</el-form-item>
				<el-form-item style="float:right" v-if="show">
					<el-button type="success" @click="backto">返回</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
            <el-table-column prop="order_id" label="订单编号" width="130">
			</el-table-column>
			<el-table-column prop="user_name" label="用户名称" width="130">
			</el-table-column>
			<el-table-column prop="total_price" label="订单价格(元)" width="140"  sortable :formatter="formatMoney">
			</el-table-column>
			<el-table-column prop="create_time" label="订单创建时间" width="170" :formatter="formatCreate_time">
			</el-table-column>
			<el-table-column prop="school_name" label="校区名称" width="150">
			</el-table-column>
			<el-table-column prop="building_name" label="楼栋名称" width="150">
			</el-table-column>
			<el-table-column prop="receiver_name" label="收件人姓名" width="130">
			</el-table-column>
			<el-table-column prop="receiver_mobile" label="收件人电话" width="140" :formatter="formatCreate_phone">
			</el-table-column>
			<el-table-column prop="shop_name" label="商户名称" width="150">
			</el-table-column>
			<el-table-column prop="status" label="订单状态" min-width="120">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<router-link v-bind="{to:'/ordersInfo/'+scope.row.order_id}">
						<el-button type="primary" size="small" >订单详情</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import common from '../../api/common.js';
	export default {
		data() {
			return {
				schoolForm:{
					options:[{
					}],
					value:'',
				},
				shopForm:{
					options:[{
					}],
					value:'',
				},
				filters: {
					order_id: ''
				},
				show:false,
				page: 1,
				user_id:'',
				dateTimePicker:[],
				create_start:'',
				create_end:'',
				orders: [],
				shopId:'',
				total: 0,
				page: 1,
				listLoading: false,
			}
		},
		methods: {
			formatCreate_phone(row, column){
				var phone = row.receiver_mobile.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
				return phone
			},
			formatMoney(row, column){
				return row.total_price/100;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},
			//时间转换 年月日 时分秒
			GMTToStr(time){
				let date = new Date(time)
				let Str=date.getFullYear() + '-' +
				(date.getMonth() + 1) + '-' + 
				date.getDate() + ' ' + 
				date.getHours() + ':' + 
				date.getMinutes() + ':' + 
				date.getSeconds()
				return Str
			},
			formatCreate_time(row, column){
				let date = new Date(row.create_time)
				let Str=date.getFullYear() + '-' +
				(date.getMonth() + 1) + '-' + 
				date.getDate() + ' ' + 
				date.getHours() + ':' + 
				date.getMinutes() + ':' + 
				date.getSeconds()
				return Str
			},
			
			//获取学校信息
			getSchoolId(){
				this.listLoading = true,
				this.$http.post(common.apidomain + '/address/listSchool').then(function(res){
					this.schoolForm.options = res.body.data
					this.listLoading = false
				})
			},
			//获取商家信息
			getShopId(){
				this.listLoading = true,
				this.$http.post(common.apidomain + '/seller/listShop',{"schoolId":this.schoolForm.value}).then(function(res){
					this.shopForm.options = res.body.data.list
					this.listLoading = false
				})
			},
			//获取订单列表
			getOrders() {
				this.listLoading = true
				if(this.dateTimePicker){
					if(this.dateTimePicker[0]){
						this.create_start = this.GMTToStr(this.dateTimePicker[0])
					}else{
						this.create_start = ''
					}
					if(this.dateTimePicker[1]){
						this.create_end = this.GMTToStr(this.dateTimePicker[1])
					}else{
						this.create_end = ''
					}
				 }else{
					 this.create_start = '',
					 this.create_end = ''
				 }
				this.$http.post(common.apidomain + '/order/listOrder',{
					"order_id": this.filters.order_id,
					"shop_id": this.shopForm.value,
					"create_start":this.create_start,
					"create_end":this.create_end,
					"user_id":this.user_id,
					"pageNum":this.page,
					"pageSize": 20
				}).then(function(res){
					this.orders = res.body.data.list
					let objs = res.body.data.list
					for(var i=0;i<objs.length;i++){
						var type1 = objs[i].status;
						if(type1 == 0){
							objs[i].status = "已取消"
						} else if(type1 == 1){
							objs[i].status = "待支付"
						} else if(type1 == 2){
							objs[i].status = "待发货"
						} else if(type1 == 3){
							objs[i].status = "待收货"
						} else if(type1 == 4){
							objs[i].status = "已收货"
						} else if(type1 == 5){
							objs[i].status = "已完成"
						}
					}
					this.total = res.body.data.total					
					this.listLoading = false
				})
			},	
			
        	backto(){
            	this.$router.go(-1);
        	}
		},
		mounted() {
			if(this.$route.query.userId || this.$route.query.shopId){
				this.show = true;
			}
			//路由传过来的用户id
			let userId = this.$route.query.userId
			this.user_id = parseInt(userId)
			//路由传过来的查询日期
			let time = this.$route.query.create_start
			let time2 = time + 86399000
			if(time){
				this.dateTimePicker.push(time)
				this.dateTimePicker.push(time2)
			} else{
				this.dateTimePicker = []
			}
			//路由传过来的商家id
			let value = this.$route.query.shopId;
			if(value){
				this.shopForm.value = parseInt(value)
			}else{
				this.shopForm.value = ''
			}
			this.getOrders();
			this.getSchoolId();
			this.getShopId();
		}
	}

</script>

<style>
	.el-button+.el-button{
		margin-left: 0;
	}
	.dateTimePicker .el-input__icon+.el-input__inner{
		text-align: center;
		width: 380px;
	}
	.dateTimePicker .el-input__icon{
		right: -30px;
	}
	.inquire{
		margin-left: 30px;
	}
</style>