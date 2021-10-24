<template>
  <div id="wrapper">
    <button @click="autoUpdate()">获取更新</button>
    <ol id="content">
      <li>生命周期过程展示</li>
    </ol>
  </div>
</template>

<script>


export default {
  name: 'landing-page',
  mounted() {
    var _ol = document.getElementById("content");
    this.$electron.ipcRenderer.on('message', (event, { message:message, data:data }) => {
      let _li = document.createElement("li");
      _li.innerHTML = message + " <br>data:" + JSON.stringify(data) + "<hr>";
      _ol.appendChild(_li);
      if (message === 'isUpdateNow') {
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
