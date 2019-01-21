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
          <li class="active">数据</li>
        </ol>

      </div>
      <el-select v-model="value" placeholder="请选择" @change="video(value)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div id="video1" v-show="false">
        <div id="player">

        </div>
      </div>
      <div id="video2"　v-show="false">
        <div id="player2">

        </div>
        <div id="player3">

        </div>
      </div>
      <div id="buttons">
        <input type="button" value="上" @click="up()">
        <input type="button" value="下" @click="down()">
        <input type="button" value="左" @click="left()">
        <input type="button" value="右" @click="right()">
        <input type="button" value="注册" @click="sub()">
        <input type="button" value="录制" @click="record()">
        <input type="button" value="查看录像" @click="records()">

      </div>
    </div>
    <!-- /. PAGE INNER  -->
  </div>
  <!-- /. PAGE WRAPPER  -->

</template>
<script>
  export default {
    data() {
      return {
        options: [{
          value: '1',
          label: '1=1*1'
        }, {
          value: '2',
          label: '2=2*1'
        }],
        value: ''
      }
    },
    created: function () {
      console.log("create");
      console.log("created2")
    },
    mounted: function () {
      var player2 = new Clappr.Player({
        source: 'rtmp://10.112.17.185/oflaDemo/haikang1',
        parentId: '#player',
        plugins: [RTMP],
        autoPlay: !0,
        width:800,
        height:800,
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
      console.log(player2);
      var player = new Clappr.Player({
        source: 'rtmp://10.112.17.185/oflaDemo/haikang2',
        parentId: '#player2',
        plugins: [RTMP],
        autoPlay: !0,
        width:400,
        height:400,
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
      var player3 = new Clappr.Player({
        source: 'rtmp://10.112.17.185/oflaDemo/haikang3',
        parentId: '#player3',
        plugins: [RTMP],
        autoPlay: !0,
        width:400,
        height:400,
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
      console.log("mounted2")
    },
    methods: {

      up: function () {
        $.ajax({
          // url:"http://10.128.210.216:8083/control?cmd=up&status=0",
          //@TODO
          url: "http://10.112.17.185:8083/control?cmd=up&status=0",
          type: "GET",

          success: function (resp) {
            alert("hello");
          },
          error: function () {
            console.log()
            //    alert("fail");
          }
        });
      },


      left: function () {
        $.ajax({
          url: "http://10.112.17.185:8083/control?cmd=left&status=0",
          type: "GET",
          success: function (resp) {
          },
          error: function () {

            //alert("fail");
          }
        });
      },

      right: function () {
        $.ajax({
          url: "http://10.112.17.185:8083/control?cmd=right&status=0",
          type: "GET",
          success: function (resp) {
          },
          error: function () {

            //   alert("fail");
          }
        });
      },

      down: function () {
        $.ajax({
          url: "http://10.112.17.185:8083/control?cmd=down&status=0",
          type: "GET",
          success: function (resp) {
//                alert(resp);
          },
          error: function (error) {

            console.log(error);
          }
        });
      },


      sub: function () {
        $.ajax({
          url: "http://10.112.17.185:8083/subscribe",
          type: "GET",
          dataType:"text",
          success: function (resp) {
            var a=resp;
            alert(resp);
          },
          error: function () {

            //    alert("fail");
          }
        });
      },

      record:function(){
        $.ajax({
          url:"http://10.112.17.185:8083/record?rtmp=rtmp://localhost/oflaDemo/haikang4",
          type:"GET",
          success:function (resp) {
            alert(resp);
          },
          error:function () {
            // alert("fail");
          }
        });
      },
      records: function () {
        $.ajax({
          url: "http://10.112.17.185:8083/records?rtmp=rtmp://localhost/oflaDemo/haikang1",
          type: "GET",
          success: function (resp) {
            alert(resp);
          },
          error: function () {
            //   alert("fail");
          }
        });
      },
      video:function(a){
        if(a=="1"){
          console.log(a+"1111");
          document.getElementById("video1").style.display="block";
          document.getElementById("video2").style.display="none";
          console.log(document.getElementById("video1"));

          /*     $(obj).next("div").find("div").each(function(){
                 $(this).hide();
                 console.log( $(obj).next("div").find("video"));
               });
               $("#div" + obj.value).show();
               $("#video"+obj.value).show();*/

        }
        else if(a=="2"){
          console.log(a+"22222");
          document.getElementById("video1").style.display="none";
          document.getElementById("video2").style.display="block";
          console.log(document.getElementById("video2"));
        }
      }
    }
  }
</script>
<style>
  #video1{
    margin-left:20px;
  }
  #video2{
    margin-left:20px;
  }
  #play{
    margin-left:20px;
  }
  #player3{
    margin-left:420px;
    margin-top:-400px;
  }
  #buttons{
    margin-top:20px;
    margin-left:20px;
  }
</style>
