<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
      <q-input  v-model="course.name" stack-label="菜品名字" placeholder="请输入菜品名字"/>
      <q-input  v-model="course.abbr" stack-label="拼音首字母" placeholder="请输入拼音首字母"/>
      <q-input  v-model="course.price" stack-label="价格" placeholder="请输入价格"/>
      <div class="q-pa-md">
        <div class="q-gutter-sm">
        <q-radio v-model="course.type" v-for="(courseType, index) in courseTypes" v-bind:key="index" :val="courseType" :label="courseType" />
        </div>
      </div>
      <div class="q-pa-md">
    <q-btn-toggle
      v-model="course.onSale"
      toggle-color="primary"
      :options="[
        {label: '在售', value: true},
        {label: '下架', value: false}
      ]"
    />
  </div>
        <q-btn color="secondary" label="提交" @click="postCourse"/>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      course:{
          name: null,
          abbr: null,
          price: null,
          type: null,
          onSale: true,
          // restaurantId: 1
      },
      courseTypes: ['其他']
    }
  },
  computed: {
    restaurantId(){
      return this.$store.state.restaurant.id
    }
  },
  mounted() {
    console.log(this.restaurantId)
    this.axios.get("/courseType")
      .then(response => {
        console.log(response)
        var courseTypeList = response.data.content
        for(var index in courseTypeList){
          var courseType = courseTypeList[index]
          this.courseTypes.push(courseType.name)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
      postCourse() {
          this.course.restaurantId = this.restaurantId
          console.log(this.course)
          this.axios.post("/course", this.course)
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