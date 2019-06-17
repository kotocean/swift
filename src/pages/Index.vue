<template>
  <q-page class="row justify-center">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <div style="width: 500px; max-width: 120vw;" class="q-mt-md q-mx-xs">
      <q-list highlight inset-separator>
        <q-item multiline v-for="(course, index) in courseList" v-bind:key="index">
          <q-item-side image="statics/boy-avatar.png" />
          <q-item-main>
            <q-item-tile label lines="1">{{ course.name }}</q-item-tile>
            <q-item-tile sublabel lines="2">
              {{ course.price }}<span>元</span>
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>{{ course.type }}</q-item-tile>
            <q-item-tile>
              <q-checkbox v-model="checkedCourseList[index]" />
            </q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
    
    <q-page-sticky position="bottom-left" :offset="[16, 16]">
        <q-btn color="primary" @click="showChecked()" label="查看已选择菜品">
          <q-icon name="assignment" />
        </q-btn>
    </q-page-sticky>  
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data(){
    return {
      courseList: [],
      checkedCourseList: [],
      cart: {
        cartItemList: [],
        totalPrice: 0,
        state: false
      }
    }
  },
  computed: {
    restaurantId(){
      return this.$store.state.restaurant.id
    }
  },
  created(){
    this.axios.get('/course?restaurantId='+this.restaurantId)
            .then(response => {
                console.log(response)
                this.courseList = response.data.content
                //初始化选项列表的默认值
                for(var i=0; i<this.courseList.length; i++){
                  this.checkedCourseList[i] = false
                }
            })
            .catch(error => {
                console.log(error)
            })
  },
  methods: {
    //每次查看购物车，都是保存或更新cart
    showChecked(){
      console.log(this.checkedCourseList)
      this.cart.lastDate = (new Date()).toISOString()
      this.cart.cartItemList = []
      this.cart.restaurantId = this.restaurantId

      for(var i=0; i<this.checkedCourseList.length; i++){
        if(this.checkedCourseList[i]){
          var cartItem = {}
          cartItem.count = 1
          cartItem.course = this.courseList[i]
          
          this.cart.cartItemList.push(cartItem)
          this.cart.totalPrice += cartItem.course.price * cartItem.count
        }
      }
      console.log(this.cart)
      if(this.cart.cartItemList.length===0){
        return alert('未选择任何菜品，请先选择！')
      }

      this.axios.post('/cart', this.cart)
        .then(response => {
          console.log(response)
          this.cart = response.data
          this.$router.push('/cart')
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
}
</script>
