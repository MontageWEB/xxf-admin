<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="schoolForm.value" clearable filterable placeholder="请选择校区">
						<el-option
						v-for="item in schoolForm.options"
						:key="item.schoolId"
						:label="item.schoolName"
						:value="item.schoolId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getListshop">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="shopList" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="schoolId" label="校区编号" width="130">
			</el-table-column>
			<el-table-column prop="shopId" label="商户编号" width="130">
			</el-table-column>
			<el-table-column prop="filterName" label="所属食堂" width="130">
			</el-table-column>
			<el-table-column prop="shopName" label="商户名称" width="160">
			</el-table-column>
			<el-table-column prop="shopPhone" label="商户电话" width="130">
			</el-table-column>
			<el-table-column prop="shopPos" label="商户地址" width="180">
			</el-table-column>
			<el-table-column prop="shopInfo" label="商户描述" min-width="180">
			</el-table-column>
			<el-table-column label="操作" width="400">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<router-link :to="{path:'/goodsList',query:{shopId:scope.row.shopId}}">
                   		<el-button size="small">查看商品</el-button>
                    </router-link>
					<router-link :to="{path:'/orders',query:{shopId:scope.row.shopId}}">
                   		<el-button size="small">查看订单</el-button>
                    </router-link>
					<router-link v-bind="{to:'/shopsInfo/shopAdmin/'+scope.row.shopId}">
                    	<el-button size="small">查看管理员</el-button>
                    </router-link>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="选择食堂">
					<el-select v-model="filterForm.value" filterable placeholder="请选择分类">
						<el-option
						v-for="item in filterForm.options"
						:key="item.filterId"
						:label="item.filterName"
						:value="item.filterId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商户名称" prop="shopName">
					<el-input v-model="editForm.shopName" placeholder="请输入商户描述"></el-input>
				</el-form-item> 
                <el-form-item label="商户电话" prop="shopPhone">
					<el-input v-model.number="editForm.shopPhone" placeholder="请输入商户描述"></el-input>
				</el-form-item> 
				<el-form-item label="商户地址" prop="shopPos">
					<el-input v-model="editForm.shopPos" placeholder="请输入商户描述"></el-input>
				</el-form-item>
				<el-form-item label="商户描述" prop="shopInfo">
					<el-input type="textarea" v-model="editForm.shopInfo" placeholder="请输入商户描述"></el-input>
				</el-form-item>
				<el-form-item label="商户图片" prop="shopImg">
				<upload :bizName="bizName" :imageUrl="editForm.shopImg" @on-result-change="onResultChangeEdit"></upload>
				</el-form-item>
				  
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="选择校区" prop="value1">
					<el-select v-model="addForm.value1" @change="getFilter" placeholder="请选择校区">
						<el-option
						v-for="item in addForm.schools"
						:key="item.schoolId"
						:label="item.schoolName"
						:value="item.schoolId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择食堂" prop="filterValue">
					<el-select v-model="addForm.filterValue"   placeholder="请选择分类">
						<el-option
						v-for="item in addForm.filter"
						:key="item.filterId"
						:label="item.filterName"
						:value="item.filterId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商户名称" prop="shopName">
					<el-input v-model="addForm.shopName" placeholder="请输入商户名称"></el-input>
				</el-form-item> 
                <el-form-item label="商户电话" prop="shopPhone">
					<el-input v-model.number="addForm.shopPhone" placeholder="请输入商户电话"></el-input>
				</el-form-item> 
				<el-form-item label="商户地址" prop="shopPos">
					<el-input v-model="addForm.shopPos" placeholder="请输入商户地址"></el-input>
				</el-form-item>
				<el-form-item label="商户描述" prop="shopInfo">
					<el-input type="textarea" v-model="addForm.shopInfo" placeholder="请输入商户描述"></el-input>
				</el-form-item>
				<el-form-item label="商户图片" prop="shopImg">
					<upload :bizName="bizName" :imageUrl="addForm.shopImg" @on-result-change="onResultChangeAdd"></upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import upload from '../../components/upload.vue';
	import common from '../../api/common.js';
	export default {
		components:{ upload },
		data() {
			return {
				schoolForm:{
					options:[{

					}],
					value:'',
				},
				filterForm:{
					options:[{

					}],
					value:'',
				},
				toolbarForm:{
					options: [{
						value: '1',
						label: '食堂'
						}, {
						value: '2',
						label: '超市'
						}],
					value:'',
				},
				bizName:"shops",
				filters: {
					schoolId: ''
				},
				shopList: [
				],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					shopName: [
						{ required: true, message: '商户名称不能为空', trigger: 'blur' }
					],
					shopPhone: [
						{ required: true, message: '商户电话不能为空'},
     					{ type: 'number', message: '商户电话必须为数字'}
					],
					shopPos: [
						{ required: true, message: '商户地址不能为空'},
					],
					filterValue: [
						{ required: true, message: '请选择食堂', trigger: 'change' }
					]
				},
				//编辑界面数据
				editoptions: [{
						value: '1',
						label: '食堂'
						}, {
						value: '2',
						label: '超市'
						}],
				editForm: {
					type1:'',
					type:'',
					shopId:'',
					schoolId: '',
					shopName: '',
					shopPhone: '',
					shopPos: '',
					shopInfo: '',
					shopImg: '',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					shopName: [
						{ required: true, message: '商户名称不能为空', trigger: 'blur' }
					],
					shopPhone: [
						{ required: true, message: '商户电话不能为空'},
     					{ type: 'number', message: '商户电话必须为数字'}
					],
					shopPos: [
						{ required: true, message: '商户地址不能为空'},
					],
					value1: [
						{ required: true, message: '请选择校区', trigger: 'change' }
					],
					filterValue: [
						{ required: true, message: '请选择食堂', trigger: 'change' }
					]
				},
				//新增界面数据
				addForm: {
					filterValue:'',
					value:'',
					schools:[],//学校信息
					filter:[],//分类信息
					value1:'',
					shopName: '',
					shopPhone: '',
					shopPos: '',
					shopInfo: '',
					shopImg: ''
				}

			}
		},
		methods: {
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.getListshop();
			},
			//获取学校信息
			getSchoolId(){
				this.listLoading = true,
				this.$http.post(common.apidomain + '/address/listSchool').then(function(res){
					for(var i=0;i<res.body.data.length;i++){
						res.body.data[i].schoolId = res.body.data[i].schoolId.toString()
					}
					this.addForm.schools = res.body.data
					this.schoolForm.options = res.body.data
					this.listLoading = false
				})
				
			},
			//获取商家列表
			getListshop() {
				this.listLoading = true;
				this.$http.post(common.apidomain + '/seller/listShop',{
					"schoolId":this.schoolForm.value,
					"type":1,
					"pageNum":this.page,
					"pageSize": 20
					}).then(function(res){
					this.listLoading = false;
					this.total = res.body.data.total
					let objs = res.body.data.list
					for(var i=0;i<objs.length;i++){
						var type1 = objs[i].type;
						if(type1 == 1){
							objs[i].type = "食堂"
						} else if(type1 == 2){
							objs[i].type = "超市"
						}
					}
					
					this.shopList = objs;
					
				 })
				 
			},
			//删除
			handleDel(index,row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { shopId: row.shopId };
					this.$http.post(common.apidomain +'/seller/deleteShop',para).then((res) => {
						this.listLoading = false;
						if(res.body.status == 200){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getListshop();
						}else{
							this.$message({
								message: '删除失败,请稍后再试',
								type: 'warning'
							});
						}
					});
				}).catch(() => {
					
				});  
			},
			//显示编辑界面
			handleEdit(index, row){
				this.editFormVisible = true;
				row.shopPhone = parseInt(row.shopPhone)
				this.editForm = Object.assign({}, row);
				let type1 = this.editForm.type
				if(type1 == "食堂"){
					this.editForm.type1 = 1
				}else if(type1 == "超市"){
					this.editForm.type1 = 2
				}
				let filterId = row.schoolId
				this.getFilter(filterId)
				this.filterForm.value = row.filterName
				
			},
			//显示新增界面
			handleAdd(){
				this.addFormVisible = true
				this.getSchoolId()
			},
			//编辑
			editSubmit(){  
				console.log(this.editForm.filterValue)
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post(common.apidomain +'/seller/updateShop',{
								"shopId":this.editForm.shopId,
					 		 	"schoolId":this.editForm.schoolId,
					  			"shopName":this.editForm.shopName,
					  			"shopPhone":this.editForm.shopPhone,
								"shopPos":this.editForm.shopPos,
								"shopInfo":this.editForm.shopInfo,
								"type":this.editForm.type1,
								"shopImg":this.editForm.shopImg,
								"filterId":this.filterForm.value
							}).then(function(res){
								this.editLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getListshop();
								}else{
									this.$message({
										message: '编辑失败,请稍后再试',
										type: 'warning'
									});
								}
              				}).catch(function(res){
								  this.$message({
									message: '编辑失败,请稍后再试',
									type: 'warning'
								});
							  })
						});
					}
				});
			},
			//新增
			addSubmit(){ 
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$http.post(common.apidomain +'/seller/addShop',{
								"schoolId":this.addForm.value1,
					 		 	"shopName":this.addForm.shopName,
					  			"shopPhone":this.addForm.shopPhone,
					  			"shopPos":this.addForm.shopPos,
								"shopInfo":this.addForm.shopInfo,
								"type":1,
								"shopImg":this.addForm.shopImg,
								"filterId":this.addForm.filterValue
							}).then(function(res){
								this.addLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '新增成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getListshop();
								}else{
									this.$message({
										message: '新增失败,请稍后再试',
										type: 'warning'
									});
								}
              				}).catch(function(res){
								  this.$message({
									message: '新增失败,请稍后再试',
									type: 'warning'
								});
							  })
						});
					}
				});
				
			},
			//查询所有分类列表
        	 getFilter(filterId){
				this.listLoading = true,
				this.$http.post(common.apidomain + '/address/getFilterByRefSchoolId',{
					"refSchoolId":this.addForm.value1,
					"refSchoolId":filterId
                }).then(function(res){
					for(var i=0;i<res.body.data.length;i++){
						res.body.data[i].filterId = res.body.data[i].filterId.toString()
					}
					this.addForm.filter = res.body.data
					this.filterForm.options = res.body.data
					this.listLoading = false
				})
        	 },
			onResultChangeAdd(val){
				this.addForm.shopImg = val
			},
			onResultChangeEdit(val){
        		this.editForm.shopImg=val;
      		}
		},
		mounted() {
			this.getListshop();
			this.getSchoolId()
		},
		computed:{
        	// mealBoxList () {
            // 	return this.$store.state.mealBoxList
        //}
    }
	}

</script>

<style scoped>
	.el-button+.el-button{
		margin-left: 0;
	}
</style>