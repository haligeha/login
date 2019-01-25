<template>
  <div class="hello">
    <div id="page-wrapper">
      <div class="header">
        <h1 class="page-header">
          视频
        </h1>
        <ol class="breadcrumb">
          <li><a href="#">主页</a></li>
        <li><a href="#">视频</a></li>
          <li class="active">轮询</li>
        </ol>

      </div>
      <div id="video1">
        <div id="player">
        </div>
      <el-button @click="nextOne()">播放下一视频</el-button>
     </div>
    </div>
    <!-- /. PAGE INNER  -->
  </div>
</template>

<script>
    export default {
      data() {
          return{
            resource: '',
            resources:[],
            index:0,
            player:null
        }
      },
    /*  created: function () {
        this.getResources()
        console.log("created")

      },*/
      mounted: function () {
     // this.getResources()
        this.getRes()
        console.log("mounted")
      },
      methods:{
 /*      getResources:function(){
          var vm = this;
          $.ajax({
            type: "GET",
            dataType: "JSON",
            //@TODO 无代理
            url: "http://10.112.17.185:8083/feedback",
            success: function (msg) {
              for(var i=0;i<msg.length;i++){
                var source=msg[i];
                vm.resources.push(source);
              }
              vm.getRes();
            },
            error: function (err) {
              this.$message({
                message: '加载视频源失败',
                type: 'warning'
              });
            }
          });
        },*/
        getRes:function(){
          var vm=this
          vm.player = new Clappr.Player({
            source: "rtmp://39.104.186.210/oflaDemo/haikang1",
            parentId: '#player',
       //     plugins: [RTMP],
            plugins: [MarqueeOverlay,RTMP],
            marqueePluginConfig:{
              textContent:"rtmp://39.104.186.210/oflaDemo/haikang1",
              duration:10000,
              direction:'left'
            },
            autoPlay: !0,
            width: 800,
            height: 800,
            rtmpConfig: {
              scaling: 'stretch',
              playbackType: 'live',
              bufferTime: 1,
              startLevel: 0,
              switchRules: {
                'SufficientBandwidthRule': {
                  'bandwidthSafetyMultiple': 1.15,
                  'minDroppedFps': 2
                },
                'InsufficientBufferRule': {
                  'minBufferLength': 2
                },
                'DroppedFramesRule': {
                  'downSwitchByOne': 10,
                  'downSwitchByTwo': 20,
                  'downSwitchToZero': 24
                },
                'InsufficientBandwidthRule': {
                  'bitrateMultiplier': 1.15
                }
              }
            }
          })
        },
    /*    getResource:function(){
          var vm=this;

          for(var i=0;i<vm.resources.length;i++){
            console.log(vm.resources[i]);
            var player2= new Clappr.Player({
          //    source:"rtmp://10.112.17.185/oflaDemo/haikang1",
              source: vm.resources[i],
              parentId: '#player',
              plugins: [RTMP],
              autoPlay: !0,
              width: 800,
              height: 800,
              rtmpConfig: {
                scaling: 'stretch',
                playbackType: 'live',
                bufferTime: 1,
                startLevel: 0,
                switchRules: {
                  'SufficientBandwidthRule': {
                    'bandwidthSafetyMultiple': 1.15,
                    'minDroppedFps': 2
                  },
                  'InsufficientBufferRule': {
                    'minBufferLength': 2
                  },
                  'DroppedFramesRule': {
                    'downSwitchByOne': 10,
                    'downSwitchByTwo': 20,
                    'downSwitchToZero': 24
                  },
                  'InsufficientBandwidthRule': {
                    'bitrateMultiplier': 1.15
                  }
                }
              }
            })
            console.log("player"+i)
          }
        },*/
        nextOne:function(){
         var vm=this;
         var m = vm.index+1
          vm.index= m%4;
         vm.resources=["rtmp://39.104.186.210/oflaDemo/haikang1","rtmp://39.104.186.210/oflaDemo/haikang2","rtmp://39.104.186.210/oflaDemo/haikang3"]
         vm.resource = vm.resources[vm.index];
       //   vm.resource = "rtmp://39.104.186.210/oflaDemo/haikang2";
         vm.resource=vm.resources[vm.index]
          console.log(vm.resource)
          vm.player.configure({
              source:vm.resource
          })

        }
      }
    }
</script>

<style scoped>

</style>
