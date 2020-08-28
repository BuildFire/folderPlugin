(function (angular) {
    "use strict";

    angular
        .module('folderPluginContent')
        .controller('folderPluginCtrl', ['$scope', 'Messaging', 'Utility',
            function ($scope, Messaging, Utility) {
                var tmpCarousalData = null;
                var tmpCarousalSettings=null;
                var editor = new buildfire.components.carousel.editor("#carousel",{},5,0);
                var _buildfire = {
                    plugins: {
                        dataType: "pluginInstance",
                        data: []
                    }
                };
                var _design = {
                    backgroundImage: null,
                    selectedLayout: 1,
                    backgroundblur: 0,
                    hideText: false
                };
                var navigationCallback = function (pluginData) {
                    Messaging.sendMessageToWidget({
                        name: 'OPEN_PLUGIN',
                        message: {
                            data: pluginData
                        }
                    });
                };
                var plugins = new buildfire.components.pluginInstance.sortableList("#plugins", [], { showIcon: true, confirmDeleteItem: false }, undefined, undefined, { itemEditable: true, navigationCallback: navigationCallback });
                var tmrDelay = null;
                var updateItem = null;
                $scope.editorOptions = Utility.getEditorOptions();
                $scope.masterData = Utility.getDefaultScopeData();
                $scope.datastoreInitialized = false;

                function isUnchanged(data) {
                    return angular.equals(data, $scope.masterData);
                }

                function updateMasterItem(data) {
                    $scope.masterData = angular.copy(data);
                }

                //Go pull any previously saved data
                buildfire.datastore.getWithDynamicData(function (err, result) {
                    if (!err) {
                        $scope.datastoreInitialized = true;
                    } else {
                        console.error("Error: ", err);
                        return;
                    }

                    var firstTimeVisit = false;
                    if (!result.id) {
                        result.data = Utility.getDefaultScopeData();
                        firstTimeVisit = true;
                    }

                    if (result && result.data && !angular.equals({}, result.data)) {
                        updateMasterItem(result.data);
                        $scope.data = result.data;
                        $scope.id = result.id;
                        if ($scope.data && $scope.data.content && $scope.data.content.carouselImages) {
                            editor.loadItems($scope.data.content.carouselImages);
                        }
                        if ($scope.data && $scope.data.content && $scope.data.content.speed) {
                            editor.setSpeed($scope.data.content.speed);
                        }
                        if ($scope.data && $scope.data.content && $scope.data.content.random) {
                            editor.setRandom($scope.data.content.random);
                        }
                        if ($scope.data && $scope.data._buildfire && $scope.data._buildfire.plugins && $scope.data._buildfire.plugins.result) {
                            var pluginsData = Utility.getPluginDetails($scope.data._buildfire.plugins.result, $scope.data._buildfire.plugins.data);
                            if ($scope.data.content && $scope.data.content.loadAllPlugins) {
                                if (pluginsData.length) {
                                    plugins.loadItems(pluginsData, "loadAll");
                                    $("#plugins").find(".carousel-items").hide();
                                } else {
                                    plugins.loadAllItems();
                                    $("#plugins").find(".carousel-items").hide();
                                }
                            } else {
                                plugins.loadItems(pluginsData, "selected");
                                $("#plugins").find(".carousel-items").show();
                            }
                        }

                        if ($scope.data && !$scope.data._buildfire) {
                            updateItem = angular.copy($scope.data);
                            updateItem._buildfire = _buildfire;
                            updateMasterItem(updateItem);
                            $scope.data = angular.copy(updateItem);
                        }

                        if ($scope.data && !$scope.data.design) {
                            updateItem = angular.copy($scope.data);
                            updateItem.design = _design;
                            updateMasterItem(updateItem);
                            $scope.data = angular.copy(updateItem);
                        }

                        if(firstTimeVisit){
                            setTimeout(function () {
                                saveData($scope.data);
                            }, 500);
                        }

                        if (tmrDelay) clearTimeout(tmrDelay);
                    }


                    /*
                     * watch for changes in data and trigger the saveDataWithDelay function on change
                     * */
                    $scope.$watch('data', saveDataWithDelay, true);
                    Utility.digest($scope);
                });

                /*
                 * Call the datastore to save the data object
                 */
                var saveData = function (newObj) {
                    if (!$scope.datastoreInitialized) {
                        console.error("Error with datastore didn't get called");
                        return;
                    }

                    if (newObj == undefined) return;
                    if ($scope.frmMain.$invalid) {
                        console.warn('invalid data, details will not be saved');
                        return;
                    }

                    if (newObj._buildfire && newObj._buildfire.plugins) {
                        newObj._buildfire.plugins.result = plugins.items;
                    }

                    updateMasterItem(newObj);

                    Utility.save(newObj);
                };

                /*
                 * create an artificial delay so api isnt called on every character entered
                 * */
                var saveDataWithDelay = function (newObj) {

                    if (tmrDelay) clearTimeout(tmrDelay);
                    if (isUnchanged(newObj)) {
                        return;
                    }
                    if (newObj.default) {
                        var instanceIds = newObj._buildfire.plugins.data;
                        var loadAllPlugins = newObj.content.loadAllPlugins;

                        newObj = Utility.getDefaultScopeBlankData();
                        newObj.content.loadAllPlugins = loadAllPlugins;
                        
                        newObj._buildfire.plugins.data = instanceIds;
                        if (tmpCarousalData) {
                            editor.loadItems(tmpCarousalData);
                            newObj.content.carouselImages = tmpCarousalData;
                            tmpCarousalData = null;
                        } else {
                            editor.loadItems([]);
                        }

                        if(tmpCarousalSettings){
                            newObj.content.speed= tmpCarousalSettings.speed;
                            newObj.content.random= tmpCarousalSettings.random;
                        }

                        $scope.data = newObj;
                    }
                    tmrDelay = setTimeout(function () {
                        saveData(newObj);
                    }, 500);
                };

                var getPluginsIds = function (plugins) {
                    var pluginsIds = [];
                    for (var i = 0; i < plugins.length; i++) {
                        pluginsIds.push(plugins[i].instanceId);
                    }
                    return pluginsIds;
                };

                // this method will be called when a new item added to the list
                editor.onDeleteItem = editor.onItemChange = editor.onOrderChange = function () {

                    $scope.data.content.carouselImages = editor.items;
                    Utility.digest($scope);
                };

                editor.onAddItems = function (items) {
                    tmpCarousalData = items;
                    $scope.data.content.carouselImages = editor.items;
                    Utility.digest($scope);
                };

                editor.onSpeedChange = function (speed) {
                    tmpCarousalSettings = {speed:speed,random:0};
                    $scope.data.content.speed = speed;
                    Utility.digest($scope);
                };

                editor.onRandomChange = function (random) {
                    tmpCarousalSettings = {speed:5000,random:random};
                    $scope.data.content.random = random;
                    Utility.digest($scope);
                };

                plugins.onAddItems = function () {
                    var scopeItems = $scope.data._buildfire.plugins.data;
                    var itemIds = getPluginsIds(plugins.items);
                    for (var i = 0; i < itemIds.length; i++) {
                        if (scopeItems.indexOf(itemIds[i]) == -1) {
                            scopeItems.push(itemIds[i]);
                        }
                    }

                    Utility.digest($scope);
                };

                plugins.onDeleteItem = function (item, index) {
                    if (plugins.items.length == 0) {
                        $scope.data._buildfire.plugins.data = [];
                    } else {
                        $scope.data._buildfire.plugins.data.splice(index, 1);
                    }

                    Utility.digest($scope);
                };

                plugins.onOrderChange = function (item, oldIndex, newIndex) {
                    var items = $scope.data._buildfire.plugins.data;

                    var tmp = items[oldIndex];

                    if (oldIndex < newIndex) {
                        for (var i = oldIndex + 1; i <= newIndex; i++) {
                            items[i - 1] = items[i];
                        }
                    } else {
                        for (var i = oldIndex - 1; i >= newIndex; i--) {
                            items[i + 1] = items[i];
                        }
                    }

                    items[newIndex] = tmp;

                    $scope.data._buildfire = {
                        "plugins": {
                            "dataType": "pluginInstance",
                            "data": items
                        }
                    };

                    Utility.digest($scope);
                };

                plugins.onLoadAll = function () {
                    $scope.data.content.loadAllPlugins = true;

                    $("#plugins").find(".carousel-items").hide();
                    Utility.digest($scope);
                };

                plugins.onUnloadAll = function (items) {
                    $scope.data.content.loadAllPlugins = false;
                    $("#plugins").find(".carousel-items").show();
                    Utility.digest($scope);
                };

                var digest = function () {
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };
            }

        ]);
})(window.angular);