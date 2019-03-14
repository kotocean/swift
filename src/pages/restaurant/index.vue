<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
        <q-input  v-model="restaurant.name" label="餐厅名字" placeholder="请输入，如河南烩面馆"/>
        <q-input  v-model="restaurant.address" label="地址" placeholder="请输入，如西直门地铁站向西200米"/>
        <q-btn color="secondary" label="提交" @click="postRestaurant"/>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      restaurant:{
          name: null,
          address: null,
          isAudit: false,
          userId: 1
      }
    }
  },
  methods: {
      postRestaurant() {
          console.log(this.restaurant)
          this.restaurant.createdDate = new Date()
          this.axios.post("/restaurant", this.restaurant)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
      }
  }
}
</script>