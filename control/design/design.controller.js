(function (angular) {
    "use strict";

    angular
        .module('folderPluginDesign')
        .controller('folderPluginCtrl', ['$scope', 'Utility',
            function ($scope, Utility) {
                $scope.availableLayouts = Utility.getLayouts();
                $scope.enterpriseApp = false;
                $scope.data = Utility.getDefaultScopeData();
                $scope.datastoreInitialized = false;
                buildfire.getContext(function(error,result){
                    if(error)
                        console.error(error);
                    else {
                        if (result && result.configType && result.configType == "enterprise")
                            $scope.enterpriseApp = true;
                    }
                });
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
                                hideText: false,
                                securedFeaturesOption:"Enable",
                                showNotificationBadges: false
                            };
                        }
                        if(typeof $scope.data.design.showBlackOverlay !== 'boolean') {
                            $scope.data.design.showBlackOverlay = true;
                        }
                        if(typeof $scope.data.design.showLineSeparator !== 'boolean') {
                            $scope.data.design.showLineSeparator = true;
                        }
                        if (!$scope.data.design.securedFeaturesOption){
                            $scope.data.design.securedFeaturesOption = "Enable";
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
                $scope.changeBackground = function (bgType) {
                    buildfire.imageLib.showDialog({ showIcons: false, multiSelection: false }, function (error, result) {
                        if (result && result.selectedFiles && result.selectedFiles.length > 0) {
                            if (!$scope.data.design) {
                                $scope.data.design = {};
                            }

                            if(bgType == 'small'){

                                $scope.data.design.backgroundImage = result.selectedFiles[0];
                            }
                            else if(bgType == 'large'){

                                $scope.data.design.lgBackgroundImage = result.selectedFiles[0];
                            }
                            Utility.digest($scope);
                        }
                    });
                };

                /*
                 * Get background image thumbnail
                 * */
                $scope.resizeImage = function (url,width,height) {
                    if (!url) {
                        return "";
                    }
                    else {
                        return buildfire.imageLib.resizeImage(url, { width: width || 88, height : height });
                    }
                };

                $scope.cropImage = function (url,width,height) {
                    if (!url) {
                        return "";
                    }
                    else {
                        return buildfire.imageLib.cropImage(url, { width: width || 88, height : height, disablePixelRatio : true });
                    }
                };

                /*
                 * Delete the background and back to the default white background
                 * */
                $scope.deleteBackground = function (bgType) {
                    if(bgType == 'small'){
                        $scope.data.design.backgroundImage = "";
                    }
                    else if(bgType == 'large'){
                        $scope.data.design.lgBackgroundImage = "";
                    }

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