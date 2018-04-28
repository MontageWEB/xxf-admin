<template>
    <section>
        <!-- 工具条 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item style="float:right">
					<el-button type="success" @click="backto">返回</el-button>
				</el-form-item>
			</el-form>
		</el-col>

        <!-- 表格 -->
        <el-table :data="building" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="schoolId" label="校区编号" width="180">
			</el-table-column>
			<el-table-column prop="buildingId" label="宿舍编号" width="200">
			</el-table-column>
			<el-table-column prop="buildingName" label="宿舍名称" min-width="200">
            </el-table-column>
			<el-table-column label="操作" width="220">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!-- 新增页面 -->
        <el-dialog title="新增宿舍" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormrules" ref="addForm">
				<el-form-item label="宿舍名称" prop="buildingName">
					<el-input v-model="addForm.buildingName" placeholder="输入宿舍名称"></el-input>
				</el-form-item> 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 编辑页面 -->
		<el-dialog title="编辑宿舍" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormrules" ref="editForm">
				<el-form-item label="宿舍名称" prop="buildingName">
					<el-input v-model="editForm.buildingName" ></el-input>
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
 export default{
     data(){
        return{
            id:0,
            listLoading: false,
            building:[],

            addFormVisible:false,
            addLoading: false,
            //新增界面数据
			addForm: {
				buildingName: '',
				schoolId: ''
            },
            addFormrules:{
                buildingName: [
						{ required: true, message: '宿舍名称不能为空', trigger: 'blur' }
                    ], 
			},
			
			//编辑界面数据
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,//提交时load是否显示
			editForm:{
				buildingName: '',
				buildingId:''
			},
			editFormrules:{
				buildingName: [
						{ required: true, message: '宿舍名称不能为空', trigger: 'blur' }
                    ], 
			}
        }
    },
     methods:{
        //获取宿舍信息
        getBuilding(){
                this.listLoading = true,
                this.$http.post(common.apidomain + '/address/getBuildingBySchoolId',{"schoolId":this.id,}).then(function(res){
                    this.building = res.body.data
                    this.listLoading = false
              })
        },
        //显示增加页面 
        handleAdd(){
            this.addFormVisible = true;
            this.addForm = {
				buildingName: '',
				schoolId: this.id
					
			};
        },
        //编辑
        handleEdit(index, row){
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						this.$http.post(common.apidomain + '/address/updateBuildingById',
							{
								"buildingId":this.editForm.buildingId,
								"buildingName":this.editForm.buildingName,
					 		}).then(function(res){
								this.editLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getBuilding();
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
					let para = { buildingId: row.buildingId };
					this.$http.post(common.apidomain + '/address/deleteBuildingById',para).then((res) => {
						this.listLoading = false;
						if(res.body.status == 200){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getBuilding();
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
        //增加宿舍
        addSubmit(){
            this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$http.post(common.apidomain + '/address/addBuildingBySchoolId',
								{"buildingName":this.addForm.buildingName,
					 		 	"schoolId":this.addForm.schoolId,}).then(function(res){
									this.addLoading = false;
								if(res.body.status == 200){
									this.$message({
										message: '新增成功',
										type: 'success'
									});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getBuilding();
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
        //返回上一级
        backto(){
            this.$router.go(-1);
        }
    },
    mounted(){
        //获取url传入的id值
        this.id = this.$route.params.id;
        this.getBuilding()
	},
 }
</script>

<style>

</style>


