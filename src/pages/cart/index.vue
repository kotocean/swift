<template>
  <q-page class="row justify-center">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <div class="q-mt-md q-mx-xs" style="width: 500px; max-width: 120vw;" v-for="(cart, index) in cartList" v-bind:key="index">
      <q-list highlight inset-separator v-if="cart.cartItemList.length!=0">
        <q-list-header>{{ convertDate(cart.lastDate) }}</q-list-header>
        <q-item multiline v-for="(cartItem, itemIndex) in cart.cartItemList" v-bind:key="itemIndex">
          <q-item-side image="statics/boy-avatar.png" />
          <q-item-main>
            <q-item-tile label lines="1">{{ cartItem.course.name }}</q-item-tile>
            <q-item-tile sublabel lines="2">
              {{ cartItem.course.price }}<span>元</span>
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>{{ cartItem.course.type }}</q-item-tile>
            <q-item-tile>
              <q-checkbox v-model="cartItem.checked" />
            </q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
    <div>
      
      <q-page-sticky position="bottom-right" :offset="[16, 16]">
          <q-btn color="light-blue">
            <q-icon name="add_shopping_cart" />
            <q-popover>
              <div class="group" style="width: 220px; text-align: center;">
                <q-btn color="primary" v-close-overlay label="提交订单" @click="showModal()">
                  <q-icon name="assignment" />
                </q-btn>
                <q-btn v-close-overlay label="删除" @click="clear()">
                  <q-icon name="clear" />
                </q-btn>
              </div>
            </q-popover>
          </q-btn>
        </q-page-sticky>
    </div>   
    <q-modal v-model="maximizedModal" maximized>
        
        <div style="padding: 50px">
          <p>订单详情，即将下单 ... ...</p>
          <q-input v-model="order.numberOfDiners" stack-label="就餐人数"/>
             <q-select
              v-model="order.seatName"
              stack-label="桌位"
              radio
            :options="seatOptions"
            />
          <q-list>
            <q-item v-for="(orderItem, index) in order.orderItemList" v-bind:key="index">
              <q-item-side>{{ index+1 }}.{{orderItem.type }} </q-item-side>
              <q-item-main :label="orderItem.name" />
              <q-item-side right>{{ orderItem.price }}</q-item-side>
            </q-item>
          </q-list>
          <q-btn color="tertiary" @click="cancelOrder()" label="取消" />
          <q-btn color="primary" @click="submitOrder()" label="下单" />
        </div>
    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
import moment from 'moment-timezone'

export default {
  name: 'PageIndex',
  data(){
    return {
      cartList: [],
      maximizedModal: false,
      order:{
        orderItemList: [],
        checkout: false,
        totalPrice: 0,
      },
      seatOptions: [],
      modifiedCartIdx: [],
    }
  },
  created(){
    this.axios.get('/cart')
            .then(response => {
                console.log(response)
                this.cartList = response.data.content
            })
            .catch(error => {
                console.log(error)
            })
    this.axios.get('/seat')
      .then(response => {
                console.log(response)
                var seatList = response.data.content
                for(var i in seatList){
                  var seat = seatList[i]
                  this.seatOptions.push({label: seat.name, value: seat.name})
                }
            })
            .catch(error => {
                console.log(error)
            })
  },
  methods: {
    submitOrder(){
      this.order.createdDate = (new Date()).toISOString()
      this.order.userId = 1
      this.order.restaurantId = 1

      this.axios.post('/order', this.order)
        .then(response => {
          console.log(response)
          for(var index in this.modifiedCartIdx){
            var target = this.modifiedCartIdx[index]
            // 改变cart的状态
            console.log(index)
            
            var cart = this.cartList[target.cartIndex]
            cart.cartItemList[target.itemIndex].state=true //标记为已提交为orderItem
            this.axios.post('/cart', cart).then(response => {
              console.log(response)
              this.cartList[target.cartIndex].cartItemList.pop(target.itemIndex)
            })
            .catch(error => {
              console.log(error)
            })
          }
          // 处理cart完成
        })
        .catch(error => {
          console.log(error)
        })
    },
    cancelOrder(){
      this.maximizedModal = false
      this.resetOrder()
    },
    resetOrder(){
      // 订单状态回到初始值
      this.order.orderItemList = []
      this.order.totalPrice = 0
    },
    showModal(){
      //显示Model
      this.maximizedModal = true
      for(var cartIndex in this.cartList){
        var cart = this.cartList[cartIndex]
        console.log(cart)
        for( var index in cart.cartItemList){
          var cartItem = cart.cartItemList[index]
          if(typeof(cartItem.checked)==='undefined' || cartItem.checked===true){
            var orderItem = {}
            // console.log(cartItem)
            orderItem.count = cartItem.count
            orderItem.name = cartItem.course.name
            orderItem.price = cartItem.course.price
            orderItem.type = cartItem.course.type
            this.order.orderItemList.push(orderItem)
            this.order.totalPrice += orderItem.price

            this.modifiedCartIdx.push({'cartIndex': cartIndex, 'itemIndex': index})
          }
        }
      }
        console.log(this.order)
    },
    convertDate(date){
      moment.locale();
      return moment(date).format('YYYY-MM-DD hh:mm:ss');
    }
  },
}
</script>
