/**
 * Created by zain on 10/01/16.
 */
var folderPluginApp = angular.module('folderPlugin', ['ui.tinymce']);

folderPluginApp.controller('folderPluginCtrl', ['$scope', function ($scope) {
    var editor = new buildfire.components.carousel.editor("#carousel");
    var plugins = new buildfire.components.pluginInstance.sortableList("#plugins", [], { showIcon: true, confirmDeleteItem: false });
    var tmrDelay = null;

    $scope.editorOptions = folderPluginShared.getEditorOptions();

    $scope.data = folderPluginShared.getDefaultScopeData();



    $scope.datastoreInitialized = false;

    /*
     * Go pull any previously saved data
     * */
    buildfire.datastore.getWithDynamicData(function (err, result) {
        if (!err) {
            $scope.datastoreInitialized = true;
        } else {
            console.error("Error: ", err);
            return;
        }

        if (result && result.data && !angular.equals({}, result.data)) {

            $scope.data = result.data;
            $scope.id = result.id;
            if ($scope.data.content && $scope.data.content.carouselImages) {
                editor.loadItems($scope.data.content.carouselImages);
            }

            if ($scope.data._buildfire && $scope.data._buildfire.plugins && $scope.data._buildfire.plugins.result) {
                var pluginsData = folderPluginShared.getPluginDetails($scope.data._buildfire.plugins.result, $scope.data._buildfire.plugins.data);
                if ($scope.data.content && $scope.data.content.loadAllPlugins) {

                    plugins.loadAllItems();
                } else {
                    plugins.loadItems(pluginsData);
                }
            }

            if (!$scope.data._buildfire) {
                $scope.data._buildfire = {
                    plugins: {
                        dataType: "pluginInstance",
                        data: []
                    }
                };
            }

            if (!$scope.data.design) {
                $scope.data.design = {
                    backgroundImage: null,
                    selectedLayout: 1,
                    backgroundblur: 0
                };
            }

            if (tmrDelay) clearTimeout(tmrDelay);
        }

        /*
         * watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch('data', saveDataWithDelay, true);
        folderPluginShared.digest($scope);
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

        folderPluginShared.save(newObj);
    };

    /*
     * create an artificial delay so api isnt called on every character entered
     * */
    var saveDataWithDelay = function (newObj, oldObj) {
        if (tmrDelay) clearTimeout(tmrDelay);
        if (angular.equals(newObj, oldObj)) return;
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
    }

    // this method will be called when a new item added to the list
    editor.onAddItems = editor.onDeleteItem = editor.onItemChange = editor.onOrderChange = function () {
        $scope.data.content.carouselImages = editor.items;
        folderPluginShared.digest($scope);
    };

    plugins.onAddItems = function () {
        var scopeItems = $scope.data._buildfire.plugins.data;
        var itemIds = getPluginsIds(plugins.items);
        for (var i = 0; i < itemIds.length; i++) {
            if (scopeItems.indexOf(itemIds[i]) == -1) {
                scopeItems.push(itemIds[i]);
            }
        }

        folderPluginShared.digest($scope);
    };

    plugins.onDeleteItem = function (item, index) {
        if (plugins.items.length == 0) {
            $scope.data._buildfire.plugins.data = [];
        } else {
            $scope.data._buildfire.plugins.data.splice(index, 1);
        }

        folderPluginShared.digest($scope);
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

        folderPluginShared.digest($scope);
    };

    plugins.onLoadAll = function () {
        $scope.data.content.loadAllPlugins = true;
        $scope.data._buildfire = {
            "plugins": {
                "dataType": "pluginInstance",
                "data": []
            }
        };
        folderPluginShared.digest($scope);
    };

    plugins.onUnloadAll = function (items) {
        $scope.data.content.loadAllPlugins = false;
        folderPluginShared.digest($scope);
    };

    var digest = function () {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
        }
    };
}]);