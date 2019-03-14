<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
        <q-input  v-model="seat.name" label="席位名称" placeholder="请输入，如2号桌"/>
        <q-input  v-model="seat.capacity" label="容量" placeholder="最多可坐几人，如3"/>
        <q-btn color="secondary" label="提交" @click="postSeat"/>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      seat:{
          name: null,
          capacity: null,
          restaurantId: 1
      }
    }
  },
  methods: {
      postSeat() {
          console.log(this.seat)
          this.axios.post("/seat", this.seat)
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