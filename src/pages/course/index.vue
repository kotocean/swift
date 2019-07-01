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
        <table class="q-mb-sm">
          <tr>
            <td><q-btn class="full-width" color="secondary" :label="isEdit?'完成编辑':'提交'" @click="postCourse"/></td>
            <td><q-btn class="full-width" color="primary" label="清空" @click="clearCourse"/></td>
          </tr>
        </table>
    </div>
    <q-table
      :data="courses"
      :columns="columns"
      selection="single"
      :selected.sync="selectedCourse"
      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
      row-key="id"
      color="secondary"
      title="请先选择要删除和编辑的数据行"
      rows-per-page-label="每页显示行数："
    >
      <template slot="top-selection" slot-scope="props">
        <q-btn color="secondary" flat label="重新编辑" class="q-mr-sm" @click="resetCourse"/>
        <q-btn color="brown" flat label="取消编辑" @click="cancelEdit" />
        <div class="col" />
        <q-btn color="negative" flat round icon="delete" @click="deleteCourse" />
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>
    </q-table>
  </div>
  
</template>

<script>

export default {
  data () {
    return {
      loading: false,
      isEdit: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10, // specifying this determines pagination is server-side
        rowsPerPage: 3
      },
      course:{
          name: null,
          abbr: null,
          price: null,
          type: '其他',
          onSale: true,
      },
      courseTypes: ['其他'],
      courses: [],
      columns: [
        {name:'id',field:'id', style:'display:none;'},
        {name:'name', label: '菜品名', field: 'name', align: 'left'},
        {name:'abbr', label: '拼音首字母',field: 'abbr', align: 'left'},
        {name:'price', label: '价格', field: 'price', align: 'left', sortable: true},
        {name:'type', label: '类型',field: 'type', align: 'left'},
        {name:'onSale', label: '是否在售',field: 'onSale', align: 'left'}
      ], 
      selectedCourse: []
    }
  },
  computed: {
    restaurantId(){
      return this.$store.state.restaurant.id
    }
  },
  mounted(){
    console.log('restaurantId: ' + this.restaurantId)
    this.axios.get("/courseType?restaurantId="+this.restaurantId)
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
    this.request({
      pagination: this.serverPagination
    })
  },
  methods: {
      postCourse() {
          this.course.restaurantId = this.restaurantId
          console.log(this.course)
          this.axios.post("/course", this.course)
            .then(response => {
              // 添加而非编辑时，需要加入到table中
              if(!this.isEdit){
                this.courses.push(response.data)
                this.$q.notify({color: 'positive', message: '添加成功！', icon: 'tag_faces'})
              }else{
                this.$q.notify({color: 'positive', message: '修改成功！', icon: 'tag_faces'})
              }              
              console.log(response)
            })
            .catch(error => {
              console.log(error)
              this.$q.notify({color: 'negative', message: '喔,出问题了~', icon: 'face'})
            })
      },
      clearCourse(){
        this.course = {
            name: null,
            abbr: null,
            price: null,
            type: null,
            onSale: true,
        }
      },
      deleteCourse(){
        console.log("delete course ...")
        var course = this.selectedSeat[0]
        this.axios.delete('/course', {
          data: course
        })
          .then(response => {
            console.log(response)
            this.courses.pop(course)
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetCourse(){
        console.log("reset course ... ")
        this.course = this.selectedCourse[0]
        this.isEdit = true
        console.log(this.course)
      },
      cancelEdit(){
        this.isEdit=false
        this.course = {onSale:true}
      },
      request({pagination}){
        this.loading = true
        this.axios.get(`/course/manage?page=${pagination.page-1}&size=${pagination.rowsPerPage}&restaurantId=${this.restaurantId}`)
          .then(res => {
            this.serverPagination = pagination
            this.serverPagination.rowsNumber = res.data.totalElements
            this.courses = res.data.content
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      }
  }
}
</script>