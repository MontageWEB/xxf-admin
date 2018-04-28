<template>
	<el-upload
			class="avatar-uploader single-uploader"
			:action="base"
			list-type="picture-card"
			:show-file-list="false"
			:data="params"
      :on-error="error"
      :on-change="changeUpload"
			:before-upload="handleUpload">
			<img v-if="imageUrl" :src="imageUrl" class="avatar">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
	</template>
<script>
  import common from '../api/common.js';

  export default {
    props: [
      'imageUrl','bizName'
    ],
    data() {
      return {
        newUrl: this.imageUrl,
        base: '',
        uploaded: false,
        filename: '',
        suffix: '',
        params: { // upload参数
          key: '',
          OSSAccessKeyId: '',
          policy: '',
          signature: '',
          expire: '',
          success_action_status: '200',
        },
        idBiz: ""
      }
    },
    mounted() {
      this.get_sign();
      this.getId();
    },
    methods: {
      //取得图片上传签名
      get_sign() {
        this.$http.post(common.apidomain + "/resource/getWebOss").then(function (res) {
          this.base = res.body.data.host
          this.upload_dir = res.body.data.dir
          //this.filename=res.body.data.filename
          this.params.OSSAccessKeyId = res.body.data.accessId
          this.params.policy = res.body.data.policy
          this.params.signature = res.body.data.signature
          this.params.expire = res.body.data.expire
        })
      },
      getId() {
        this.$http.post(common.apidomain + "/resource/getId", {"idBiz": "idBiz"}).then(function (res) {
          this.idBiz = res.body.data
        })
      },
      handleUpload(file) {
        
        let filename = file.name  //文件名
        let nameSplit = filename.split('.') //拆分文件名
        let suffix = nameSplit[1] //文件后缀名
        this.params.key = `${this.bizName}.${this.idBiz}.${suffix}`
        this.newUrl = `${this.base}/${this.bizName}.${this.idBiz}.${suffix}` //图片存储地址url
        //this.uploaded = true
      },
      changeUpload(){
        this.get_sign();
        //this.getId();
      },
      error(){
         this.$message('上传图片失败，请重新上传');
      }
    },
    watch: {
      imageUrl(val) {
        this.newUrl = val
      },
      newUrl(val) {
        setTimeout(() => this.$emit("on-result-change", val),2000);
        this.getId();
      },
      idBiz(val) {
      }
    }
  }
</script>

<style>
	.single-uploader .avatar{
		height:146px;
		width:146px;
	}
</style>