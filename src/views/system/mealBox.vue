<template>
    <section>
        <!--工具条-->
		<!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->

        <el-table :data="mealBoxList" highlight-current-row v-loading="listLoading" style="width: 100%;margin-top:15px;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="name" label="餐盒费标准" width="180">
			</el-table-column>
			<el-table-column prop="maxFee" label="订单金额（M元）" width="180" :formatter="formatMeals">
			</el-table-column>
			<el-table-column prop="mealsFee" label="收费标准（元）" width="180" :formatter="formatMoney">
			</el-table-column>
            <el-table-column prop="comment" label="说明" min-width="180">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

        <!-- 编辑页面 -->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px"  ref="editForm">
				<el-form-item label="餐盒费标准名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="收费标准">
					<el-input-number v-model="editForm.mealsFee" :min="1" :max="100000" :step="0.1"></el-input-number>
				</el-form-item>
				<el-form-item label="说明">
					<el-input type="textarea" v-model="editForm.comment"></el-input>
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
            mealBoxList:[],
            addLoading: false,
            editLoading: false,
            listLoading: false,

            editFormVisible: false,
            editForm:{
                name:'',
                mealsFee:'',
                comment:'',
                feeId:''
            }
        }
    },
    methods: {
        formatMeals(row, column){
            if(row.maxFee == 50000){
                return "M>" + row.minFee/100
            }else{
                return row.minFee/100 + "<M≤" + row.maxFee/100
            } 
        },
        formatMoney(row, column){
				return row.mealsFee/100;
		},
        //获取餐盒费数据
        getMealslist(){
				this.listLoading = true,
				this.$http.post(common.apidomain + '/meals/getAll',).then(function(res){
					this.mealBoxList = res.body.data
					this.listLoading = false
				})
			},
        handleEdit(index,row){
            this.editFormVisible = true
            this.editForm.name = row.name
            this.editForm.mealsFee = row.mealsFee/100
            this.editForm.comment = row.comment
            this.editForm.feeId = row.feeId
        },
        editSubmit(){
            let mealsFee = this.editForm.mealsFee * 100
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						this.$http.post(common.apidomain + '/meals/updateMealsFee',
							{
								"name":this.editForm.name,
								"mealsFee":mealsFee,
                                "comment":this.editForm.comment,
                                "feeId":this.editForm.feeId
					 		}).then(function(res){
								this.editLoading = false;
								if(res.body.status == 200){
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getMealslist();
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
        
    },
    mounted(){
        this.getMealslist()
    }
    
}
</script>

<style>

</style>

