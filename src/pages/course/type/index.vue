<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
        <q-input  v-model="courseType.name" stack-label="菜品类型" placeholder="请输入，如热菜、凉菜"/>
        <q-btn color="secondary" label="提交" @click="postCourseType"/>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      courseType:{
          name: null,
          // restaurantId: 1
      }
    }
  },
  computed: {
    restaurantId(){
      return this.$store.state.restaurant.id
    }
  },
  methods: {
      postCourseType() {
          this.courseType.restaurantId = this.restaurantId
          console.log(this.courseType)
          this.axios.post("/courseType", this.courseType)
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