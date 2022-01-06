<template>
  <v-app id="loginComplete">
    <v-overlay
        :value="true"
        color="#E1F5FE"
        :z-index="6"
        :opacity="0.7"
    >
      <fulfilling-square-spinner
          :animation-duration="4000"
          :size="50"
          color="#ff1d5e"
      />
    </v-overlay>
  </v-app>
</template>
<script>
import {FulfillingSquareSpinner} from "epic-spinners";
import API from "../router/API";
import qs from "qs";

export default {
  components: {
    FulfillingSquareSpinner,
  },
  created() {
    console.log("创建完成");
    this.getTokenAndInfo();
  },
  methods: {
    getTokenAndInfo() {
      this.axios({
        url: API.OAUTH_TOKEN, //请求路径（接口）
        method: "POST", //请求方式
        headers: {
          Authorization: "Basic bG92ZS1zcG9ydHMtYWRtaW46MTIzNDU2",
          "content-type": "application/x-www-form-urlencoded",
        }, // 请求头，发送FormData格式的数据，必须是 这种请求头。
        data: qs.stringify({
          code: this.$route.query.code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:8080/token",
          scope: "all",
        }),
      }).then((response) => {
        console.log("获取token成功");
        console.log(response.data.expires_in);
        this.$cookies.set(
            "token",
            JSON.stringify(response.data),
            response.data.expires_in
        );
        this.$bus.$emit("LoginComplete",response.data)
        this.$router.push({ path: '/dashboard', query: null})
      }).catch((error) => {
        console.error("获取token失败");
        console.error(error);
        this.$router.push({ path: '/500', query: null})
      });
    },
  },
};
</script>
