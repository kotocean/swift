<template>
  <q-page>
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <div
      class="q-mt-md q-px-sm full-width"
      v-for="(cart, index) in cartList"
      v-bind:key="index"
    >
      <q-list highlight inset-separator link v-if="cart.cartItemList.length!=0">
        <q-list-header>{{ convertDate(cart.lastDate) }}</q-list-header>
        <q-item multiline tag="label" v-for="(cartItem, itemIndex) in cart.cartItemList" v-bind:key="itemIndex">
          <!-- <q-item-side image="statics/boy-avatar.png" /> -->
          <q-item-side>
            <q-item-tile>
              <q-checkbox v-model="cartItem.checked"/>
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile label lines="1">{{ cartItem.course.name }}</q-item-tile>
            <q-item-tile sublabel lines="2">
              <table>
                <tr>
                  <td>{{ cartItem.course.price }}元</td>
                  <td>
                    <q-btn-group style="float:right;">
                      <q-btn label="-" @click="subCount(cartItem)"/>
                      <q-input
                        v-model="cartItem.count"
                        size="mini"
                        type="number"
                        style="width:16px; text-align:center;"
                      />
                      <q-btn label="+" @click="addCount(cartItem)"/>
                    </q-btn-group>
                  </td>
                </tr>
              </table>
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>{{ cartItem.course.type }}</q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
    <div>
      <q-page-sticky position="bottom-right" :offset="[16, 16]">
        <q-btn color="light-blue">
          <q-icon name="add_shopping_cart"/>
          <q-popover>
            <div class="group" style="text-align: center;">
              <q-btn color="primary" v-close-overlay :label="isAddCoursesOp?'提交加菜订单':'提交订单'" @click="showModal()">
                <q-icon name="assignment"/>
              </q-btn>
              <q-btn v-if="isAddCoursesOp" color="tertiary" @click="cancelAddCourses()" label="取消加菜"/>
              <q-btn v-else v-close-overlay color="secondary" label="Tip" @click="showTip()">
                  <q-icon name="help" />
              </q-btn>
            </div>
          </q-popover>
        </q-btn>
      </q-page-sticky>
    </div>
    <q-modal v-model="maximizedModal" maximized>
      <div class="q-mt-xl q-mx-md">
        <p>订单详情，即将下单 ... ...</p>
        <div v-if="!isAddCoursesOp">
          <q-input v-model="order.numberOfDiners" stack-label="就餐人数"/>
          <q-select v-model="order.seatName" stack-label="桌位" radio :options="seatOptions"/>
        </div>
        <q-list>
          <q-item v-for="(orderItem, index) in order.orderItemList" v-bind:key="index">
            <q-item-side>{{ index+1 }}.</q-item-side>
            <q-item-main :label="orderItem.name"/>
            <q-item-side right>
              <table>
                <tr>
                  <td>{{ orderItem.price }}元</td>
                  <td>
                    <q-btn-group flat>
                      <q-btn label="-" @click="subCount(orderItem)"/>
                      <q-input
                        v-model="orderItem.count"
                        size="mini"
                        type="number"
                        style="width:8px; text-align:center;"
                      />
                      <q-btn label="+" @click="addCount(orderItem)"/>
                    </q-btn-group>
                  </td>
                </tr>
              </table>
            </q-item-side>
          </q-item>
          <q-item>
            <q-item-side>总共</q-item-side>
            <q-item-main>
              <span style="color: green; font-size: 21pt;">{{ order.totalPrice }}</span> 元
            </q-item-main>
          </q-item>
        </q-list>
        <table style="width:100%">
          <tr><td>
          <q-btn color="tertiary" @click="cancelOrder()" label="取消"/></td><td>
          <q-btn v-if="isAddCoursesOp" class="full-width" color="primary" @click="submitAddCoursesOrder()" label="确认加菜"/>
          <q-btn v-else class="full-width" color="primary" @click="submitOrder()" label="下单"/>
          </td></tr>
        </table>
      </div>
    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
import moment from "moment-timezone";

export default {
  name: "PageIndex",
  data() {
    return {
      cartList: [],
      maximizedModal: false,
      order: {
        orderItemList: [],
        checkout: false,
        totalPrice: 0
      },
      seatOptions: [],
      modifiedCartIdx: []
    };
  },
  computed: {
    restaurantId() {
      return this.$store.state.restaurant.id;
    },
    isAddCoursesOp(){
      return sessionStorage.getItem('add-courses-to-order')!==null;
    }
  },
  mounted() {
    console.log("restaurantId: " + this.restaurantId);
    this.axios
      .get("/cart?state=false&restaurantId=" + this.restaurantId)
      .then(response => {
        console.log(response);
        this.cartList = response.data.content;
      })
      .catch(error => {
        console.log(error);
      });
    this.axios
      .get("/seat?state=true&restaurantId=" + this.restaurantId)
      .then(response => {
        console.log(response);
        var seatList = response.data.content;
        for (var i in seatList) {
          var seat = seatList[i];
          this.seatOptions.push({
            label: seat.name + "(最多可容纳" + seat.capacity + "人)",
            value: seat.name
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    subCount(cartItem) {
      var temp = cartItem.count - 1;
      if (temp <= 0) {
        cartItem.count = 1;
      } else {
        cartItem.count = temp;
        this.resetTotalPrice(this.order); // 重新计算订单的总额
      }
    },
    addCount(cartItem) {
      cartItem.count = cartItem.count + 1;
      this.resetTotalPrice(this.order);
    },
    submitOrder() {
      this.order.createdDate = new Date().toISOString();
      // this.order.userId = 1
      this.order.restaurantId = this.restaurantId;

      this.axios
        .post("/order", this.order)
        .then(response => {
          console.log(response);
          this.processCoursesCart()
          // 处理cart完成
        })
        .catch(error => {
          console.log(error);
        });
    },
    processCoursesCart(){
      for (var index in this.modifiedCartIdx) {
            var target = this.modifiedCartIdx[index];
            // 改变cart的状态
            console.log(index);

            var cart = this.cartList[target.cartIndex];
            cart.cartItemList[target.itemIndex].state = true; //标记为已提交为orderItem
            if(target.itemIndex+1 === cart.cartItemList.length){ cart.state = true}
            this.axios
              .post("/cart", cart)
              .then(response => {
                // console.log(response)
                this.cartList[target.cartIndex].cartItemList.pop(
                  target.itemIndex
                );
                this.$router.replace("/order");
              })
              .catch(error => {
                console.log(error);
              });
          }
    },
    submitAddCoursesOrder(){
      var addCoursesToOrder = JSON.parse(sessionStorage.getItem('add-courses-to-order'))

      for(var i in this.order.orderItemList){
        addCoursesToOrder.orderItemList.push(this.order.orderItemList[i])
      }
      addCoursesToOrder.totalPrice += this.order.totalPrice
      console.log(addCoursesToOrder)

      this.axios
        .post("/order", addCoursesToOrder)
        .then(response => {
          console.log(response);
          this.processCoursesCart()
          // 处理cart完成
          this.cancelAddCourses()
        })
        .catch(error => {
          console.log(error);
        });

    },
    cancelOrder() {
      this.maximizedModal = false;
      this.resetOrder();
    },
    cancelAddCourses(){
      // 清理加菜，恢复正常点菜
      sessionStorage.clear('add-courses-to-order')
      this.$router.replace('/order')
    },
    resetOrder() {
      // 订单状态回到初始值
      this.order.orderItemList = [];
      this.order.totalPrice = 0;
    },
    showModal() {
      //显示Model
      this.maximizedModal = true;
      for (var cartIndex in this.cartList) {
        var cart = this.cartList[cartIndex];
        console.log(cart);
        for (var index in cart.cartItemList) {
          var cartItem = cart.cartItemList[index];
          if (
            typeof cartItem.checked === "undefined" ||
            cartItem.checked === true
          ) {
            var orderItem = {};
            // 默认不打折，可在实际结账时打折扣
            orderItem.discount = 1
            orderItem.count = cartItem.count;
            orderItem.name = cartItem.course.name;
            orderItem.price = cartItem.course.price;
            orderItem.type = cartItem.course.type;
            this.order.orderItemList.push(orderItem);
            this.order.totalPrice += orderItem.price * orderItem.count;

            this.modifiedCartIdx.push({
              cartIndex: cartIndex,
              itemIndex: index
            });
          }
        }
      }
      console.log(this.order);
    },
    resetTotalPrice(order) {
      order.totalPrice = 0;
      for (var itemIndex in order.orderItemList) {
        var item = order.orderItemList[itemIndex];
        order.totalPrice += item.price * item.count * item.discount;
      }
    },
    convertDate(date) {
      moment.locale();
      return moment(date).format("YYYY-MM-DD hh:mm:ss");
    },
    showTip(){
      this.$q.notify({color: 'positive', message: '点击提交后，可查看待下单列表！', icon: 'tag_faces'})
    }
  }
};
</script>
