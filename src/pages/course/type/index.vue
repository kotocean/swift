<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
        <q-input  v-model="courseType.name" stack-label="菜品类型" placeholder="请输入，如热菜、凉菜"/>
        <q-btn color="secondary" :label="isEdit?'完成编辑':'提交'" @click="postCourseType"/>
    </div>
    <q-table
      :data="courseTypes"
      :columns="columns"
      selection="single"
      :selected.sync="selectedCourseType"
      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
      row-key="id"
      color="secondary"
      title="请先选择要删除和编辑的数据行"
      rows-per-page-label="每页显示行数："
      no-data-label="数据为空，请添加数据项"
      loading-label="加载中"
    >
      <template slot="top-selection" slot-scope="props">
        <q-btn color="secondary" flat label="重新编辑" class="q-mr-sm" @click="resetCourseType"/>
        <q-btn color="brown" flat label="取消编辑" @click="cancelEdit" />
        <div class="col" />
        <q-btn color="negative" flat round icon="delete" @click="deleteCourseType" />
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
      courseType:{
          name: null,
          // restaurantId: 1
      },
      courseTypes: [],
      columns: [
        {name:'id',field:'id', style:'display:none;'},
        {name:'name', label: '菜品类型', field: 'name', align: 'left'},
      ], 
      selectedCourseType: []
    }
  },
  computed: {
    restaurantId(){
      return this.$store.state.restaurant.id
    }
  },
  mounted(){
    console.log('restaurantId: ' + this.restaurantId)
    this.request({
      pagination: this.serverPagination
    })
  },
  methods: {
      postCourseType() {
          this.courseType.restaurantId = this.restaurantId
          console.log(this.courseType)
          this.axios.post("/courseType", this.courseType)
            .then(response => {
              
              if(!this.isEdit){
                this.courseTypes.push(response.data)
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
      deleteCourseType(){
        console.log("delete courseType ...")
        var courseType = this.selectedCourseType[0]
        this.axios.delete('/courseType', {
          data: courseType
        })
          .then(response => {
            console.log(response)
            this.courseTypes.pop(courseType)
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetCourseType(){
        console.log("reset seat ... ")
        this.courseType = this.selectedCourseType[0]
        this.isEdit = true
        console.log(this.courseType)
      },
      cancelEdit(){
        this.isEdit=false
        this.courseType = {}
      },
      request({pagination}){
        this.loading = true
        this.axios.get(`/courseType?page=${pagination.page-1}&size=${pagination.rowsPerPage}&restaurantId=${this.restaurantId}`)
          .then(res => {
            this.serverPagination = pagination
            this.serverPagination.rowsNumber = res.data.totalElements
            this.courseTypes = res.data.content
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      }
  }
}
</script>