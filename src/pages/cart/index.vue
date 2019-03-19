<template>
  <q-page class="flex flex-top">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <div class="q-mt-md q-mx-xs" v-for="(cart, index) in cartList" v-bind:key="index">
      <q-list highlight inset-separator>
        <q-item multiline v-for="(cartItem, itemIndex) in cart.cartItemList" v-bind:key="itemIndex">
          <q-item-side>
            <img src="statics/boy-avatar.png" width="90px"/>
          </q-item-side>
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
     
      <div>
        <q-btn color="primary" label="提交订单" @click="showModal(index)">
          <q-icon name="assignment" />
        </q-btn>
      </div>

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
export default {
  name: 'PageIndex',
  data(){
    return {
      cartList: {},
      maximizedModal: false,
      order:{
        orderItemList: [],
        checkout: false,
        totalPrice: 0,
      },
      seatOptions: [],
      currentCartId: null,
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
          // 改变cart的状态
          var cart = this.cartList[this.currentCartId]
          cart.state = true //该购物车已下单
          this.axios.post('/cart', cart).then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
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
    showModal(cartId){
      //显示Model
      this.maximizedModal = true
      console.log(cartId)
      this.currentCartId = cartId
      var cart = this.cartList[cartId]
      // console.log(cart)
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
        }
      }
        console.log(this.order)
    }
  },
}
</script>
