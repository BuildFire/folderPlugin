(function (angular) {
    "use strict";

    angular
        .module('folderPluginDesign')
        .controller('folderPluginCtrl', ['$scope', 'Utility',
            function ($scope, Utility) {
                $scope.availableLayouts = Utility.getLayouts();
                $scope.data = Utility.getDefaultScopeData();
                $scope.datastoreInitialized = false;

                //Go pull any previously saved data
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
                                backgroundblur: 0,
                                hideText: false
                            };
                        }
                    }

                    /*
                     * watch for changes in data and trigger the saveData function on change
                     * */
                    $scope.$watch('data', saveData, true);
                    Utility.digest($scope);
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

                    if (newObj.default) {
                        newObj = Utility.getDefaultScopeBlankData();
                    }

                    if ($scope.frmMain.$invalid) {
                        console.warn('invalid data, details will not be saved');
                        return;
                    }

                    Utility.save(newObj);
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
                            Utility.digest($scope);
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
                    Utility.digest($scope);
                };

                $scope.changeLayout = function (layoutId) {
                    var newLayout = layoutId + 1;
                    if (newLayout != $scope.data.design.selectedLayout) {
                        $scope.data.design.selectedLayout = newLayout;
                        Utility.digest($scope);
                    }
                };

                var digest = function () {
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };
            }]);
})(window.angular);