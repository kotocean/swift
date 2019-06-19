<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <div>
      <q-input v-model="hire.guid" stack-label="员工GUID" placeholder="员工唯一编号"/>
      <q-input v-model="hire.name" stack-label="员工姓名" placeholder="员工姓名"/>
      <q-btn-toggle disable
        v-model="hire.state"
        toggle-color="primary"
        :options="[
          {label: '雇佣', value: true},
          {label: '解雇', value: false}
        ]"
      />
      </div>
      <div>
        <q-btn-group>
          <q-btn color="secondary" :label="isEdit?'完成编辑':'提交'" @click="postHire"/>
          <q-btn color="primary" label="清空" @click="clearHire"/>
        </q-btn-group>
      </div>
      <q-table
        :data="hires"
        :columns="columns"
        selection="single"
        :selected.sync="selectedHire"
        :pagination.sync="serverPagination"
        :loading="loading"
        @request="request"
        row-key="id"
        color="secondary"
        title="请先选择要删除和编辑的数据行"
        rows-per-page-label="每页显示行数："
      >
        <template slot="top-selection" slot-scope="props">
          <q-btn color="secondary" flat label="重新编辑" class="q-mr-sm" @click="resetHire"/>
          <q-btn color="brown" flat label="取消编辑" @click="cancelEdit"/>
          <div class="col"/>
          <q-btn flat label="解雇" @click="deleteHire"/>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      hire: {
        guid: "",
        name: "",
        state: true
      },
      loading: false,
      isEdit: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10, // specifying this determines pagination is server-side
        rowsPerPage: 3
      },
      hires: [],
      columns: [
        { name: "id", field: "id", style: "display:none;" },
        { name: "guid", label: "员工编号", field: "guid", align: "left" },
        { name: "name", label: "姓名", field: "name", align: "left" }
      ],
      selectedHire: []
    };
  },
  computed: {
    restaurantId() {
      return this.$store.state.restaurant.id;
    },
    restaurantName() {
      return this.$store.state.restaurant.name;
    }
  },
  mounted() {
    console.log(this.restaurantId);
    this.request({
      pagination: this.serverPagination
    });
  },
  methods: {
    postHire() {
      this.hire.restaurantId = this.restaurantId;
      this.hire.restaurantName = this.restaurantName;
      console.log(this.hire);
      this.axios
        .post("/hire", this.hire)
        .then(response => {
          // 添加而非编辑时，需要加入到table中
          if (!this.isEdit) {
            this.hires.push(response.data);
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
          console.log(response);
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
    clearHire() {
      this.hire = {
        guid: "",
        name: "",
        state: true
      };
    },
    deleteHire() {
      console.log("cancel hire ...");
      var hire = this.selectedHire[0];
      this.axios
        .post("/hire/cancel", {
          data: hire
        })
        .then(response => {
          console.log(response);
          this.hires.pop(hire);
        })
        .catch(error => {
          console.log(error);
        });
    },
    resetHire() {
      console.log("reset hire ... ");
      this.hire = this.selectedHire[0];
      this.isEdit = true;
      console.log(this.hire);
    },
    cancelEdit() {
      this.isEdit = false;
      this.state = true;
    },
    request({ pagination }) {
      this.loading = true;
      this.axios
        .get(
          `/restaurant/users?page=${pagination.page - 1}&size=${
            pagination.rowsPerPage
          }&restaurantId=${this.restaurantId}`
        )
        .then(res => {
          console.log(res)

          this.serverPagination = pagination;
          this.serverPagination.rowsNumber = res.data.totalElements;
          this.hires = res.data.content;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>
