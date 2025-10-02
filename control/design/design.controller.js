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
                    if (err || !result) {
                      console.error(err, 'Error while getting datastore.');
                      buildfire.dialog.toast({
                        message: "Error while loading data. Retrying again in 2 seconds...",
                        duration: 1999
                      });
                      setTimeout(function() {
                        location.reload();
                      }, 2000);
                      return;
                    }

                    $scope.datastoreInitialized = true;

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
                                showNotificationBadges: false,
                                hideIPhoneNotch: false,
                                blackIPhoneNotch: false,
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
                $scope.getVerticalAlignment = function(){
                    if($scope.data.design.textAlignVertical=='flex-start')
                        return "Top";
                    else if(!$scope.data.design.textAlignVertical || $scope.data.design.textAlignVertical=='center')
                        return "Center";
                    else return "Bottom";
                };
                $scope.setVerticalAlignment = function(aligment){
                    $scope.data.design.textAlignVertical=aligment;
                };
                $scope.getHorizontalAlignment = function(){
                    if($scope.data.design.textAlignHorizontal=='flex-start')
                        return "Top";
                    else if(!$scope.data.design.textAlignHorizontal || $scope.data.design.textAlignHorizontal=='center')
                        return "Center";
                    else return "Bottom";
                };
                $scope.setHorizontalAlignment = function(aligment){
                    $scope.data.design.textAlignHorizontal=aligment;
                };
                $scope.getFontSize = function(){
                    if($scope.data.design.textFontSize)
                        return $scope.data.design.textFontSize+"px";
                    else return "16px";
                };
                $scope.setFontSize = function(fontSize){
                    $scope.data.design.textFontSize=fontSize;
                };

                $scope.getIphoneNotch = function(){
                    if(!$scope.data.design.blackIPhoneNotch)
                        return "Transparent";
                    else return "Black";
                };
                $scope.setIphoneNotch = function(option){
                    $scope.data.design.blackIPhoneNotch=option;
                };

                $scope.getSecuredFeatures = function(){
                    return $scope.data.design.securedFeaturesOption;
                };
                $scope.setSecuredFeatures = function(option){
                    $scope.data.design.securedFeaturesOption=option;
                };

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
                
                $scope.getBackgroundIndicatorStyle = function() {
                    if ($scope.data.design.textColor && $scope.data.design.textColor.colorType) {
                        var colorType = $scope.data.design.textColor.colorType;
                        var bgCSS = $scope.data.design.textColor[colorType].backgroundCSS;
                        if (bgCSS) return bgCSS;
                    }
                    return "background: linear-gradient(to top left, #fff calc(50% - 2px), var(--c-danger), #fff calc(50% + 2px))";
                };
                
                $scope.openColorPicker = function() {
                    var preselectedBackgroundColor = $scope.data.design.textColor || {};
                    buildfire.colorLib.showDialog(
                      preselectedBackgroundColor,
                      {hideGradient: true},
                      function() {},
                      function(err, result) {
                          if(result && result.colorType) {
                              $scope.data.design.textColor = result;
                              if(!$scope.$$phase) $scope.$apply();
                          }
                      }
                    );
                };

                $scope.resetTextColor = function($event) {
                    $event.stopPropagation();
                    $scope.data.design.textColor = null;
                    if(!$scope.$$phase) $scope.$apply();
                    saveData($scope.data);
                };
                
                var digest = function () {
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };
            }]);
})(window.angular);