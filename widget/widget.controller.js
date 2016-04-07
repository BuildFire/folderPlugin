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
        _buildfire: {
            plugins: {
                dataType: "pluginInstance",
                data: []
            }
        },
        content: {
            carouselImages: [],
            text: "",
            loadAllPlugins: false
        },
        design: {
            backgroundImage: null,
            selectedLayout: 1,
            backgroundblur: 0
        }
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
        "./layouts/layout6.png"
    ];
};


folderPluginShared.digest = function ($scope) {
    if (!$scope.$$phase && !$scope.$root.$$phase) {
        $scope.$apply();
    }
};
/* End shared functionality */

var folderPluginApp = angular.module('folderPlugin',['infinite-scroll']).directive("loadImage", [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

            var elem = $("<img>");
            elem[0].onload = function () {
                element.attr("src", attrs.finalSrc);
                elem.remove();
            };
            elem.attr("src", attrs.finalSrc);
        }
    };
}]);

folderPluginApp.controller('folderPluginCtrl', ['$scope', '$sce','$timeout', function ($scope, $sce,$timeout) {
    var view = null;
    var pagesCount = 0;
    var currentPage = 0;
    var loadingData = true;

    $scope.data = folderPluginShared.getDefaultScopeData();

    function initDeviceSize(callback) {
        $scope.deviceHeight = window.innerHeight;
        $scope.deviceWidth = window.innerWidth;
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
        }
    }

    /*
     * bind data to the scope
     * */
    function bind(data) {
        $scope.data = data;

        if (!$scope.data.design) {
            $scope.data.design = {
                backgroundImage: null,
                selectedLayout: 1,
                backgroundblur: 0
            };
        }

        preparePluginsData(data.plugins);

        if (data && data.content && data.content.text) {
            if (data.content.text.replace(/<.+?>/g, "") == "") {
                $scope.data.content.text = "";
            } else {
                $scope.data.content.text = $sce.trustAsHtml(data.content.text);
            }
        }

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

    var searchOptions = {pageIndex:0,pageSize:10};

    function dataLoadedHandler(result) {

        searchOptions.pageIndex=0;
        var pluginsList = null;
        if (result && result.data && !angular.equals({}, result.data) && result.data.content && result.data.design) {
            if (result.data.content && result.data.content.loadAllPlugins) {
                buildfire.components.pluginInstance.getAllPlugins(searchOptions,function (err, res) {
                    pagesCount = Math.ceil(res.total / searchOptions.pageSize);
                    result.data.plugins = res.data;

                    bind(result.data);
                    loadingData = false;
                    if(pagesCount > 1)
                        $scope.paging();
                });
            } else {
                pluginsList = result.data._buildfire.plugins;

                if (result.data._buildfire && pluginsList && pluginsList.result && pluginsList.data) {
                    result.data.plugins = folderPluginShared.getPluginDetails(result.data._buildfire.plugins.result, result.data._buildfire.plugins.data);
                }
                bind(result.data);
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
            dataLoadedHandler(result);
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
        console.log("========= Inside paging")
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
                            for (var i = 0; i < 10; i++) {
                            $scope.data.plugins.push(res.data[i]);
                             }
                        }

                    folderPluginShared.digest($scope);
                  //  setTimeout($scope.paging,500);
                });
            }
        }
    };
}]);