//map.enableKeyboard();
Mock.mock('http://123.com',{
    'lng|110-116.2-5':110.24,
    'lat|35-40.2-5':39.24
})

Mock.mock('http://1234.com',{
    'lng|110-116.2-5':110.24,
    'lat|35-40.2-5':39.24
})
Mock.mock('http://12345.com',{
    'lng|110-116.2-5':110.24,
    'lat|35-40.2-5':39.24
})

var dataUrl=['http://123.com','http://1234.com','http://12345.com']
var staffNameArray=['人员1','人员2','人员3']

function track(number) {
    number=3
    for (var i = 0;i < number; i++) {
        trackForEach(dataUrl[i],staffNameArray[i])
    }

    function trackForEach(url,staffName)
    {
    var polylinePointSum3=[]
    var j=0;
    var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
                        //offset: new BMap.Size(0, -5),    //相当于CSS精灵
                        imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
                        });
        var carMk1
        var loop=setInterval(function(){
            
            if(polylinePointSum3.length==6)
                        {
                            clearTimeout(loop)
                            console.log(polylinePointSum3)
                            var draw={point:polylinePointSum3.slice(0,drawPoint.length-1)}
                            
                            $.ajax({
                                url: '/api/tracks/',
                                type: 'post',
                                data:
                                    {staffName:staffName,tenantId:tenantId,drawPoint:JSON.stringify(draw)},
                                dataType: 'json',
                                //contentType: 'application/json;',

                                error:function(){
                                    toastr.error('巡检失败');
                                },
                                success: function(req) {
                                    toastr.success(staffName+'巡检完成')
                                    refreshTrack()
                                    //window.location.reload();
                                }
                            });  
                        }
            $.ajax({
                url:url,
                dataType:'json',
                success:function(e){
                        var row1 = {lng:e.lng,lat:e.lat};
                        polylinePointSum3.push(row1)

                }
            })
                        if(polylinePointSum3.length==1)
                        {
                            carMk1= new BMap.Marker(polylinePointSum3[0],{icon:myIcon});
                            map.addOverlay(carMk1);
                        } 

                        if(polylinePointSum3.length>1)
                        {  
                            var polyline = new BMap.Polyline([
                            new BMap.Point(polylinePointSum3[polylinePointSum3.length-2].lng,polylinePointSum3[polylinePointSum3.length-2].lat),
                            new BMap.Point(polylinePointSum3[polylinePointSum3.length-1].lng,polylinePointSum3[polylinePointSum3.length-1].lat)
                            ], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
                            map.addOverlay(polyline); 
                            //console.log(polylinePointSum3[j-1])
                            carMk1.setPosition(new BMap.Point(polylinePointSum3[polylinePointSum3.length-1].lng,polylinePointSum3[polylinePointSum3.length-1].lat));
                        }


        
        },2000) 

        

        // var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
        // //offset: new BMap.Size(0, -5),    //相当于CSS精灵
        // imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
        // });
        // var polylinePointSum1=[{"lng":116.296679,"lat":40.026605},{"lng":116.325425,"lat":40.027047},{"lng":116.358195,"lat":40.028373},{"lng":116.389815,"lat":40.025721},{"lng":116.421436,"lat":40.015997},{"lng":116.429485,"lat":40.002733},{"lng":116.405913,"lat":39.993005},{"lng":116.367394,"lat":39.992121},{"lng":116.334624,"lat":39.992121},{"lng":116.302428,"lat":39.995216},{"lng":116.288055,"lat":40.003617},{"lng":116.264484,"lat":40.007597}]
        // var pt1 = new BMap.Point(116.427, 39.909);
        // var carMk = new BMap.Marker(polylinePointSum1[0],{icon:myIcon});
        // map.addOverlay(carMk);        
        // var j=0;

        // var loop=setInterval(function(){
        //     var polyline = new BMap.Polyline([
        //     new BMap.Point(polylinePointSum1[j].lng,polylinePointSum1[j].lat),
        //     new BMap.Point(polylinePointSum1[j+1].lng,polylinePointSum1[j+1].lat)
        //     ], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
        //     map.addOverlay(polyline);
        //     ++j
        //     carMk.setPosition(new BMap.Point(polylinePointSum1[j].lng,polylinePointSum1[j].lat));
        //     if(j ==polylinePointSum1.length-1){
        //         clearTimeout(loop) 
        //         toastr.success('巡检完成');
        //     }      
        // },2000) 

        // var polylinePointSum2=[{"lng":116.396679,"lat":40.016605},{"lng":116.335425,"lat":40.037047},{"lng":116.358195,"lat":40.028373},{"lng":116.389815,"lat":40.025721},{"lng":116.421436,"lat":40.015997},{"lng":116.429485,"lat":40.002733},{"lng":116.405913,"lat":39.993005},{"lng":116.367394,"lat":39.992121},{"lng":116.334624,"lat":39.992121},{"lng":116.302428,"lat":39.995216},{"lng":116.288055,"lat":40.003617},{"lng":116.264484,"lat":40.007597}]
        // var pt1 = new BMap.Point(116.427, 39.909);
        // var carMk1 = new BMap.Marker(polylinePointSum2[0],{icon:myIcon});
        // map.addOverlay(carMk1);        
        // var k=0;

        // var loop1=setInterval(function(){
        //     var polyline1 = new BMap.Polyline([
        //     new BMap.Point(polylinePointSum2[k].lng,polylinePointSum2[k].lat),
        //     new BMap.Point(polylinePointSum2[k+1].lng,polylinePointSum2[k+1].lat)
        //     ], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
        //     map.addOverlay(polyline1);
        //     ++k
        //     carMk1.setPosition(new BMap.Point(polylinePointSum2[k].lng,polylinePointSum2[k].lat));
        //     if(k ==polylinePointSum2.length-1){
        //         clearTimeout(loop1) 
        //         toastr.success('巡检完成');
        //     }      
        // },2000) 
    }

}

function refreshTrack() {
    $.ajax({
        url:'/api/tenanttracks/'+tenantId,
        type: 'get',
        dataType:'json',
        success:function(result){
            //console.log(result)
            var appElement = document.querySelector('[ng-controller=trackCtrl]');
            //获取$scope变量
            var $scope = angular.element(appElement).scope();
            //调用names变量，并改变names的值
            $scope.track= result.tracks

        }
    })
}
//var app = angular.module("trackApp", []);
app.controller("trackCtrl", function($scope,$http) {
     $http.get('/api/tenanttracks/'+tenantId)
    .then(function (result) {
        //console.log(result.data.tracks)
        $scope.track = result.data.tracks;
    });

    $scope.fadeSiblings = function () {
        $(".trackModalClass").mouseover(function () {
            $(this).siblings().stop().fadeTo(300, 0.3);
        });
    };
    /*鼠标移出动画效果*/
    $scope.reSiblings = function () {
        $(".trackModalClass").mouseout(function () {
            $(this).siblings().stop().fadeTo(300, 1);
        });
    };

    $scope.trackDelete = function (item) {
        var mymessage=confirm("确认删除线路？");
            if(mymessage==true)
            {        
                $http({
                    method: 'delete',
                    url: '/api/tracks/'+item.id
                    }).then(function successCallback(response) {                                
                        refreshTrack()
                        //$("#right").load(location.href + " #right");
                    }, function errorCallback(response) {
                        toastr.error('删除失败');
                        // 请求失败执行代码
                });   
            }
    };

    $scope.showTrack = function (item) {
        $http.get('/api/tracks/'+item.id)
        .then(function (result) {
             $('#trackList').modal('hide');
        var polylinePointSum=$.parseJSON(result.data.tracks[0].drawPoint).point
        var drawPoint=[]
        for(i=0;i<polylinePointSum.length;i++)
        { 
            var polylinePoint=new BMap.Point(polylinePointSum[i].lng,polylinePointSum[i].lat)
            drawPoint.push(polylinePoint)
            //console.log(drawPoint)
        }
        var polyline = new BMap.Polyline(drawPoint);
        map.addOverlay(polyline);         
        map.setViewport(polyline.getBounds());
        
    });
    }
});
