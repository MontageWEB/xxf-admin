<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-select v-model="schoolForm.value" clearable filterable placeholder="请选择校区">
						<el-option
						v-for="item in schoolForm.options"
						:key="item.schoolId"
						:label="item.schoolName"
						:value="item.schoolId">
						</el-option>
					</el-select>
				</el-form-item> -->
				<!-- <i class="el-icon-more-outline"></i> -->
                <el-form-item>
					<el-input v-model="filters.name" placeholder="昵称"></el-input>
				</el-form-item>
                 <!-- <el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				 
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" label="序号" width="70">
			</el-table-column>
			<el-table-column prop="avatar" label="头像" width="150">
				<template slot-scope="scope">
                	<img :src="users.avatar" alt="" width="40" height="40" style="padding-top:6px;"/>
            	</template>
			</el-table-column>
			<el-table-column prop="nickname" label="昵称" width="220">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="120" :formatter="formatSex">
			</el-table-column>
			<el-table-column prop="createTime" label="注册日期" min-width="100" :formatter="formatCreate">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<router-link :to="{path:'/orders',query:{userId:scope.row.userId}}">
						<el-button type="primary" size="small">查看订单</el-button>
					</router-link>	
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


		
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
				filters: {
                    name: '',
                    phone:''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            //转换注册时间
            formatCreate(row, column){
				let date =  new Date(row.createTime);
				let y = 1900+date.getYear();
				let m = "0"+(date.getMonth()+1);
				let d = "0"+date.getDate();
				return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
            },
			handleCurrentChange(val){
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
                this.listLoading = true
                this.$http.post(common.apidomain + '/user/listUser',{"pageNum":this.page,"pageSize":20}).then(function(res){
                    this.users = res.body.data.list
                    this.total = res.body.data.total
					this.listLoading = false
				})
			},
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>