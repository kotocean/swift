<template>
  <q-tabs class="row justify">
    <q-tab default slot="title" name="tab-1" icon="message" label="未结账"/>
    <q-tab slot="title" name="tab-2" icon="fingerprint" label="已结账" @click="showCompleteOrder()"/>

    <!-- Targets -->
    <q-tab-pane name="tab-1">
      <q-list highlight link inset-separator v-for="(order, index) in incompleteOrderList" v-bind:key="index">
        <q-item>
          <q-item-side>{{ index+1 }}.</q-item-side>
          <q-item-main
            :label="order.seatName"
            label-lines="1"
            :sublabel="order.numberOfDiners + '人'"
            sublabel-lines="1"
          />
          <q-item-side right>
            <q-item-tile stamp>{{ getTimeFrom(order.createdDate) }}</q-item-tile>
            <q-item-tile>
                 <span style="color: green; font-size: 21pt;">{{ order.totalPrice }}</span>元
            </q-item-tile>
            <q-item-tile>
              <q-btn label="加菜" color="secondary" @click="addCourses(index)"></q-btn>
              <q-btn label="结账" color="primary" @click="submitOrder(index)"></q-btn>
            </q-item-tile>
          </q-item-side>
        </q-item>
        <q-collapsible group="somegroup" icon="assignment" label="订单详情" sublabel="可以给予打折或赠送">
            <table width="100%">
                <tr v-for="(orderItem, itemIndex) in order.orderItemList" v-bind:key="itemIndex">
                  <td>{{itemIndex+1}}</td>
                  <td>{{orderItem.name}}</td>
                  <td>
                    <!-- <q-input style="width:20px;" v-model="orderItem.count" /> -->
                    <q-btn-group>
                      <q-btn label="-" @click="subCount(orderItem, order)"/>
                      <q-input
                        v-model="orderItem.discount"
                        size="mini"
                        type="number"
                        style="width:45px; text-align:center;"
                        @input="resetTotalPrice(order)"
                      />
                      <q-btn label="+" @click="addCount(orderItem, order)"/>
                    </q-btn-group>
                  </td>
                  <td>{{orderItem.count}}</td>
                  <td>
                    <q-input style="width:30px;" v-model="orderItem.price" @input="resetTotalPrice(order)"/>
                  </td>    
                </tr>
            </table>       
        </q-collapsible>
      </q-list>
    </q-tab-pane>
    <q-tab-pane name="tab-2">
      <q-list highlight inset-separator>
        <q-item multiline link v-for="(order, index) in completeOrderList" v-bind:key="index">
          <q-item-side>{{ index+1 }}.</q-item-side>
          <q-item-main
            :label="order.seatName"
            label-lines="1"
            :sublabel="order.numberOfDiners + '人'"
            sublabel-lines="1"
          />
          <q-item-side right>
            <q-item-tile stamp>{{ getTimeFrom(order.createdDate) }}</q-item-tile>
            <q-item-tile>
              <span style="color: green; font-size: 21pt;">{{ order.totalPrice }}</span>元
            </q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
      <q-btn class="full-width q-mt-md" color="secondary" @click="showMoreCompletedOrders" >查看更多历史订单</q-btn>
    </q-tab-pane>
  </q-tabs>
</template>

<script>
export default {
  data() {
    return {
      incompleteOrderList: [],
      completeOrderList: []
    };
  },
  computed: {
    restaurantId() {
      return this.$store.state.restaurant.id;
    }
  },
  mounted(){
    console.log('restaurantId: ' + this.restaurantId)
    this.axios
      .get("/order?restaurantId=" + this.restaurantId, {
        params: {
          checkout: false
        }
      })
      .then(res => {
        console.log(res);
        this.incompleteOrderList = res.data.content;
      })
      .catch(err => {
        console.log(res);
      });
  },
  methods: {
    subCount(orderItem, order) {
      var temp = (parseFloat(orderItem.discount) - 0.05).toFixed(2);
      
      if (temp < 0) {
        orderItem.discount = 0;
      } else {
        orderItem.discount = temp;
        this.resetTotalPrice(order); // 重新计算订单的总额
      }
    },
    addCount(orderItem, order) {
      var temp = (parseFloat(orderItem.discount)+0.05).toFixed(2)
      if(temp>1){
        orderItem.discount = 1
      }else{
        orderItem.discount = temp
      }
      
      this.resetTotalPrice(order);
    },
    resetTotalPrice(order) {
      order.totalPrice = 0;
      for (var itemIndex in order.orderItemList) {
        var item = order.orderItemList[itemIndex];
        // console.log(item)
        order.totalPrice += parseFloat((parseFloat(item.price) * item.count * parseFloat(item.discount)).toFixed(2));
      }
      order.totalPrice = order.totalPrice.toFixed(2);
    },
    getTimeFrom(createdDate) {
      var secondsAgo =
        (new Date().getTime() - new Date(createdDate).getTime()) / 1000;
      var dayDiff = Math.floor(secondsAgo / (24 * 3600));
      if (dayDiff > 0) {
        return "一天之前";
      }

      var leave1 = secondsAgo % (24 * 3600);
      var hoursDiff = Math.floor(leave1 / 3600);

      var leave2 = leave1 % 3600;
      var minutesDiff = Math.floor(leave2 / 60);

      var secondsDiff = Math.floor(leave2 % 60);
      return hoursDiff + "小时" + minutesDiff + "分钟" + secondsDiff + "秒之前";
    },
    submitOrder(index) {
      // 结账提交最后的订单
      // 涉及到打折或赠送
      console.log(index);
      var order = this.incompleteOrderList[index];
      order.checkout = true;
      this.axios
        .post("/order", order)
        .then(res => {
          console.log(res);
          this.incompleteOrderList.pop(index);
        })
        .catch(err => {
          console.log(err);
        });
    },
    addCourses(index){
      // 向已有订单加菜
      var order = this.incompleteOrderList[index];
      sessionStorage.setItem('add-courses-to-order', JSON.stringify(order))
      this.$router.push('/')
    },
    showCompleteOrder() {
      this.axios
        .get("/order?restaurantId=" + this.restaurantId, {
          params: {
            checkout: true,
            page: 0,
            size: 50
          }
        })
        .then(res => {
          console.log(res);
          this.completeOrderList = res.data.content;
        })
        .catch(err => {
          console.log(res);
        });
    },
    showMoreCompletedOrders(){
        this.$q.notify({
            color: "positive",
            message: '开发中，敬请期待~',
            icon: "face"
          })
    }
  }
};
</script>

