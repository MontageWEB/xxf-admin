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
				<el-form-item>
					<el-button type="primary" class="inquire" @click="getSettlement">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="Settlement" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="shop_id" label="商家编号" width="150">
			</el-table-column>
			<el-table-column prop="settlement_id" label="结算单编号" width="150">
			</el-table-column>
			<el-table-column prop="settlement_date" label="结算时间" width="180" :formatter="formatGMTToStr">
			</el-table-column>
			<el-table-column prop="settlement_val" label="结算金额(元)" min-width="180" sortable :formatter="formatMoney">
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template slot-scope="scope">
					<router-link :to="{path:'/orders',query:{shopId:scope.row.shop_id,create_start:scope.row.settlement_date}}">
						<el-button type="primary" size="small">订单明细</el-button>
					</router-link>
					<el-button type="primary" size="small" @click="exportSettlement(scope.$index, scope.row)">导出结算单</el-button>
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
				dateMonth:'',
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
					name: ''
				},
				dateTimePicker:[],
				settlement_date_start:'',
				settlement_date_end:'',
				Settlement:[],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
			}
		},
		methods: {
			formatMoney(row, column){
				return row.settlement_val/100;
			},
			formatGMTToStr(row, column){
				let date = new Date(row.settlement_date)
				let Str=date.getFullYear() + '-' +
				(date.getMonth() + 1) + '-' + 
				date.getDate()
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
			handleCurrentChange(val) {
				this.page = val;
				this.getSettlement();
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
			//时间转换 年月日
			GMTToStr1(time){
				let date = new Date(time)
				let Str=date.getFullYear() + '-' +
				(date.getMonth() + 1) + '-' + 
				date.getDate()
				return Str
			},
			//获取结算单
			getSettlement() {
				if(this.dateTimePicker.length > 0){
					if(this.dateTimePicker[0]){
						this.settlement_date_start = this.GMTToStr(this.dateTimePicker[0])
					}else{
						this.settlement_date_start = ''
					}
				 	if(this.dateTimePicker[1]){
						this.settlement_date_end = this.GMTToStr(this.dateTimePicker[1])
					}else{
						this.settlement_date_end = ''
					}
				 }
				this.listLoading = true
				this.$http.post(common.apidomain + '/order/listSettlement',{
					"shop_id": this.shopForm.value,
					"settlement_date_start":this.settlement_date_start,
					"settlement_date_end":this.settlement_date_end,
					"pageNum":this.page,
					"pageSize": 20
				}).then(function(res){
					this.Settlement = res.body.data.list
					this.total = res.body.data.total					
					this.listLoading = false
				})
			},
			//导出结算单
			exportSettlement(index,row){
				let url = common.apidomain + '/order/exportSettlement' + '?datastr=' + this.GMTToStr1(row.settlement_date)
				window.location.href = url
			}
		},
		mounted() {
			this.getSettlement();
			this.getSchoolId();
			this.getShopId();
		}
	}

</script>

<style scoped>

</style>