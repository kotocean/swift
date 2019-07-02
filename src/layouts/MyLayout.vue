<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-layout-header>
        <q-toolbar color="primary">
          <q-btn
            v-if="isSelectedRestaurant"
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu"/>
          </q-btn>

          <q-toolbar-title>
            {{ title }}
            <div slot="subtitle">{{ subtitle }}</div>
          </q-toolbar-title>
          <q-btn flat :label="$auth.user().name" @click="showUserinfo"/>&nbsp;&nbsp;
          <q-btn color="secondary" label="退出" @click="logout()"/>
        </q-toolbar>
      </q-layout-header>

      <q-layout-drawer
        v-if="isSelectedRestaurant"
        v-model="leftDrawerOpen"
        :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
      >
        <q-list no-border link inset-delimiter>
          <q-list-header>管理菜单</q-list-header>
          <q-item to="/welcome">
            <q-item-side icon="home"/>
            <q-item-main label="欢迎页面" sublabel="选择我的餐厅"/>
          </q-item>
        </q-list>

        <q-collapsible opened icon="shopping_cart" label="工作区" icon-toggle>
          <q-list>
            <q-item to="/">
              <q-item-side icon="list"/>
              <q-item-main label="点单" sublabel="开始点菜"/>
            </q-item>
            <q-item to="/cart">
              <q-item-side icon="add_shopping_cart"/>
              <q-item-main label="购物车" sublabel="查看购物车"/>
            </q-item>
            <q-item to="/order">
              <q-item-side icon="how_to_reg"/>
              <q-item-main label="订单" sublabel="查看订单"/>
            </q-item>
          </q-list>
        </q-collapsible>

        <q-collapsible v-if="isShopOwner" icon="perm_identity" label="信息维护区" icon-toggle>
          <q-list>
            <q-item to="/seat">
              <q-item-side icon="filter_1"/>
              <q-item-main label="席位" sublabel="席位信息维护"/>
            </q-item>
            <q-item to="/course/type">
              <q-item-side icon="filter_2"/>
              <q-item-main label="菜品类型" sublabel="菜品类型维护"/>
            </q-item>
            <q-item to="/course">
              <q-item-side icon="filter_3"/>
              <q-item-main label="菜品" sublabel="菜品信息维护"/>
            </q-item>
            <q-item to="/hire">
              <q-item-side icon="filter_4"/>
              <q-item-main label="员工" sublabel="员工管理"/>
            </q-item>
            <q-item to="/restaurant">
              <q-item-side icon="filter_5"/>
              <q-item-main label="餐厅" sublabel="餐厅信息维护"/>
            </q-item>
          </q-list>
        </q-collapsible>
        <div class="flex justify-center q-mt-md">
          <q-btn
            v-if="!isActiveFullScreen"
            color="primary"
            label="全屏"
            icon="fullscreen"
            @click="toggleFullScreen"
          />
          <q-btn
            v-else
            color="secondary"
            icon="fullscreen_exit"
            label="退出全屏"
            @click="toggleFullScreen"
          />
        </div>
      </q-layout-drawer>

      <q-page-container>
        <router-view/>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { openURL } from "quasar";

export default {
  name: "MyLayout",
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      user: {},
      showing: false,
      isActiveFullScreen: false
    };
  },
  computed: {
    isShopOwner() {
      console.log(this.$auth.user());
      // 判断当前登录用户角色是否是shopowner
      return this.$auth.user().roles.indexOf("shopowner") > 0;
    },
    isSelectedRestaurant() {
      return this.$store.state.restaurant.id > 0;
    },
    title() {
      console.log("title");
      if (this.isSelectedRestaurant) {
        return this.$store.state.restaurant.name;
      } else {
        return "点餐云";
      }
    },
    subtitle() {
      if (this.isSelectedRestaurant) {
        return this.$store.state.restaurant.address;
      } else {
        return "一款有温度的餐饮管理软件";
      }
    }
  },
  mounted() {
    if (!this.$auth.check()) {
      this.$router.replace("/login");
    } else {
      this.user = this.$auth.user();
    }
  },
  methods: {
    openURL,
    logout() {
      this.$auth.check = function() {
        return false;
      };
      localStorage.removeItem("default_auth_token");
      // this.$router.replace("/login");
      window.location.href =
        process.env.KEYCLOAK_OAUTH2_BASE_URL+'/auth/realms/master/protocol/openid-connect/logout?redirect_uri='+localStorage.getItem('websiteUrl')+'/login';
    },
    showUserinfo() {
      this.$q.notify({
        message: "姓名：" + this.$auth.user().name,
        detail: "GUID：" + this.$auth.user().guid,
        position: "top",
        type: "info",
        color: "info"
      });
      console.log(this.$auth.user().guid);
    },
    toggleFullScreen() {
      if (this.$q.fullscreen.isCapable) {
        this.isActiveFullScreen = !this.isActiveFullScreen;
        // 切换全屏模式：
        this.$q.fullscreen.toggle();
      } else {
        this.$q.notify({
          color: "negtive",
          message: "抱歉，当前浏览器不支持全屏！",
          icon: "pets"
        });
      }
    }
  }
};
</script>

<style>
</style>
