<template>
	<div>
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
					<el-button type="primary" v-on:click="getListgoods">查询</el-button>
				</el-form-item>
				<el-form-item style="float:right" v-if="show">
					<el-button type="success" @click="backto">返回</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="goodsList" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="goodsImg" label="商品图片" width="120" >
				<template slot-scope="scope">
                	<img :src="scope.row.goodsImg" alt="" width="50" height="50" style="padding-top:6px;"/>
            	</template>
			</el-table-column>
			<el-table-column prop="goodsId" label="商品编号" width="150">
			</el-table-column>
			<el-table-column prop="goodsName" label="商品名称" width="150">
			</el-table-column>
			<el-table-column prop="goodsPrice" label="商品价格(元)" width="150" sortable :formatter="formatMoney">
			</el-table-column>
			<el-table-column prop="goodsInfo" label="商品描述" width="150">
			</el-table-column>
			<el-table-column prop="shopName" label="商家名称" width="150">
			</el-table-column>
			<el-table-column prop="schoolName" label="所属校区" min-width="150">
			</el-table-column>
			
			<el-table-column label="操作" width="200" prop="status">
				<template slot-scope="scope">
					<el-button v-show="scope.row.status" type="danger" size="small" @click="handleDown(scope.$index, scope.row)">下架</el-button>
					<el-button v-show="!scope.row.status" type="primary" size="small" @click="handleUp(scope.$index, scope.row)">上架</el-button>
				</template>
			</el-table-column>
		</el-table>


		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		
	</div>
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
					name: ''
				},
				show:false,
				shopId:'', 
				goodsList: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
			}
		},
		methods: {
			formatMoney(row, column){
				return row.goodsPrice/100;
			},
			//分页
			handleCurrentChange(val){
				this.page = val;
				this.getListgoods();
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
			//获取商品列表
			getListgoods() {
				this.listLoading = true;
				this.$http.post(common.apidomain + '/goods/listGoods',{
					"pageNum":this.page,
					"pageSize":20,
					"schoolId":this.schoolForm.value,
					"shopId":this.shopForm.value
					}).then(function(res){
					if(res.body.status == 200){
						this.goodsList = res.body.data.list
						this.total = res.body.data.total
						this.listLoading = false
					}else{
						
						this.goodsList = []
						this.listLoading = false
					}
				})
			},
			//关联商家
			
			//上架
			handleUp(index,row){

				this.$http.post(common.apidomain + '/goods/updateGoods',{"goodsId":row.goodsId,"status":1}).then(function(res){
					this.getListgoods()
				})
			},
			handleDown(index,row){
				this.$http.post(common.apidomain + '/goods/updateGoods',{"goodsId":row.goodsId,"status":0}).then(function(res){
					this.getListgoods()
				})
			},
			backto(){
            this.$router.go(-1);
        }
			
		},
		mounted() {
			if(this.$route.query.shopId){
				this.show = true
			}
			let value = this.$route.query.shopId;
			if(value){
				this.shopForm.value = parseInt(value)
			}else{
				this.shopForm.value = ''
			}
			
			this.getListgoods();
			this.getSchoolId();
			this.getShopId();
		}
	}

</script>

<style scoped>
	.el-button+.el-button{
		margin-left:0px;
	}
</style>