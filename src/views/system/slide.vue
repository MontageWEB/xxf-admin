<template>
	<section class="slide-page">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table
				:data="tableData"
				:default-sort = "{prop: 'updateAt', order: 'ascending'}"
				v-loading="listLoading"
				style="width: 100%">
				<el-table-column
					prop="orderBy"
					label="排序"
					width="100"
					sortable>
				</el-table-column>
				<el-table-column
					label="时间">
					<template slot-scope="scope">
						<span>{{ scope.row.updateTime | dateFormat('YYYY-MM-DD HH:mm:ss')}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="slideInfo"
					label="名称">
				</el-table-column>
				<el-table-column
					prop="slideImg"
					label="轮播图"
					width="200">
					<template slot-scope="scope">
						<a :href="scope.row.slideUrl" target="_blank">
							<img :src="scope.row.slideImg" class="slide-img" alt="">
						</a>
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					width="100">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.status"
							@change="statusSwitch(scope.$index, scope.row)"
							:on-value="1"
							:off-value="0">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column
					label="操作">
					<template slot-scope="scope">
						<el-button
							size="small"
							type="primary"
							@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button
							size="small"
							type="danger"
							@click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm" :rules="editFormRules">
				<el-form-item label="ID" prop="slideId">
					<el-input v-model="editForm.slideId" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="slideInfo">
					<el-input v-model="editForm.slideInfo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" prop="slideImg">
					<!--<slide-upload :imageUrl="editForm.slideImg" :idBiz="idBiz" @on-result-change="onResultChangeEdit"></slide-upload>-->
					<upload :imageUrl="editForm.slideImg" @on-result-change="onResultChangeEdit" :bizName="bizName"></upload>
				</el-form-item>
				<el-form-item label="URL" prop="slideUrl">
					<el-input v-model="editForm.slideUrl" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="orderBy">
					<el-input v-model.number="editForm.orderBy" auto-complete="off" placeholder="填入的整数越大，排序越靠前"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-switch
						v-model="editForm.status"
						:on-value= "1"
						:off-value= "0">
					</el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="danger" @click.native="deleteSubmit">删除</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="slideInfo">
					<el-input v-model="addForm.slideInfo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" prop="slideImg">
					<!--<slide-upload :imageUrl="addForm.slideImg" :idBiz="idBiz" @on-result-change="onResultChangeAdd"></slide-upload>-->
					<upload :imageUrl="addForm.slideImg" @on-result-change="onResultChangeAdd" :bizName="bizName"></upload>
				</el-form-item>
				<el-form-item label="URL" prop="slideUrl">
					<el-input v-model="addForm.slideUrl" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="orderBy">
					<el-input v-model="addForm.orderBy" auto-complete="off" placeholder="填入的整数越大，排序越靠前"></el-input>
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
  import upload from '../../components/upload.vue';

  export default {
    data() {
      return {
        bizName: 'slide',
        filters: {
          name: ''
        },
        listLoading: false,
        tableData: [],
        //编辑界面
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          slideInfo: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        editForm: {
          slideId: '',
          slideInfo: '',
          slideImg: '',
          slideUrl: '',
          orderBy: '',
          status: ''
        },

        // 新增界面
        addFormVisible: false,
        addLoading: false,
        addFormRules: {
          slideInfo: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        addForm: {
          slideInfo: '',
          slideImg: '',
          slideUrl: '',
          orderBy: '',
          status: 0
        },

				rowForm: {
          slideId: '',
          slideInfo: '',
          slideImg: '',
          slideUrl: '',
          orderBy: '',
          status: ''
				}
      }
    },
    created() {
      this.getSlides()
    },
    methods: {
      statusSwitch(index, row){
        this.rowForm = Object.assign({}, row);
        delete this.rowForm.createTime;
        delete this.rowForm.updateTime;
        let para = this.rowForm;
        this.doEdit(para);
      },
      getSlides(){
        this.listLoading = true;
        let url = common.apidomain + '/slide/getAllSlide';
        let para = {};
        this.$http.post(url, para).then((res) => {
          this.tableData = res.body.data;
          this.listLoading = false;
        }, (error) => {
          console.log(error)
        })
      },
      handleAdd(){
        this.addFormVisible = true;
        this.addForm = {
          slideInfo: '',
          slideImg: '',
          slideUrl: '',
          orderBy: '',
          status: 0
        };
      },
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = { slideId: row.slideId };
          this.doDelete(para);
        }).catch(() => {
        });
      },
      deleteSubmit() {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = { slideId: this.editForm.slideId };
          this.doDelete(para);
        }).catch(() => {
        });
      },
			doDelete(para){
        let url = common.apidomain + '/slide/deleteSlide';
        this.$http.post(url, para).then((res) => {
          this.listLoading = false;
          this.editFormVisible = false;
          this.$message({
            message: '成功',
            type: 'success'
          });
          this.getSlides()
        }, (error) => {
          console.log(error)
        })
			},
      editSubmit: function () {
        let para = Object.assign({}, this.editForm);
        delete para.createTime;
        delete para.updateTime;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.doEdit(para);
            });
          }
        });
      },
			doEdit(para){
        let url = common.apidomain + '/slide/updateSlide';
        this.$http.post(url, para).then((res) => {
          this.editLoading = false;
          this.$message({
            message: '成功',
            type: 'success'
          });
          this.editFormVisible = false;
          this.getSlides()
        }, (error) => {
        })
			},
      addSubmit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              let url = common.apidomain + '/slide/addSlide';
              let para = Object.assign({}, this.addForm);
              this.$http.post(url, para).then((res) => {
                this.addLoading = false;
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.addFormVisible = false;
                this.getSlides()
              }, (error) => {
                console.log(error)
              })
            }).catch(() => {

            });
          }
        });
      },
      onResultChangeEdit(val){
        this.editForm.slideImg=val;
      },
      onResultChangeAdd(val){
        this.addForm.slideImg=val;
      }
    },
    components: {
//      SlideUpload,
      upload
    }

  }
</script>

<style>
	.slide-page .slide-img{
		width:200px;
		vertical-align: bottom;
		margin:10px 10px 10px 0;
	}
	.slide-page .single-uploader .avatar{
  
		width:auto;
	}
</style>