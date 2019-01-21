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

        }
      },
      created: function () {
        this.getResources(),
          this.onclick()
      },
      mounted: function () {
        var player2 = new Clappr.Player({
          source: "rtmp://10.112.17.185/oflaDemo/haikang1",
          parentId: '#player',
          plugins: [RTMP],
          autoPlay: !0,
          width: 800,
          height: 800,
          // marqueePluginConfig:{
          //     textContent:"source:'rtmp://10.112.17.185/oflaDemo/haikang1'",
          //     duration:10000,
          //     direction:'left'
          // },
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
    console.log("mounted")
      },

      methods:{
      getResources:function(){
          var vm = this;
          $.ajax({
            type: "GET",
            dataType: "JSON",
            //  header:"Access-Control-Allow-Origin:  http://10.112.17.185:8100",
            //@TODO 无代理
            url: "http://10.112.17.185:8083/feedback",
            success: function (msg) {

              vm.resources=msg;
              console.log(vm.resources.length+"length")

            },
            error: function (err) {
              alert("加载0000失败");
            }
          });
        },
        nextOne:function(){
         var vm=this;
         var m = vm.index+1
          vm.index= m%4;
          vm.resource = vm.resources[vm.index];
        //  console.log("resource" + vm.index);

          console.log("nextOne");
       /*   var player2 = new Clappr.Player({
            source: vm.resource,
            parentId: '#player',
            plugins: [RTMP],
            autoPlay: !0,
            width: 800,
            height: 800,
            // marqueePluginConfig:{
            //     textContent:"source:'rtmp://10.112.17.185/oflaDemo/haikang1'",
            //     duration:10000,
            //     direction:'left'
            // },
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
          })*/
        }
      }
    }
</script>

<style scoped>

</style>
