<template>
 <div>
  <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
			<el-form :inline="true" :model="filters">
        <el-form-item>
              <el-select v-model="schoolForm.value"  clearable filterable @change="getListshop" placeholder="选择校区">
                <el-option
                v-for="item in schoolForm.options"
                :key="item.schoolId"
                :label="item.schoolName"
                :value="item.schoolId">
                </el-option>
              </el-select>
        </el-form-item>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-left:30px;margin-top:10px;">全选</el-checkbox>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="shop in cities" :label="shop.shopName" :key="shop.shopId"></el-checkbox>
        </el-checkbox-group>
    </el-form>
	<!-- </el-col> -->
  </div>
</template>

<script>
  import common from '../api/common.js';
  export default {
    data() {
      return {
        schoolForm:{
					options:[{

					}],
					value:'',
				},
        filters: {
					order_id: ''
				},
        checkAll: false,
        checkList: [],
        cities: [],
        isIndeterminate: true,
      };
    },
    methods: {
      //获取学校信息
      getSchoolId(){
				this.$http.post(common.apidomain + '/address/listSchool',{
        }).then(function(res){
					this.schoolForm.options = res.body.data
				})
			},
      //获取门店信息
      getListshop() {
				this.$http.post(common.apidomain + '/seller/listShop',{
          "schoolId":this.schoolForm.value
					}).then(function(res){
          this.cities = res.body.data.list
				 }) 
			},
      handleCheckAllChange(event) {
        let all = this.cities
        let allShop = []
        for(let i=0;i<all.length;i++){
            allShop.push(all[i].shopName)
        }
        this.checkList = event.target.checked ? allShop : [];
        //console.log(this.checkList.push(this.cities[0].shopName))
        this.isIndeterminate = false ;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    },
    mounted() {
      this.getListshop();
      this.getSchoolId()
    }
  };
</script>