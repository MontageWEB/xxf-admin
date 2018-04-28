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
        <el-table :data="listFilter" highlight-current-row v-loading="listLoading"  style="width: 100%;">
            <el-table-column type="index" label="序号" width="120">
			</el-table-column>
			<el-table-column prop="refSchoolId" label="校区编号" width="200">
			</el-table-column>
			<el-table-column prop="filterId" label="分类编号" width="200">
			</el-table-column>
            <el-table-column prop="filterName" label="分类名称" min-width="200">
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
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="分类名称">
					<el-input v-model="addForm.filterName"  placeholder="输入分类名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="分类名称">
					<el-input v-model="editForm.filterName" auto-complete="off"></el-input>
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
            listFilter:[],
            schoolId:'',
            listLoading: false,
            addFormVisible: false,
            addLoading: false,
            addForm: {
				filterName: '',
            },

            editFormVisible: false,
            editLoading: false,
            editForm:{
                "filterId":"",
	   			"filterName":"",
	   			"refSchoolId":""
            }
        }
    },
    methods:{
        //查询所有分类列表
         getFilter(){
				this.listLoading = true,
				this.$http.post(common.apidomain + '/address/getFilterByRefSchoolId',{
                    "refSchoolId":this.schoolId
                }).then(function(res){
					this.listFilter = res.body.data
					this.listLoading = false
				})
         },
        
        handleAdd(){
			this.addFormVisible = true
			this.addForm = {
				filterName: '',	
			};
        },
		//新增食堂分类
        addSubmit(){
            this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$http.post(common.apidomain + '/address/addFilterBySchoolId',{
                                "filterName":this.addForm.filterName,
                                "refSchoolId":this.schoolId
                            ,}).then(function(res){
									this.addLoading = false;
								if(res.body.status == 200){
									this.$message({
										message: '新增成功',
										type: 'success'
									});
								this.addFormVisible = false;
								this.getFilter()
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
        handleEdit(index, row){
            this.editFormVisible = true
			this.editForm.filterId = row.filterId
			this.editForm.filterName = row.filterName
			this.editForm.refSchoolId = row.refSchoolId
        },
		//编辑食堂分类
        editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						this.$http.post(common.apidomain + '/address/updateFilterById',
							{
								"filterId":this.editForm.filterId,
	   							"filterName":this.editForm.filterName,
	   							"refSchoolId":this.editForm.refSchoolId,
					 		}).then(function(res){
								this.editLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.editFormVisible = false;
								this.getFilter();
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
		//删除食堂分类
		handleDel(index,row){
			this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$http.post(common.apidomain + '/address/deleteFilterById',{"filterId":row.filterId}).then((res) => {
						this.listLoading = false;
						if(res.body.status == 200){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getFilter();
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
        this.schoolId = this.$route.params.id;
        this.getFilter()
    }
}
</script>

<style>

</style>


