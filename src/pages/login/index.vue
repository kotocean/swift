<template>
  <div class="flex flex-center q-mt-sm">
    <!-- <p>欢迎使用“点餐云”管理您的餐厅</p> -->
    <q-card inline style="max-width: 600px;">
      <q-card-media>
        <img src="statics/show-img.png">
      </q-card-media>
      <q-card-title>点餐云</q-card-title>
      <q-card-main>
        <p>恭祝您，财源滚滚来~</p>
        <p class="text-faded">我们的宗旨是，用心服务好每一个餐饮人.</p>
      </q-card-main>
      <q-card-separator/>
      <q-card-actions align="end">
        <q-btn flat :label="localDate"/>
        <q-btn flat :label="localTime"/>
        <q-btn color="primary" label="登录" @click="login()"/>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        name: ""
      },
      count: 1
    };
  },
  computed: {
    localDate() {
      return new Date().toLocaleDateString();
    },
    localTime() {
      return new Date().toLocaleTimeString();
    }
  },
  mounted() {
    // console.log(this.getUrlParamString(window.location.href, 'access_token'));
    if (window.location.href.indexOf("access_token") > 0) {
      var access_token = this.getUrlParamString(
        window.location.href,
        "access_token"
      );
      var token_type = this.getUrlParamString(
        window.location.href,
        "token_type"
      );
      var expires_in = this.getUrlParamString(
        window.location.href,
        "expires_in"
      );
      var state = this.getUrlParamString(window.location.href, "state");
      this.$auth.token(null, access_token);
      this.axios.defaults.headers.common["Authorization"] =
        "Bearer " + access_token;
      this.axios
        .get("/userinfo")
        .then(response => {
          console.log(response.data);
          this.user = response.data;
          // localStorage.setItem('user', JSON.stringify(response.data)) //保存已登录用户信息
          this.$auth.user(response.data);
          this.$router.replace("/welcome");
          this.$auth.check = function() {
            return true;
          };
          console.log(this.$auth.user().name);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      // 显示登录页面
    }
  },
  methods: {
    getUrlParamString(url, name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var _str = url.replace("#", "&");
      var r = _str.match(reg);
      if (r != null) {
        var val = decodeURIComponent(r[2]);
        if (val != null && val.toString().length >= 1) {
          return val;
        }
      }
      return "";
    },
    login() {
      this.$auth.oauth2({
        provider: "keycloak"
      });
    }
  }
};
</script>