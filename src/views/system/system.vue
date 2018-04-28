<template>
	<section class="system">
		<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="adminLists" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="150">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="150">
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="180">
			</el-table-column>
			<el-table-column prop="birth" label="新增日期" min-width="120">
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button type="primary" size="small" @click="handleAddShops(scope.$index, scope.row)">添加门店</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新增页面 -->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" placeholder="输入姓名"></el-input>
				</el-form-item> 
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addForm.mobile" placeholder="输入手机号"></el-input>
				</el-form-item> 
                <el-form-item label="密码" prop="password">
					<el-input type="password" v-model="addForm.password" placeholder="输入密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="addForm.checkPass" auto-complete="off" placeholder="再次输入密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="resetForm('addForm')">重置</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 编辑页面 -->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" placeholder="输入姓名"></el-input>
				</el-form-item> 
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile" placeholder="输入手机号"></el-input>
				</el-form-item> 
                <el-form-item label="密码" prop="password">
					<el-input type="password" v-model="editForm.password" placeholder="输入密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="editForm.checkPass" auto-complete="off" placeholder="再次输入密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="resetForm('editForm')">重置</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--添加门店-->
		<el-dialog title="添加门店" v-model="addShopsVisible" :close-on-click-modal="false">
			<el-form :model="addShops" label-width="80px" ref="addShops">
				<checkboxShops></checkboxShops>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addShopsVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addShopsSubmit" :loading="addShopsLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	
	import checkboxShops from '../../components/checkboxShops.vue';
	export default {
		components: {
      		checkboxShops
    	},
		data() {
			// 表单密码验证
			 	var validatePass = (rule, value, callback) => {
					if (value === '') {
					callback(new Error('请输入密码'));
					} else {
					if (this.addForm.checkPass !== '') {
						this.$refs.addForm.validateField('checkPass');
					}
					callback();
					}
				};
				var validatePass2 = (rule, value, callback) => {
					if (value === '') {
					callback(new Error('请再次输入密码'));
					} else if (value !== this.addForm.password) {
					callback(new Error('两次输入密码不一致!'));
					} else {
					callback();
					}
				};
				var validatePass3 = (rule, value, callback) => {
					if (value === '') {
					callback(new Error('请输入密码'));
					} else {
					if (this.editForm.checkPass !== '') {
						this.$refs.editForm.validateField('checkPass');
					}
					callback();
					}
				};
				var validatePass4 = (rule, value, callback) => {
					if (value === '') {
					callback(new Error('请再次输入密码'));
					} else if (value !== this.editForm.password) {
					callback(new Error('两次输入密码不一致!'));
					} else {
					callback();
					}
				};
			return {
				filters: {
					name: ''
				},
				adminLists:[
					{
						name:"张三",
						phone:"13612914754",
						birth:"2018-02-08",
						sex:"男"
					}
				],
				listLoading: false,

				addLoading:false,
            	addFormVisible: false,//新增界面是否显示
            	addForm:{
					name:'',
               	 	mobile:'',
                	password:'',
					checkPass:''
            	},
				addFormRules:{
					password: [
           			 	{ required: true, validator: validatePass, trigger: 'blur' }
         			],
          			checkPass: [
            			{ required: true, validator: validatePass2, trigger: 'blur' }
          			],
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					]
				},
				
				editLoading:false,
            	editFormVisible: false,//编辑界面是否显示
            	editForm:{
					name:'',
               	 	mobile:'',
                	password:'',
					checkPass:''
				},
				editFormRules:{
					password: [
           			 	{ required: true, validator: validatePass3, trigger: 'blur' }
         			],
          			checkPass: [
            			{ required: true, validator: validatePass4, trigger: 'blur' }
          			],
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					]
				},
				
				addShopsVisible: false,//添加门店是否显示
				addShopsLoading: false,
				addShops:{}
			}
		},
		methods: {
				handleAdd(){
					this.addFormVisible = true
				},
			  	handleEdit(){
					this.editFormVisible = true
			   	},
			   	handleDel(){

			   	},
			   	handleAddShops(){
				   this.addShopsVisible = true
			   	},
				resetForm(formName){
					this.$refs[formName].resetFields();
				},
				addShopsSubmit(){
					this.addShopsVisible = false
				}          
		},
		mounted() {
		
		}
	}

</script>

<style>
	.system .el-checkbox-group .el-checkbox{
		margin-right: 15px;
	}
	.system .el-checkbox+.el-checkbox{
		margin-left: 0px;
	}
</style>
