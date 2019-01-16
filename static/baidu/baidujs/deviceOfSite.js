/////////逆解析////
function bdGEO(){
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {        
            var deviceOdSiteId=reqArray[i].id
            console.log(reqArray[i].id)
            $('#address1').val(reqArray[i].name);
            }
    }

    // $.ajax({
    //     url: 'api/3d815/siteDevicePaging/'+tenantId+'/'+deviceOdSiteId+'?limit=9&idOffset=&textOffset=',
    //     type: 'get',
    //     async : false,
    //     dataType: 'json',
    //     contentType: 'application/json;',

    //     error:function(){
    //         toastr.error('设备接口失败');
    //     },
    //     success: function(req) {
    //          if(req.nextPageLink!=null)
    //          {
    //             idOffset = req.nextPageLink.idOffset;
    //             textOffset = req.nextPageLink.textOffset;
    //             hasNext = req.hasNext;
    //             console.log(idOffset);
    //             console.log(textOffset);
    //             console.log(hasNext);
    //             preDeviceId.push(idOffset);
    //             preDeviceName.push(textOffset);
    //          }
            
    //     //}
    //        }
    //    });
    
        $.ajax({
        url: 'api/3d815/siteDevicePaging/'+tenantId+'/'+deviceOdSiteId+'?limit=9&idOffset=&textOffset=',
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',

        error:function(){
            toastr.error('失败');
        },
        success: function(req) {
            console.log(req)
            var appElement = document.querySelector('[ng-controller=myCtrl1]');
            //获取$scope变量
            var $scope = angular.element(appElement).scope();
            //调用names变量，并改变names的值
            $scope.names= req.data;
            //新建names，如果想同步到Angular控制器中，则需要调用$apply()方法即可
            $scope.$apply();
            //调用控制器中的show()方法
            $scope.show();
        }

       });
        
    }

app.controller("myCtrl1", function($scope) {
    $scope.show = function () {

     $('#addressList').modal('show');
    };
    $scope.a1 = function ($index) {
        var ePoint=$("#myTable4").find("tr").eq($index+1).find("td").eq(0).prevObject[2].innerHTML;
        map.centerAndZoom(new BMap.Point(ePoint.substring(1, ePoint.indexOf(',')),ePoint.substring(ePoint.indexOf(',')+1, ePoint.length-1)), 22);
        $('#addressList').modal('hide');
    };
    $scope.nextPage=function(){
    console.log(hasNext);
    if(hasNext){
        jQuery.ajax({
            url:'api/3d815/siteDevicePaging/'+tenantId+'/'+sitesID+'?limit=9&idOffset='+idOffset+'&textOffset='+textOffset,
            contentType: "application/json; ",
            async: false,
            type:"GET",
            success:function(req) { 
                //console.log('api/3d815/siteDevicePaging/'+tenantId+'/'+sitesID+'?limit=9&idOffset='+idOffset+'&textOffset='+textOffset);
                pageNum++;  
                showTable(req)
                if( req.hasNext == true){
                    idOffset = req.nextPageLink.idOffset;
                    textOffset = req.nextPageLink.textOffset;
                    hasNext = req.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                    //console.log($scope.deviceList);
                }else{
                    hasNext = req.hasNext;                   
                }
            },
            error:function(err){
                toastr.error("当前已是最后一页！错误");
            }
        });
    }else{
        toastr.warning("当前已是最后一页！");
    }
    
   
}

//上一页
$scope.prePage=function() {
    if(pageNum == 1){
        toastr.warning("当前已是第一页！");
    }
    else if(pageNum == 2){
        jQuery.ajax({
            url:"/api/3d815/siteDevicePaging/"+tenantId+'/'+sitesID+"?limit=9&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) {
                pageNum--;
                if(req.data.length != 0){
                    showTable(req)
                    idOffset = req.nextPageLink.idOffset;
                    textOffset = req.nextPageLink.textOffset;
                    hasNext = req.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
            },
            error:function(err){
                //console.log(err)
                toastr.error("错误");
            }
        }); 
    }else{
        jQuery.ajax({
            url:"/api/3d815/siteDevicePaging/"+tenantId+'/'+sitesID+"?limit=9&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) { 
                pageNum--;
                showTable(req);
                idOffset = req.nextPageLink.idOffset;
                textOffset = req.nextPageLink.textOffset;
                hasNext = req.hasNext;
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
                
            },
            error:function(err){
                //console.log(err)
                toastr.error("错误");
            }
        });
    }
}
  });