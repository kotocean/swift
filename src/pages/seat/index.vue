<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
      <div class="q-ma-sm">
        <q-input v-model="seat.name" stack-label="席位名称" placeholder="请输入，如2号桌"/>
        <q-input v-model="seat.capacity" stack-label="容量" placeholder="最多可坐几人，如3"/>
        <q-btn-toggle
          v-model="seat.state"
          toggle-color="primary"
          :options="[
            {label: '可用', value: true},
            {label: '打扫中', value: false}
          ]"
        />
      </div>
      <q-btn color="secondary" :label="isEdit?'完成编辑':'提交'" @click="postSeat"/>
    </div>

    <q-table
      :data="seats"
      :columns="columns"
      selection="single"
      :selected.sync="selectedSeat"
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
        <q-btn color="secondary" flat label="重新编辑" class="q-mr-sm" @click="resetSeat"/>
        <q-btn color="brown" flat label="取消编辑" @click="cancelEdit"/>
        <div class="col"/>
        <q-btn color="negative" flat round icon="delete" @click="deleteSeat"/>
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      isEdit: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10, // specifying this determines pagination is server-side
        rowsPerPage: 10
      },
      seat: {
        name: null,
        capacity: null,
        state: true,
      },
      seats: [],
      columns: [
        { name: "id", field: "id", style: "display:none;" },
        { name: "name", label: "席位号", field: "name", align: "left" },
        { name: "capacity", label: "容量", field: "capacity", align: "left" },
        { name: "state", label: "是否可用", field: "state", align: "left" }
      ],
      selectedSeat: []
    };
  },
  computed: {
    restaurantId() {
      return this.$store.state.restaurant.id;
    }
  },
  mounted(){
    console.log('restaurantId: ' + this.restaurantId)
    this.request({
      pagination: this.serverPagination
    });
  },
  methods: {
    postSeat() {
      this.seat.restaurantId = this.restaurantId
      console.log(this.seat);
      this.axios
        .post("/seat", this.seat)
        .then(response => {
          console.log(response);

          if (!this.isEdit) {
            this.seats.push(response.data);
            this.$q.notify({
              color: "positive",
              message: "添加成功！",
              icon: "tag_faces"
            });
          } else {
            this.$q.notify({
              color: "positive",
              message: "修改成功！",
              icon: "tag_faces"
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: "negative",
            message: "喔,出问题了~",
            icon: "face"
          });
        });
    },
    deleteSeat() {
      console.log("delete seat ...");
      var seat = this.selectedSeat[0];
      this.axios
        .delete("/seat", {
          data: seat
        })
        .then(response => {
          console.log(response);
          this.seats.pop(seat);
        })
        .catch(error => {
          console.log(error);
        });
    },
    resetSeat() {
      console.log("reset seat ... ");
      this.seat = this.selectedSeat[0];
      this.isEdit = true;
      console.log(this.seat);
    },
    cancelEdit() {
      this.isEdit = false;
      this.seat = { state: true };
    },
    request({ pagination }) {
      this.loading = true;
      this.axios
        .get(`/seat/manage?page=${pagination.page - 1}&size=${pagination.rowsPerPage}&restaurantId=${this.restaurantId}`)
        .then(res => {
          this.serverPagination = pagination;
          this.serverPagination.rowsNumber = res.data.totalElements;
          this.seats = res.data.content;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>