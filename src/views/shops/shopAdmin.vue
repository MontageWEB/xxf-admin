<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item style="float:right">
					<el-button type="success" @click="backto">返回</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        <!-- 列表 -->
        <el-table :data="listShopSeller" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
            <el-table-column prop="shopId" label="商家编号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="shopSellerId" label="管理员编号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" min-width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
        <!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model.number="addForm.mobile" placeholder="输入手机号"></el-input>
				</el-form-item> 
                <el-form-item label="密码" prop="password">
					<el-input type="password" v-model="addForm.password" placeholder="输入密码"></el-input>
				</el-form-item> 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        <!-- 编辑页面 -->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model.number="editForm.mobile" placeholder="输入手机号"></el-input>
				</el-form-item>
                <el-form-item label="密码" prop="password">
					<el-input type="password" v-model="editForm.password" placeholder="输入密码"></el-input>
				</el-form-item> 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
    </section>
</template>

<script>
 import common from '../../api/common.js';
export default {
    data(){
        return{
            filters:'',
            listShopSeller:[],
            shopId: '',
            listLoading: false,

            addLoading:false,
            addFormVisible: false,//新增界面是否显示
            addForm:{
                mobile:'',
                password:''
            },
			addFormRules: {
				mobile: [
					{ required: true, message: '手机号不能为空'},
     				{ type: 'number', message: '手机号必须为数字值'}
				],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			},

            editLoading:false,
            editFormVisible: false,//新增界面是否显示
            editForm:{
                mobile:'',
				password:'',
				shopSellerId:''
			},
			editFormRules: {
				mobile: [
					{ required: true, message: '手机号不能为空'},
     				{ type: 'number', message: '手机号必须为数字值'}
				],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			},
        }
    },
    methods: {
        //显示新增页面
        handleAdd(){
            this.addFormVisible = true
        },
	
        //获取管理员列表
        getlistShopSeller(){
            this.$http.post(common.apidomain + '/seller/listShopSeller',{"shopId":this.shopId}).then(function(res){
                    this.listShopSeller = res.body.data
                    
              })
        },
        //新增管理员
        addSubmit(){
            let psd_sha = hex_sha1(this.addForm.password) 
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$http.post(common.apidomain +'/seller/addShopSeller',{
								"mobile":this.addForm.mobile,
					 		 	"password":psd_sha,
					  			"shopId":this.shopId,
							}).then(function(res){
								this.addLoading = false;
								if(res.body.status == 200){
									this.$message({
										message: '新增成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getlistShopSeller();
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
		//显示编辑页面
		handleEdit(index, row){
			this.editFormVisible = true
			this.editForm.mobile = parseInt(row.mobile)
			this.editForm.shopSellerId = row.shopSellerId
		},
		//编辑管理员
		editSubmit(){
			let psd_sha = hex_sha1(this.editForm.password) 
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						this.$http.post(common.apidomain + '/seller/updateShopSeller',
							{
								"shopSellerId":this.editForm.shopSellerId,
								"mobile":this.editForm.mobile,
								"password":psd_sha,
					 		}).then(function(res){
								this.editLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getlistShopSeller();
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
		//删除
		handleDel(index,row){
			this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$http.post(common.apidomain + '/seller/deleteShopSeller',{"shopSellerId":row.shopSellerId}).then((res) => {
						this.listLoading = false;
						if(res.body.status == 200){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getlistShopSeller();
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
        backto(){
            this.$router.go(-1);
        }
    },
    mounted(){
        //获取url传入的id值
		this.shopId = this.$route.params.id;
		this.getlistShopSeller();
	},
}
</script>

<style scoped>
	.el-button+.el-button{
		margin-left: 0;
	}
</style>