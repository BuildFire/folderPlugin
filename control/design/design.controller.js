/**
 * Created by zain on 13/01/16.
 */

var folderPluginApp = angular.module('folderPluginDesign', []);

folderPluginApp.controller('folderPluginCtrl', ['$scope', function ($scope) {

    $scope.availableLayouts = folderPluginShared.getLayouts();

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
        }

        /*
         * watch for changes in data and trigger the saveData function on change
         * */
        $scope.$watch('data', saveData, true);
        folderPluginShared.digest($scope);
    });

    /*
     * Call the datastore to save the data object
     * */
    var saveData = function (newObj, oldObj) {
        if (!$scope.datastoreInitialized) {
            console.error("Error with datastore didn't get called");
            return;
        }

        if (newObj == undefined) return;
        if (angular.equals(newObj, oldObj)) return;

        if ($scope.frmMain.$invalid) {
            console.warn('invalid data, details will not be saved');
            return;
        }

        folderPluginShared.save(newObj);
    };

    /*
     * Open a dailog to change the background image
     * */
    $scope.changeBackground = function () {
        buildfire.imageLib.showDialog({ showIcons: false, multiSelection: false }, function (error, result) {
            if (result && result.selectedFiles && result.selectedFiles.length > 0) {
                if (!$scope.data.design) {
                    $scope.data.design = {};
                }
                $scope.data.design.backgroundImage = result.selectedFiles[0];
                folderPluginShared.digest($scope);
            }
        });
    };

    /*
     * Get background image thumbnail
     * */
    $scope.resizeImage = function (url) {
        if (!url) {
            return "";
        }
        else {
            return buildfire.imageLib.resizeImage(url, { width: 88 });
        }
    };

    /*
     * Delete the background and back to the default white background
     * */
    $scope.deleteBackground = function () {
        $scope.data.design.backgroundImage = "";
        folderPluginShared.digest($scope);
    };

    $scope.changeLayout = function (layoutId) {
        var newLayout = layoutId + 1;
        if (newLayout != $scope.data.design.selectedLayout) {
            $scope.data.design.selectedLayout = newLayout;
            folderPluginShared.digest($scope);
        }
    };

    var digest = function () {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
        }
    };
}]);