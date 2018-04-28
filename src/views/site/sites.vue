<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" >查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="province" label="省份" width="120">
			</el-table-column>
			<el-table-column prop="city" label="城市" width="100">
			</el-table-column>
			<el-table-column prop="schoolId" label="校区编号" width="150">
			</el-table-column>
			<el-table-column prop="schoolName" label="校区名称" width="150">
			</el-table-column>
			<el-table-column prop="universityCode" label="学校代码" width="150">
			</el-table-column>
			<el-table-column prop="universityName" label="所属大学" min-width="120">
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template slot-scope="scope">
                    
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<router-link v-bind="{to:'/siteinfo/'+scope.row.schoolId}">
                    	<el-button type="primary" size="small" >查看宿舍</el-button>
					</router-link>
					<router-link v-bind="{to:'/shopFilter/'+scope.row.schoolId}">
                    	<el-button  size="small" >食堂分类</el-button>
					</router-link>		
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑校区" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                
                <el-form-item label="选择省/市">  
                    <el-cascader
						:options="editoptions"
						@change="handleChange"
						v-model="editselectedOptions">
					</el-cascader>
                </el-form-item>
				<el-form-item label="学校代码" prop="universityCode">
					<el-input v-model.number="editForm.universityCode" ></el-input>
				</el-form-item> 
				<el-form-item label="学校名称" prop="universityName">
					<el-input v-model="editForm.universityName" ></el-input>
				</el-form-item> 
                <el-form-item label="校区名称" prop="schoolName">
					<el-input v-model="editForm.schoolName" ></el-input>
				</el-form-item> 
			
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增校区" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="选择省/市" >  
                    <el-cascader
						:options="addForm.addoptions"
						@change="handleChange">
					</el-cascader>
                </el-form-item>
				<el-form-item label="学校名称" prop="universityName">
					<el-input v-model="addForm.universityName" placeholder="输入学校名称"></el-input>
				</el-form-item> 
				<el-form-item label="学校代码" prop="universityCode">
					<el-input v-model.number="addForm.universityCode" placeholder="输入学校代码"></el-input>
				</el-form-item>
				<el-form-item>
				<a href="http://et.ynau.edu.cn/doctor/degreeconfirm/student/dwm.htm" target="view_window">高等学校及科研机构代码查询</a>
				</el-form-item>
                <el-form-item label="校区名称" prop="schoolName">
					<el-input v-model="addForm.schoolName" placeholder="输入校区名称"></el-input>
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

				filters: {
					name: ''
				},
				users: [
                ],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				addFormVisible: false,//新增界面是否显示
				addLoading: false,//提交时load是否显示
				addFormRules: {
					universityCode: [
						{ required: true, message: '学校代码不能为空'},
     					{ type: 'number', message: '学校代码必须为数字值'}
					],
					universityName: [
						{ required: true, message: '请输入学校名称', trigger: 'blur' }
					],
					schoolName : [
						{ required: true, message: '请输入校区名称', trigger: 'blur' }
					],
				},
				//新增界面数据
				addForm: {
					schoolName: '',
					province: '',
					city: '',
					universityName: '',
					universityCode: '',
					addoptions: [{
						value: '湖南省',
						label: '湖南省',
						children: [{
						value: '长沙市',
						label: '长沙市',
						}],
						},{
						value: '湖北省',
						label: '湖北省',
						children: [{
						value: '武汉市',
						label: '武汉市',
					}],
				   }],
				},
				
                //编辑界面数据
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,//提交时load是否显示
				//编辑页面数据验证
				editFormRules: {
					universityCode: [
						{ required: true, message: '学校代码不能为空'},
     					{ type: 'number', message: '学校代码必须为数字值'}
					],
					universityName: [
						{ required: true, message: '请输入学校名称', trigger: 'blur' }
					],
					schoolName : [
						{ required: true, message: '请输入校区名称', trigger: 'blur' }
					]
				},
				editselectedOptions:[],

				editForm: {
					schoolId:'',
					schoolName: '',
					province: '',
					city: '',
					universityName: '',
					universityCode: ''
				},
				editoptions: [{
				    value: '湖南省',
				    label: '湖南省',
				    children: [{
					   value: '长沙市',
				   	   label: '长沙市',
				    }],
					},{
				    value: '湖北省',
				    label: '湖北省',
				    children: [{
					   value: '武汉市',
				   	   label: '武汉市',
				   }],
				   }
				],
			}
		},
		methods: {
			//分页
			handleCurrentChange(val){
				this.page = val;
				this.getListSchool();
			},
            handleChange(value) {
				this.addForm.province = value[0];
				this.addForm.city = value[1];
            },
			
			//获取学校信息
			getListSchool(){
				this.listLoading = true;
				this.$http.post(common.apidomain + '/address/listSchool').then(function(res){
					  this.users = res.body.data
					  this.listLoading = false;
              	})
			},
			//删除学校
			handleDel(index,row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { schoolId: row.schoolId };
					this.$http.post(common.apidomain + '/address/deleteSchoolById',para).then((res) => {
						this.listLoading = false;
						if(res.body.status == 200){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getListSchool();
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
	
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//新增学校
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$http.post(common.apidomain + '/address/addSchool',
								{"city":this.addForm.city,
					 		 	"province":this.addForm.province,
					  			"schoolName":this.addForm.schoolName,
					  			"universityCode":this.addForm.universityCode,
								"universityName":this.addForm.universityName
								}).then(function(res){
								this.addLoading = false;
								if(res.body.status == 200){
									this.$message({
										message: '新增成功',
										type: 'success'
									});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getListSchool();
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

			//显示编辑界面
			handleEdit(index, row){
				this.editFormVisible = true;
				row.universityCode = parseInt(row.universityCode)
				this.editForm = Object.assign({}, row);
				this.editselectedOptions = [row.province,row.city]	
			},
			
			//编辑学校
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post(common.apidomain + '/address/updateSchoolById',
								{"schoolId":this.editForm.schoolId,
								"city":this.editForm.city,
					 		 	"province":this.editForm.province,
					  			"schoolName":this.editForm.schoolName,
					  			"universityCode":this.editForm.universityCode,
								"universityName":this.editForm.universityName
								}).then(function(res){
								this.editLoading = false;
								if(res.body.status == 200){
									this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getListSchool();
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
			
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			//this.getUsers();
			this.getListSchool();
		}
	}

</script>

<style scoped>
	.el-button+.el-button{
		margin-left: 0;
	}
	a{
		color: #0094ff;
	}
</style>