<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
        <q-input  v-model="seat.name" stack-label="席位名称" placeholder="请输入，如2号桌"/>
        <q-input  v-model="seat.capacity" stack-label="容量" placeholder="最多可坐几人，如3"/>
        <q-btn color="secondary" label="提交" @click="postSeat"/>
    </div>

    <q-table
      :data="seats"
      :columns="columns"
      selection="single"
      :selected.sync="selectedSeat"
      :pagination.sync="serverPagination"
      row-key="id"
      color="secondary"
      title="请先选择要删除和编辑的数据行"
    >
      <template slot="top-selection" slot-scope="props">
        <q-btn color="secondary" flat label="重新编辑" class="q-mr-sm" @click="resetSeat"/>
        <!-- <q-btn color="secondary" flat label="Action 2" /> -->
        <div class="col" />
        <q-btn color="negative" flat round icon="delete" @click="deleteSeat" />
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
      serverPagination: {
        page: 1,
        rowsNumber: 10, // specifying this determines pagination is server-side
        rowsPerPage: 3
      },
      seat:{
          name: null,
          capacity: null,
          restaurantId: 1
      },
      seats: [],
      columns: [
        {name:'id',field:'id', style:'display:none;'},
        {name:'name', label: '席位号', field: 'name', align: 'left'},
        {name:'capacity', label: '容量',field: 'capacity', align: 'left'}
      ], 
      selectedSeat: []
    }
  },
  mounted() {
    this.request({
      pagination: this.serverPagination
    })
  },
  methods: {
      postSeat() {
          console.log(this.seat)
          this.axios.post("/seat", this.seat)
            .then(response => {
                console.log(response)
                this.seats.push(response.data)
            })
            .catch(error => {
                console.log(error)
            })
      },
      deleteSeat(){
        console.log("delete seat ...")
        var seat = this.selectedSeat[0]
        this.axios.delete('/seat', {
          data: seat
        })
          .then(response => {
            console.log(response)
            this.seats.pop(seat)
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetSeat(){
        console.log("reset seat ... ")
        this.seat = this.selectedSeat[0]
        console.log(this.seat)
      },
      request({pagination}){
        this.loading = true
        this.axios.get(`/seat?page=${pagination.page-1}&size=${pagination.rowsPerPage}`)
          .then(res => {
            this.serverPagination = pagination
            this.serverPagination.rowsNumber = res.data.totalElements
            this.seats = res.data.content
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      }
  }
}
</script>