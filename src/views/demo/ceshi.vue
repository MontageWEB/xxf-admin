<template>
<el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
  
  <el-form-item label="活动区域" prop="region">
    <el-select v-model="addForm.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="选择校区" prop="value1">
		<el-select v-model="addForm.value1" clearable placeholder="请选择校区">
			<el-option
				v-for="item in addForm.schools"
				:key="item.schoolId"
				:label="item.schoolName"
				:value="item.schoolId">
				</el-option>
		</el-select>
	</el-form-item>
 <el-form-item>
    <el-button type="primary" @click="submitForm('addForm')">立即创建</el-button>
    <el-button @click="resetForm('addForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import common from '../../api/common.js';
  export default {
    data() {
      return {
        addForm: {
          
          region: '',
		  value1:'',
		  schools:[]
        },
        rules: {
          
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          value1: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
        }
      };
    },
    methods: {
		getSchoolId(){
				this.listLoading = true,
				this.$http.post(common.apidomain + '/address/listSchool').then(function(res){
					for(var i=0;i<res.body.data.length;i++){
						res.body.data[i].schoolId = res.body.data[i].schoolId.toString()
					}
					this.addForm.schools = res.body.data
					this.listLoading = false
				})
				
			},



      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
	},
	mounted(){
		this.getSchoolId()
	}
  }
</script>