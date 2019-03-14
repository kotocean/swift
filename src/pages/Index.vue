<template>
  <q-page class="flex flex-center">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <q-list highlight inset-separator>
      <q-item multiline v-for="(course, index) in courseList" v-bind:key="index">
        <q-item-side>
          <img src="statics/boy-avatar.png" width="90px"/>
        </q-item-side>
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
    <q-card>
      <q-btn label="查看已选择菜品" @click="showChecked()" />
    </q-card>    
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
      checkedCourseList: []
    }
  },
  created(){
    this.axios.get("/course")
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
    showChecked(){
      console.log(this.checkedCourseList)
    }
  },
}
</script>
