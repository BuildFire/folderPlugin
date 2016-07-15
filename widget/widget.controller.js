/**
 * Created by zain on 13/01/16.
 */

/* Shared functionality */
var folderPluginShared = folderPluginShared || {};

folderPluginShared.getPluginDetails = function (pluginsInfo, pluginIds) {
    var returnPlugins = [];
    var tempPlugin = null;
    for (var id = 0; id < pluginIds.length; id++) {
        for (var i = 0; i < pluginsInfo.length; i++) {
            tempPlugin = {};
            var obj = pluginsInfo[i].data ? pluginsInfo[i].data : pluginsInfo[i];
            if (pluginIds[id] == obj.instanceId) {
                tempPlugin.instanceId = obj.instanceId;
                if (obj) {
                    tempPlugin.iconUrl = obj.iconUrl;
                    tempPlugin.iconClassName = obj.iconClassName;
                    tempPlugin.title = obj.title;
                    if(obj.pluginType) {
                        tempPlugin.pluginTypeId = obj.pluginType.token ;
                        tempPlugin.folderName = obj.pluginType.folderName;
                    }
                    else{
                        tempPlugin.pluginTypeId = obj.pluginTypeId;
                        tempPlugin.folderName = obj.folderName ;
                    }
                } else {
                    tempPlugin.iconUrl = "";
                    tempPlugin.title = "[No title]";
                }
                returnPlugins.push(tempPlugin);
            }
            tempPlugin = null;
        }
    }
     return returnPlugins;
};

folderPluginShared.getDefaultScopeData = function () {
    return {
        "_buildfire": {
            "plugins": {
                "dataType": "pluginInstance",
                "data": []
            }
        },
        "content": {
            "carouselImages": [{
                "action": "noAction",
                "iconUrl": "http://buildfire.imgix.net/b55ee984-a8e8-11e5-88d3-124798dea82d/7ef5f050-134f-11e6-bd0b-2511d1715baa.jpeg",
                "title": "image"
            }, {
                "action": "noAction",
                "iconUrl": "http://buildfire.imgix.net/b55ee984-a8e8-11e5-88d3-124798dea82d/7e028fa0-134f-11e6-b7ce-51a0b9ba84fd.jpg",
                "title": "image"
            }],
            "text": "<p>With the Folder plugin you can categorize existing plugins so that you can easily direct your users to the proper content. Check out our tutorial in our knowledge base for more information. HINT: You'll also want to check out our article on the WYSIWYG</p>",
            "loadAllPlugins": false
        },
        "design": {
            "backgroundImage": null,
            "selectedLayout": 1,
            "backgroundblur": 0,
            "hideText":false
        },
        "default" : true
    };
};
/*
 folderPluginShared.getEditorOptions = function () {
 return {
 plugins: 'advlist autolink link image lists charmap print preview',
 skin: 'lightgray',
 trusted: true,
 theme: 'modern'
 };
 };
 */
folderPluginShared.getLayouts = function () {
    return [
        "./layouts/layout1.png",
        "./layouts/layout2.png",
        "./layouts/layout3.png",
        "./layouts/layout4.png",
        "./layouts/layout5.png",
        "./layouts/layout6.png",
        "./layouts/layout7.png",
        "./layouts/layout8.png",
        "./layouts/layout9.png",
        "./layouts/layout10.png",
        "./layouts/layout11.png",
        "./layouts/layout12.png"
    ];
};


folderPluginShared.digest = function ($scope) {
    if (!$scope.$$phase && !$scope.$root.$$phase) {
        $scope.$apply();
    }
};
/* End shared functionality */

var folderPluginApp = angular.module('folderPlugin',['infinite-scroll']).directive("loadImage", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

            var _img = attrs.finalSrc;
            if (attrs.cropType == 'resize') {
                buildfire.imageLib.local.resizeImage(_img, {
                    width: attrs.cropWidth,
                    height: attrs.cropHeight
                }, function (err, imgUrl) {
                    _img = imgUrl;
                    replaceImg(_img);
                });
            } else {
                buildfire.imageLib.local.cropImage(_img, {
                    width: attrs.cropWidth,
                    height: attrs.cropHeight
                }, function (err, imgUrl) {
                    _img = imgUrl;
                    replaceImg(_img);
                });
            }

            function replaceImg(finalSrc) {
                var elem = $("<img>");
                elem[0].onload = function () {
                    element.attr("src", finalSrc);
                    elem.remove();
                };
                elem.attr("src", finalSrc);
            }
        }
    };
});

folderPluginApp.directive('backImg', ["$rootScope", function ($rootScope) {
    return function (scope, element, attrs) {
        attrs.$observe('backImg', function (value) {
            var img = '';
            if (value) {
                buildfire.imageLib.local.cropImage(value, {
                    width: window.innerWidth,
                    height: window.innerHeight
                }, function (err, imgUrl) {
                    if (imgUrl) {
                        img = imgUrl;
                        element.attr("style", 'background:url(' + img + ') !important ; background-size: cover !important;');
                    } else {
                        img = '';
                        element.attr("style", 'background-color:white');
                    }
                    element.css({
                        'background-size': 'cover'
                    });
                });
                // img = $filter("cropImage")(value, $rootScope.deviceWidth, $rootScope.deviceHeight, true);
            }
            else {
                img = "";
                element.attr("style", 'background-color:white');
                element.css({
                    'background-size': 'cover'
                });
            }
        });
    };
}]);

folderPluginApp.directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        scope: {
            ngSrc: '@'
        },
        link: function(scope, element, attrs) {
            element.on('load', function() {
                element.addClass('in');
            }).on('error', function() {
                //
            });

            scope.$watch('ngSrc', function(newVal) {
                element.removeClass('in');
            });
        }
    };
}]);

folderPluginApp.directive('emitLastRepeaterElement', function() {
    return function(scope) {
        if (scope.$last){
            scope.$emit('LastRepeaterElement');
        }
    };
});

folderPluginApp.directive('imageCarousel', function ($timeout) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, elem, attrs) {
            scope.carousel = null;
            scope.timeout = null;
            function initCarousel() {
                if (scope.timeout) {
                    $timeout.cancel(scope.timeout);
                }
                if (scope.carousel) {
                    scope.carousel.trigger("destroy.owl.carousel");
                    $(elem).find(".owl-stage-outer").remove();
                }
                scope.carousel = null;
                scope.timeout = $timeout(function () {
                    var obj = {
                        loop:false,
                        nav:false,
                        items:1
                    };
                    scope.carousel = $(elem).owlCarousel(obj);
                }, 100);
            }

            initCarousel();
            attrs.$observe("imageCarousel", function (newVal, oldVal) {
                if (newVal) {
                    if (scope.carousel) {
                        initCarousel();
                    }
                }
            });
        }
    }
})

folderPluginApp.controller('folderPluginCtrl', ['$scope', '$sce','$timeout','$rootScope', function ($scope, $sce,$timeout,$rootScope) {
    var view = null;
    var pagesCount = 0;
    var currentPage = 0;
    var loadingData = true;
    $scope.layout12Height='300px';
    $scope.layout12TotalItem=0;
    $scope.setWidth = function () {
        $rootScope.deviceWidth = window.innerWidth || 320;
    };
//    $scope.data = folderPluginShared.getDefaultScopeData();

    function initDeviceSize(callback) {
        $scope.deviceHeight = window.innerHeight;
        $scope.deviceWidth = window.innerWidth || 320;
        $scope.sliderHeight = Math.ceil(9 * $scope.deviceWidth / 16);
        if (callback) {
            if ($scope.deviceWidth == 0 || $scope.deviceHeight == 0) {
                setTimeout(function () {
                    initDeviceSize(callback);
                }, 500);
            } else {
                callback();
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            }
        }
    }

    function preparePluginsData(plugins) {
        if ($scope.data.design.selectedLayout == 5 || $scope.data.design.selectedLayout == 6) {
            var temp = [];
            var currentItem = 0;
            var pluginsLength = plugins.length;

            for (var i = 0; i < pluginsLength; i++) {
                if (i % 2 == 0) {
                    temp[currentItem] = [];
                    temp[currentItem].push(plugins[i]);
                } else {
                    temp[currentItem].push(plugins[i]);

                    currentItem++;
                }
            }

            $scope.data.plugins = temp;
        }else if  ($scope.data.design.selectedLayout == 12) {
            var matrix = [], i, k;
            var matrix = []
            for (i = 0, k = -1; i < plugins.length; i++) {
                if (i % 8 === 0) {
                    k++;
                    matrix[k] = [];
                }
                matrix[k].push(plugins[i]);
            }
            $scope.data.plugins = matrix;
        }else{
            $scope.data.plugins = plugins;
        }
    }

    /*
     * bind data to the scope
     * */
    function bind(data) {
        $scope.data.design = data.design;

        if (!$scope.data.design) {
            $scope.data.design = {
                backgroundImage: null,
                selectedLayout: 1,
                backgroundblur: 0
            };
        }
        if(data.plugins){
            var currentCount =Number(data.plugins.length);
        }


        preparePluginsData(data.plugins);


        if(currentCount){
            $scope.layout12TotalItem=currentCount;
        }

        $scope.data.content = data.content;
       /* if (data && data.content && data.content.text) {
            var $html = $('<div />', {html: data.content.text});
            $html.find('iframe').each(function (index, element) {
                var src = element.src;
                console.log('element is: ', src, src.indexOf('http'));
                src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
                element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
            });
            $scope.data.content.text = $sce.trustAsHtml($html.html());
        }*/

        if ($scope.data.content && $scope.data.content.carouselImages) {
            initDeviceSize(function () {
                $timeout(function () {
                    if (!view) {
                        view = new buildfire.components.carousel.view("#carousel", $scope.data.content.carouselImages);
                    } else {
                        view.loadItems($scope.data.content.carouselImages);
                    }
                }, 1000);
            });
        }

        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
        }
    }

    $scope.safeHtml = function (html) {
        if (html) {
            var $html = $('<div />', {html: html});
            $html.find('iframe').each(function (index, element) {
                var src = element.src;
                console.log('element is: ', src, src.indexOf('http'));
                src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
                element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
            });
            return $sce.trustAsHtml($html.html());
        }
    };

    var searchOptions = {pageIndex:0,pageSize:10};

    function dataLoadedHandler(result) {
        $scope.data = result.data;
        $scope.$digest();
        searchOptions.pageIndex=0;
        var pluginsList = null;
        if (result && result.data && !angular.equals({}, result.data) && result.data.content && result.data.design) {
            if (result.data.content && result.data.content.loadAllPlugins) {
                buildfire.components.pluginInstance.getAllPlugins(searchOptions,function (err, res) {
                    $scope.imagesUpdated = false;
                    pagesCount = Math.ceil(res.total / searchOptions.pageSize);
                    result.data.plugins = res.data;

                    bind(result.data);
                    loadingData = false;
                    if(pagesCount > 1)
                        $scope.paging();
                    $scope.imagesUpdated = !!result.data.plugins;
                });
            } else {
                $scope.imagesUpdated = false;
                pluginsList = result.data._buildfire.plugins;

                if (result.data._buildfire && pluginsList && pluginsList.result && pluginsList.data) {
                    result.data.plugins = folderPluginShared.getPluginDetails(result.data._buildfire.plugins.result, result.data._buildfire.plugins.data);
                }
                bind(result.data);
                $scope.imagesUpdated = !!result.data.plugins;
            }
        }
    };

    /*
     * Go pull saved data
     * */
    function loadData() {

        buildfire.datastore.getWithDynamicData(function (err, result) {
            if (err) {
                console.error("Error: ", err);
                return;
            }
            if(result.id){
                dataLoadedHandler(result);
            }else{
                var obj={
                    data:folderPluginShared.getDefaultScopeData()
                }
                dataLoadedHandler(obj);
            }

        });
    }

    loadData();

    /**
     * when a refresh is triggered get reload data
     */

    function resetPaging() {
        pagesCount = 0;
        searchOptions.pageIndex=currentPage=0;
        loadingData = true;
        $scope.data.plugins = [];
    }

    function onDatastoreChange(hardRefresh) {
        resetPaging();
        loadData();
    }

    buildfire.datastore.onRefresh(onDatastoreChange);

    buildfire.datastore.onUpdate(function (result) {
        resetPaging();
        dataLoadedHandler(result);
    });

    $scope.cropImage = function (url, settings) {
        var options = {};
        if (!url) {
            return "";
        }
        else {
            if (settings.height) {
                options.height = settings.height;
            }
            if (settings.width) {
                options.width = settings.width;
            }
            return buildfire.imageLib.cropImage(url, options);
        }
    };

    $scope.resizeImage = function (url, settings) {
        var options = {};
        if (!url) {
            return "";
        }
        else {
            if (settings.height) {
                options.height = settings.height;
            }
            if (settings.width) {
                options.width = settings.width;
            }
            return buildfire.imageLib.resizeImage(url, options);
        }
    };

    $scope.navigateToPlugin = function (plugin) {

        buildfire.navigation.navigateTo({
            pluginId: plugin.pluginTypeId,
            instanceId: plugin.instanceId,
            title: plugin.title,
            folderName: plugin.folderName
        });
    };

    $scope.paging = function () {
        if ($scope.data.content && $scope.data.content.loadAllPlugins && !loadingData && pagesCount > 1) {
            loadingData = true;
            $scope.loadMore = true;
            if (currentPage + 1 < pagesCount) {

                buildfire.spinner.show();
                currentPage++;
                searchOptions.pageIndex= currentPage;

                buildfire.components.pluginInstance.getAllPlugins(searchOptions, function (err, res) {
                    buildfire.spinner.hide();
                    loadingData = false;
                    var pluginsLength = res.data.length;

                    if ($scope.data.design.selectedLayout == 5 || $scope.data.design.selectedLayout == 6) {
                        var currentItem = $scope.data.plugins.length;


                        for (var i = 0; i < pluginsLength; i++) {
                            if (i % 2 == 0) {
                                $scope.data.plugins[currentItem] = [];
                                $scope.data.plugins[currentItem].push(res.data[i]);
                            } else {
                                $scope.data.plugins[currentItem].push(res.data[i]);
                                currentItem++;
                            }
                        }
                    } else {
                        for (var i = 0; i < pluginsLength; i++) {
                            $scope.data.plugins.push(res.data[i]);
                        }
                    }

                    folderPluginShared.digest($scope);
                  //  setTimeout($scope.paging,500);
                });
            }
        }
    };

    $scope.$on('LastRepeaterElement', function(){
       // $('.plugin-slider.text-center.owl-carousel').trigger("destroy.owl.carousel");
        $scope.layout12Height= $('.plugin-slider .plugin-slide').first().height()+380+'px';
            var slides = $('.plugin-slider .plugin-slide').length;
        $scope.layout12TotalItem=$scope.layout12TotalItem+1;
            // Slider needs at least 2 slides or you'll get an error.
            if(slides > 1){
                $('.plugin-slider').owlCarousel({
                    loop:false,
                    nav:false,
                    items:1
                });
            }
    });
}]);