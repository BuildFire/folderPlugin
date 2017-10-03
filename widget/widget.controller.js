(function (angular) {
    "use strict";
    angular
        .module('folderPluginWidget')
        .controller('folderPluginCtrl', ['$scope', '$sce', '$timeout', '$rootScope', 'Messaging', 'Utility',
            function ($scope, $sce, $timeout, $rootScope, Messaging, Utility) {
                var view = null;
                var pagesCount = 0;
                var currentPage = 0;
                var loadingData = true;
                $scope.layout12Height = '300px';
                $scope.layout12TotalItem = 0;
                $scope.setWidth = function () {
                    $rootScope.deviceWidth = window.innerWidth || 320;
                };

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
                    } else if ($scope.data.design.selectedLayout == 12) {
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
                    } else {
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
                    if (data.plugins) {
                        var currentCount = Number(data.plugins.length);
                    }

                    if($scope.data.design.lgBackgroundImage && window.innerWidth >= 600){
                        //iPads
                        $scope.data.design.bgImage = $scope.data.design.lgBackgroundImage;
                    } else {
                        $scope.data.design.bgImage = $scope.data.design.backgroundImage;
                    }

                    preparePluginsData(data.plugins);


                    if (currentCount) {
                        $scope.layout12TotalItem = currentCount;
                    }

                    $scope.data.content = data.content;
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
                        var $html = $('<div />', { html: html });
                        $html.find('iframe').each(function (index, element) {
                            var src = element.src;
                            console.log('element is: ', src, src.indexOf('http'));
                            src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
                            element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
                        });
                        return $sce.trustAsHtml($html.html());
                    }
                };

                var searchOptions = { pageIndex: 0, pageSize: 10 };

                function dataLoadedHandler(result) {
                    $scope.data = result.data;
                    $scope.$digest();
                    searchOptions.pageIndex = 0;
                    var pluginsList = null;
                    if (result && result.data && !angular.equals({}, result.data) && result.data.content && result.data.design) {
                        if (result.data.content && result.data.content.loadAllPlugins) {
                            buildfire.components.pluginInstance.getAllPlugins(searchOptions, function (err, res) {
                                $scope.imagesUpdated = false;
                                pagesCount = Math.ceil(res.total / searchOptions.pageSize);
                                result.data.plugins = res.data;

                                bind(result.data);
                                loadingData = false;
                                if (pagesCount > 1)
                                    $scope.paging();
                                $scope.imagesUpdated = !!result.data.plugins;
                            });
                        } else {
                            $scope.imagesUpdated = false;
                            pluginsList = result.data._buildfire.plugins;

                            if (result.data._buildfire && pluginsList && pluginsList.result && pluginsList.data) {
                                result.data.plugins = Utility.getPluginDetails(result.data._buildfire.plugins.result, result.data._buildfire.plugins.data);
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
                        if (result.id) {
                            dataLoadedHandler(result);
                        } else {
                            var obj = {
                                data: Utility.getDefaultScopeData()
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
                    searchOptions.pageIndex = currentPage = 0;
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
                            searchOptions.pageIndex = currentPage;

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

                                Utility.digest($scope);
                            });
                        }
                    }
                };

                $scope.$on('LastRepeaterElement', function () {
                    $scope.layout12Height = $('.plugin-slider .plugin-slide').first().height() + 380 + 'px';
                    var slides = $('.plugin-slider .plugin-slide').length;
                    $scope.layout12TotalItem = $scope.layout12TotalItem + 1;
                    // Slider needs at least 2 slides or you'll get an error.
                    if (slides > 1) {
                        $('.plugin-slider').owlCarousel({
                            loop: false,
                            nav: false,
                            items: 1
                        });
                    }
                });

                Messaging.onReceivedMessage = function (event) {
                    if (event) {
                        var plugin = event.message.data;
                        switch (event.name) {
                            case 'OPEN_PLUGIN':
                                console.log('came here plugin', event.message.data);
                                var fName = '';
                        if (plugin && plugin.pluginType && plugin.pluginType.folderName)
                            fName = plugin.pluginType.folderName;
                        else if (plugin && plugin.folderName)
                            fName = plugin.folderName;

                        buildfire.navigation.navigateTo({
                            pluginId: plugin.pluginId,
                            instanceId: plugin.instanceId,
                            title: plugin.title,
                            folderName: fName
                        });
                                break;
                        }
                    }
                };
            }]);
})(window.angular);