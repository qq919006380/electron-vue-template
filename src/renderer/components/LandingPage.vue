<template>
  <div id="wrapper">
    <button @click="autoUpdate()">获取更新</button>
    <ol id="content">
      <li>生命周期过程展示</li>
      <li v-for="item in lifeCycleList">
        <div>{{ item.title }}</div>
        <div>{{ item.data }}</div>
      </li>
    </ol>
  </div>
</template>

<script>


export default {
  name: 'landing-page',
  data() {
    return {
      lifeCycleList: []
    }
  },
  mounted() {
    this.$electron.ipcRenderer.on('message', (event, { title, data }) => {
      this.lifeCycleList.push({ title: title, data: data })
      if (title === 'isUpdateNow') {
        if (confirm('是否现在更新？')) {
          this.$electron.ipcRenderer.send('updateNow');
        }
      }
    });

  },
  methods: {
    autoUpdate() {
      this.$electron.ipcRenderer.send('update');
    }
  }
}
</script>

<style>
</style>
