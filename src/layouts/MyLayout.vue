<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          点餐云
          <div slot="subtitle">一款有温度的餐饮管理软件</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>管理菜单</q-list-header>
        <q-item to="/welcome">
          <q-item-side icon="home" />
          <q-item-main label="欢迎页面" sublabel="选择我的餐厅" />
        </q-item>
        <q-item to="/">
          <q-item-side icon="home" />
          <q-item-main label="首页" sublabel="开始点菜" />
        </q-item>
        <q-item to="/course">
          <q-item-side icon="school" />
          <q-item-main label="菜品" sublabel="菜品信息维护" />
        </q-item>
        <q-item to="/course/type">
          <q-item-side icon="school" />
          <q-item-main label="菜品类型" sublabel="菜品类型维护" />
        </q-item>
        <q-item to="/seat">
          <q-item-side icon="school" />
          <q-item-main label="席位" sublabel="席位信息维护" />
        </q-item>
        <q-item to="/restaurant">
          <q-item-side icon="school" />
          <q-item-main label="餐厅" sublabel="餐厅信息维护" />
        </q-item>
        <q-item to="/cart">
          <q-item-side icon="school" />
          <q-item-main label="购物车" sublabel="查看购物车" />
        </q-item>
        <q-item to="/order">
          <q-item-side icon="school" />
          <q-item-main label="订单" sublabel="查看订单" />
        </q-item>
        <q-item @click.native="openURL('https://github.com/quasarframework/')">
          <q-item-side icon="code" />
          <q-item-main label="GitHub" sublabel="github.com/quasarframework" />
        </q-item>
        
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
