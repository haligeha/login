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
      <el-select v-model="value" placeholder="请选择" @change="video(value)" id="splitSelect">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

     <div id="sourcediv1" v-show="false">
      <el-select v-model="sourceValue" multiple :multiple-limit=1 placeholder="请选择视频源">
        <el-option
          v-for="item in option"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </div>

      <div id="sourcediv2" v-show="false">
        <el-select v-model="sourceValue2" multiple  placeholder="请选择视频源" :multiple-limit=4>
          <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div id="sourcediv3" v-show="false">
        <el-select v-model="sourceValue3" multiple placeholder="请选择视频源" >
          <el-option
            v-for="item in option3"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div id="video1" v-show="false">
        <div id="player">

        </div>
      </div>
      <div id="video2"　v-show="false">
        <div id="player2">

        </div>
        <div id="player3">

        </div>
        <div id="player21">

        </div>
        <div id="player31">

        </div>
      </div>
     <div id="video3" v-show="false">

          <div id="player4">
          </div>

          <div id="player5">
          </div>

          <div id="player6">
          </div>

          <div id="player7">
          </div>

          <div id="player8">
          </div>

          <div id="player9">
          </div>
      </div>
    <!--  <div id="buttons">
        <input type="button" value="上" @click="up()">
        <input type="button" value="下" @click="down()">
        <input type="button" value="左" @click="left()">
        <input type="button" value="右" @click="right()">
        <input type="button" value="注册" @click="sub()">
        <input type="button" value="录制" @click="record()">
        <input type="button" value="查看录像" @click="records()">
      </div>-->

      <div id="buttons">
        <el-button type="primary" @click="up()">上</el-button>
        <el-button type="primary" @click="down()">下</el-button>
        <el-button type="primary" @click="left()">左</el-button>
        <el-button type="primary" @click="right()">右</el-button>
      </div>

    </div>
    <!-- /. PAGE INNER  -->
  </div>
  <!-- /. PAGE WRAPPER  -->

</template>
<script>

  export default {
/*    components: {
      oneScreen
    },*/
    data() {
      return {
        options: [{
          value: '1',
          label: '1=1*1'
        }, {
          value: '2',
          label: '4=2*2'
        },
          {
            value: '3',
            label: '6=5+1'
          }
        ],
        value: '',
       option: [{
          value: '选项1',
          label: '源1'
        }, {
          value: '选项2',
          label: '源2'
        }, {
          value: '选项3',
          label: '源3'
        }, {
          value: '选项4',
          label: '源4'
        }, {
          value: '选项5',
          label: '源5'
        }, {
          value: '选项6',
          label: '源6'
        }],
        sourceValue: [],
        option2: [{
          value: '选项1',
          label: '源1'
        }, {
          value: '选项2',
          label: '源2'
        }, {
          value: '选项3',
          label: '源3'
        }, {
          value: '选项4',
          label: '源4'
        }, {
          value: '选项5',
          label: '源5'
        }, {
          value: '选项6',
          label: '源6'
        }],
        sourceValue2: [],
        option3: [{
          value: '选项1',
          label: '源1'
        }, {
          value: '选项2',
          label: '源2'
        }, {
          value: '选项3',
          label: '源3'
        }, {
          value: '选项4',
          label: '源4'
        }, {
          value: '选项5',
          label: '源5'
        }, {
          value: '选项6',
          label: '源6'
        }],
        sourceValue3: [],
      }
    },
    created: function () {
      console.log("create");
      console.log("created2")
    },
    mounted: function () {
      var player2 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player',
        plugins: [RTMP],
        autoPlay: !0,
        width:960,
        height:540,
        /* plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
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
      var player = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player2',
        plugins: [RTMP],
      /*  plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
        width:480,
        height:270,
        // marqueePluginConfig:{
        //     textContent:"source:'rtmp://10.112.17.185/oflaDemo/haikang2'",
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
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player3',
        plugins: [RTMP],
        /*   plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
           textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
           duration:10000,
           direction:'left'
         },*/
        autoPlay: !0,
     //   width:400,
     //   height:400,
        width:480,
        height:270,

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
     var player4 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player4',
        plugins: [RTMP],
  /*      plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
       // width:600,
        //height:600,
        width:640,
        height:360,
        // marqueePluginConfig:{
        //     textContent:"source:'rtmp://10.112.17.185/oflaDemo/haikang2'",
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
      var player5 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player5',
        plugins: [RTMP],
       /* plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
       // width:300,
       // height:300,
        width:320,
        height:180,

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
      var player6 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player6',
        plugins: [RTMP],
      /*  plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
        width:320,
        height:180,
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
      var player7 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player7',
        plugins: [RTMP],
        /*plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
        width:320,
        height:180,
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
      var player8 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player8',
        plugins: [RTMP],
      /*  plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
        width:320,
        height:180,
        // marqueePluginConfig:{
        //     textContent:"source:'rtmp://10.112.17.185/oflaDemo/haikang2'",
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
      var player9 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player9',
        plugins: [RTMP],
        /*plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
        width:320,
        height:180,
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
      var player21 = new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player21',
        plugins: [RTMP],
       /* plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
        width:480,
        height:270,
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
      var player31= new Clappr.Player({
        source: 'rtmp://10.28.148.217/oflaDemo/haikang2',
        parentId: '#player31',
        plugins: [RTMP],
        /*plugins: [MarqueeOverlay,RTMP],
        marqueePluginConfig:{
          textContent:"rtmp://10.28.148.217/oflaDemo/haikang2",
          duration:10000,
          direction:'left'
        },*/
        autoPlay: !0,
        width:480,
        height:270,
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
    methods: {

      up: function () {
        $.ajax({
          // url:"http://10.128.210.216:8083/control?cmd=up&status=0",
          //@TODO
          url: "http://10.112.17.185:8083/control?cmd=up&status=0",
          type: "GET",

          success: function (resp) {
           console.log("视频加载成功");
          },
          error: function () {
            console.log("视频加载失败")
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
            console.log(resp);
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
           console.log(resp);
          },
          error:function () {
            // alert("fail");
          }
        });
      },
      records: function () {
        $.ajax({
          url: "http://10.112.17.185:8083/records?rtmp=rtmp://localhost/oflaDemo/haikang2",
          type: "GET",
          success: function (resp) {
            console.log(resp);
          },
          error: function () {
            //   alert("fail");
          }
        });
      },

     video:function(a){
        if(a=="1") {
          document.getElementById("video1").style.display = "block";
          document.getElementById("sourcediv1").style.display = "block";
          document.getElementById("sourcediv2").style.display = "none";
          document.getElementById("sourcediv3").style.display = "none";
          document.getElementById("video2").style.display = "none";
          document.getElementById("video3").style.display = "none";
          console.log(document.getElementById("video1"));
        }
           else if(a=="2"){
              document.getElementById("video1").style.display="none";
              document.getElementById("video2").style.display="block";
              document.getElementById("video3").style.display="none";
              document.getElementById("sourcediv2").style.display="block";
              document.getElementById("sourcediv1").style.display="none";
              document.getElementById("sourcediv3").style.display="none";
              console.log(document.getElementById("video2"));
            }
          else if(a=="3"){
           document.getElementById("video1").style.display="none";
           document.getElementById("video3").style.display="block";
           document.getElementById("video2").style.display="none";
           document.getElementById("sourcediv3").style.display="block";
           document.getElementById("sourcediv2").style.display="none";
           document.getElementById("sourcediv1").style.display="none";
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
  #video3{
    margin-left:20px;
  }
  #play{
    margin-left:20px;
  }
  #play2{
    margin-left:20px;
  }
 /* #player3{
    margin-left:400px;
    margin-top:-400px;
  }
  #player21{
    margin-left:0px;
    margin-top:0px;
  }
  #player31{
    margin-left:400px;
    margin-top:-400px;
  }*/
  #player3{
    margin-left:480px;
    margin-top:-270px;
  }
  #player21{
    margin-left:0px;
    margin-top:0px;
  }
  #player31{
    margin-left:480px;
    margin-top:-270px;
  }
  /*
  #player4{
    margin-left:20px;
  }
  #player5{
    margin-left:620px;
    margin-top:-600px;
  }
  #player6{
    margin-left:620px;
    margin-top:0px;
  }
  #player7{
    margin-left:20px;
    margin-top:0px;
  }
  #player8{
    margin-left:320px;
    margin-top:-300px;
  }
  #player9{
    margin-left:620px;
    margin-top:-300px;
  }
  */
  #player4{
    margin-left:0px;
  }
  #player5{
    margin-left:640px;
    margin-top:-360px;
  }
  #player6{
    margin-left:640px;
    margin-top:0px;
  }
  #player7{
    margin-left:0px;
    margin-top:0px;
  }
  #player8{
    margin-left:320px;
    margin-top:-180px;
  }
  #player9{
    margin-left:640px;
    margin-top:-180px;
  }
  #buttons{
    margin-top:20px;
    margin-left:20px;
  }
  #sourceSelect{
    width:200px;
  }
  #sourcediv1{
    display:inline;
    float: right;
    margin-right:600px;
  }

  #sourcediv1 .el-select{
    width:150px;
  }

  #sourcediv2{
    display:inline;
    float: right;
    margin-right:500px;
  }

  #sourcediv2 .el-select{
    width:300px;
  }

  #sourcediv3{
    display:inline;
    float: right;
    margin-right:400px;
  }

  #sourcediv3 .el-select{
    width:400px;
  }

  #splitSelect{
    margin-top: 10px;
    width:100px;
  }
</style>
