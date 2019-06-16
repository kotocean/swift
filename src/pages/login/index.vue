<template>
  <div>
      <q-btn color="primary" label="查看菜品" @click="getCourse()" ></q-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    console.log(this.getUrlParamString(window.location.href, 'access_token'));
    var access_token = this.getUrlParamString(window.location.href, 'access_token');
    var token_type = this.getUrlParamString(window.location.href, 'token_type')
    var expires_in = this.getUrlParamString(window.location.href, 'expires_in');
    var state = this.getUrlParamString(window.location.href, 'state')
    this.$auth.token(null, access_token)
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
    getCourse(){
        this.axios.get('/course',{
            headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('default_auth_token')
            }
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }
  }
};
</script>