<template>
    <div id="ordersInfo">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>订单编号：{{order_id}}</span>
                <el-button style="float: right;" type="success" @click="backto">返回</el-button>
            </div>
            <div v-for="(item,index) in list" :key="index" class="text item">
                <br>
                <div class="text item">商品名称：<span>{{item.goods_name}}</span></div>
                <div class="text item">商品单价：<span>{{item.goods_price/100}}</span></div>
                <div class="text item">销售价格：<span>{{item.buy_price/100}}</span></div>
                <div class="text item">购买数量：<span>{{item.quantity}}</span></div>
            </div>
           
        </el-card>

    </div>
</template>

<script>
export default {
    data(){
        return{
           list:[],
           id:0,
           order_id:''
        }
    },
    methods: {
        getOrdersInfo(){
				let url = 'http://49.4.4.4:9090/order/getOrderItemByOrderId'+'?order_id='+this.id
				this.$http.post(url).then(function(res){
                    this.list = res.body.data
                    this.order_id = res.body.data[0].order_id
				})
			},
        onSubmit() {
            this.$router.go(-1);
        },
        backto(){
            	this.$router.go(-1);
        	}
    },
    mounted(){
        this.id = this.$route.params.id;
        this.getOrdersInfo()
        
    }
}
</script>

<style>
    #ordersInfo .box-card{
         margin-top: 30px;
    }
    #ordersInfo .text {
        font-size: 14px;
    }

    #ordersInfo .item {
        margin-bottom: 18px;
    }

    #ordersInfo .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    #ordersInfo .clearfix:after {
        clear: both
    }
    .text span{
        color: #666;
    }


</style>



