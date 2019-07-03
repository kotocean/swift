<template>
  <q-page class="row justify-center">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <!-- style="width: 500px; max-width: 120vw;" -->
    <div class="q-mt-md q-px-sm full-width">
      <q-list link separator>
        <q-collapsible
          v-for="(typeCourses, type, index) in typeCourseList[0]"
          v-bind:key="index"
          :label="type"
          highlight
          opened
        >
          <q-list highlight separator link no-border>
            <q-item multiline tag="label" v-for="(courseAndIndex, i) in typeCourses" v-bind:key="i">
              <!-- <q-item-side image="statics/boy-avatar.png"/> -->
              <q-item-side>
                <q-checkbox v-model="checkedCourseList[courseAndIndex[0]]" />
              </q-item-side>
              <q-item-main>
                <q-item-tile label lines="2" style="font-size:14pt;">{{ courseAndIndex[1].name }}</q-item-tile>
                <q-item-tile sublabel>
                  <span style="font-size:12pt;">{{ courseAndIndex[1].price }}</span>元
                </q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-collapsible>
      </q-list>
    </div>

    <q-page-sticky position="bottom-left" :offset="[16, 16]">
      <q-btn color="primary" @click="showChecked()" label="查看已选择菜品">
        <q-icon name="assignment" />
      </q-btn>
      <q-btn v-if="isAddCoursesOp" color="tertiary" @click="cancelAddCourses()" label="取消加菜" />
    </q-page-sticky>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      courseList: [],
      checkedCourseList: [],
      cart: {
        cartItemList: [],
        totalPrice: 0,
        state: false
      },
      typeCourseList: []
    };
  },
  computed: {
    restaurantId() {
      return this.$store.state.restaurant.id;
    },
    isAddCoursesOp() {
      return sessionStorage.getItem("add-courses-to-order") !== null;
    }
  },
  mounted() {
    console.log("restaurantId: " + this.restaurantId);
    if (this.$auth.user() !== "undefined") {
      this.axios
        .get(`/course?restaurantId=${this.restaurantId}&onSale=true`)
        .then(response => {
          console.log(response);
          this.courseList = response.data.content;
          var tempTypeCourses={}
          //初始化选项列表的默认值
          for (var i = 0; i < this.courseList.length; i++) {
            this.checkedCourseList[i] = false;
            var course = this.courseList[i];
            if (typeof(tempTypeCourses[course.type]) !== 'undefined') {
              tempTypeCourses[course.type].push([i, course]);
            } else {
              tempTypeCourses[course.type] = [[i, course]];
            }
          }
          this.typeCourseList.push(tempTypeCourses)
          console.log(this.typeCourseList);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  methods: {
    //每次查看购物车，都是保存或更新cart
    showChecked() {
      console.log(this.checkedCourseList);
      this.cart.lastDate = new Date().toISOString();
      this.cart.cartItemList = [];
      this.cart.restaurantId = this.restaurantId;

      for (var i = 0; i < this.checkedCourseList.length; i++) {
        if (this.checkedCourseList[i]) {
          var cartItem = {};
          cartItem.count = 1; //?
          cartItem.course = this.courseList[i];

          this.cart.cartItemList.push(cartItem);
          this.cart.totalPrice += cartItem.course.price * cartItem.count;
        }
      }
      console.log(this.cart);
      if (this.cart.cartItemList.length === 0) {
        console.log("未选择任何菜品，请先选择！");
        return this.$router.push("/cart");
      }

      this.axios
        .post("/cart", this.cart)
        .then(response => {
          console.log(response);
          this.cart = response.data;
          this.$router.push("/cart");
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancelAddCourses() {
      // 清理加菜，恢复正常点菜
      sessionStorage.clear("add-courses-to-order");
      this.$q.notify("已取消加菜，恢复正常点菜");
    }
  }
};
</script>
