<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
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
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" width="70" label="序号">
			</el-table-column>
			<el-table-column prop="type" label="配送员类型" width="120" :formatter="formatType">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120">
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="180">
			</el-table-column>
			<el-table-column prop="schoolName" label="所属校区" min-width="180">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model.number="editForm.mobile"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="editForm.password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false"  class="courier">
			<el-form :model="addForm" label-width="95px" :rules="addFormRules" ref="addForm">
				<el-form-item label="选择校区" prop="value">
					<el-select v-model="addForm.value" clearable placeholder="请选择校区">
						<el-option
						v-for="item in addForm.schools"
						:key="item.schoolId"
						:label="item.schoolName"
						:value="item.schoolId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="配送员类型" prop="type">
					<el-select v-model="addForm.type" clearable placeholder="请选择配送员类型">
						<el-option
						v-for="item in addoptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model.number="addForm.mobile"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="addForm.password"></el-input>
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
	import common from '../../api/common.js';

	export default {
		data() {
			return {
				schoolForm:{
					options:[{

					}],
					value:'',
				},
				courierList:[],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '姓名不能为空', trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '手机号不能为空'},
     					{ type: 'number', message: '手机号必须为数字值'}
					],
					password : [
						{ required: true, message: '密码不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					name: '',
					mobile: '',
					password: '',
					distributorId:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					value: [
						{ required: true, message: '请选择校区', trigger: 'change' }
					],
					type: [
						{ required: true, message: '请选择配送员类型', trigger: 'change' }
					],
					name: [
						{ required: true, message: '姓名不能为空', trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '手机号不能为空'},
     					{ type: 'number', message: '手机号必须为数字值'}
					],
					password : [
						{ required: true, message: '密码不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据
				addoptions: [{
						value: '1',
						label: '楼管员'
						}, {
						value: '2',
						label: '分拣员'
						}],
				addForm: {
					type:'',
					value:'',
					schools:[],//学校信息
					value1:'',
					name: '',
					mobile: '',
					password: ''
				}

			}
		},
		methods: {
			formatType(row, column){
				return row.type == 1 ? '楼管员' : row.type == 2 ? '分拣员' : '未知';
			},
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
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
			//获取用户列表
			getUsers() {
				this.listLoading = true
                this.$http.post(common.apidomain + '/distributor/listDistributor',{
					"pageNum":this.page,
					"pageSize":10,
					"schoolId":this.schoolForm.value
					}).then(function(res){
					this.total = res.body.data.total
                    this.users = res.body.data.list
					this.listLoading = false
				})
			},
			//删除
			handleDel (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { distributorId: row.distributorId };
					this.$http.post(common.apidomain +'/distributor/deleteDistributor',para).then((res) => {
						this.listLoading = false;
						if(res.body.status == 200){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm.mobile = parseInt(row.mobile)
				this.editForm.name = row.name
				this.editForm.distributorId = row.distributorId
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit(index,row) {  
				let psd_sha = hex_sha1(this.editForm.password)
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post(common.apidomain +'/distributor/updateDistributor',{
								"distributorId":this.editForm.distributorId,
								"mobile":this.editForm.mobile,
					  			"password":psd_sha,
					  			"name":this.editForm.name,
							}).then(function(res){
								this.editLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
			addSubmit() {
				let psd_sha = hex_sha1(this.addForm.password) 
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$http.post(common.apidomain +'/distributor/addDistributor',{
								"schoolId":this.addForm.value,
					 		 	"mobile":this.addForm.mobile,
					  			"password":psd_sha,
					  			"name":this.addForm.name,
								"type":this.addForm.type,
							}).then(function(res){
								this.addLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '新增成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
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
			

		},
		mounted() {
			this.getUsers();
			this.getSchoolId();
		}
	}

</script>

<style>

</style>