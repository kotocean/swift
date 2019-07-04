<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 400px">
      <q-input v-model="restaurant.name" stack-label="餐厅名字" placeholder="请输入，如河南烩面馆" />
      <q-input v-model="restaurant.address" stack-label="地址" placeholder="请输入，如西直门地铁站向西200米" />
    </div>
    <table class="q-mb-sm">
      <tr>
        <td>
          <q-btn
            class="full-width"
            color="secondary"
            :label="isEdit?'完成编辑':'提交'"
            @click="postRestaurant"
          />
        </td>
        <td>
          <q-btn class="full-width" color="primary" label="清空" @click="clearRestaurant" />
        </td>
      </tr>
    </table>
    <q-table
      :data="restaurants"
      :columns="columns"
      selection="single"
      :selected.sync="selectedRestaurant"
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
        <q-btn color="secondary" flat label="重新编辑" class="q-mr-sm" @click="resetRestaurant" />
        <q-btn color="brown" flat label="取消编辑" @click="cancelEdit" />
        <q-btn color="brown" flat label="进入餐厅" @click="enterRestaurant" />
        <div class="col" />
        <q-btn color="negative" flat round icon="delete" @click="deleteRestaurant" />
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
      restaurant: {
        name: null,
        address: null,
        audit: false
      },
      loading: false,
      isEdit: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10, // specifying this determines pagination is server-side
        rowsPerPage: 10
      },
      restaurants: [],
      columns: [
        { name: "id", field: "id", style: "display:none;" },
        { name: "name", label: "餐厅名字", field: "name", align: "left" },
        { name: "address", label: "地址", field: "address", align: "left" },
        { name: "audit", label: "审核状态", field: "audit", align: "left" }
      ],
      selectedRestaurant: []
    };
  },
  mounted() {
    this.request({
      pagination: this.serverPagination
    });
  },
  methods: {
    postRestaurant() {
      if (this.isEdit) {
        this.modifyRestaurant();
      } else {
        this.createRestaurant();
      }
    },
    createRestaurant() {
      console.log(this.restaurant);
      this.restaurant.createdDate = new Date();
      this.axios
        .post("/restaurant", this.restaurant)
        .then(response => {
          console.log(response);
          this.restaurants.push(response.data);
          this.$q.notify({
            color: "positive",
            message: "添加成功！",
            icon: "tag_faces"
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    modifyRestaurant() {
      console.log(this.restaurant);
      this.axios
        .put("/restaurant", this.restaurant)
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "positive",
            message: "修改成功！",
            icon: "tag_faces"
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    clearRestaurant() {
      this.restaurant = {
        name: null,
        address: null,
        audit: false
      };
    },
    deleteRestaurant() {
      console.log("delete restaurant ...");
      var restaurant = this.selectedRestaurant[0];
      this.axios
        .delete("/restaurant", {
          data: restaurant
        })
        .then(response => {
          console.log(response);
          this.restaurants.pop(restaurant);
        })
        .catch(error => {
          console.log(error);
        });
    },
    resetRestaurant() {
      console.log("reset restaurant ... ");
      this.restaurant = this.selectedRestaurant[0];
      this.isEdit = true;
      console.log(this.restaurant);
    },
    cancelEdit() {
      this.clearRestaurant();
      this.isEdit = false;
    },
    request({ pagination }) {
      this.loading = true;
      this.axios
        .get(
          `/restaurant?page=${pagination.page - 1}&size=${
            pagination.rowsPerPage
          }`
        )
        .then(res => {
          this.serverPagination = pagination;
          this.serverPagination.rowsNumber = res.data.totalElements;
          this.restaurants = res.data.content;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    enterRestaurant() {
      this.$store.commit(
        "restaurant/setRestaurant",
        this.selectedRestaurant[0]
      );
      this.$router.push("/");
    }
  }
};
</script>