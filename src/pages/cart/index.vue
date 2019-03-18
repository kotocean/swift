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
        <q-btn color="primary" @click="commitCart(index)" label="提交订单">
          <q-icon name="assignment" />
        </q-btn>
      </div>
    </div>    
    
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data(){
    return {
      cartList: {}
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
  },
  methods: {
    commitCart(cartId){
        console.log(this.cartList[cartId])
    }
  },
}
</script>
