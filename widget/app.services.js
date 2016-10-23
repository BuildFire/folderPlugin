(function (angular, buildfire) {
    'use strict';

    angular
        .module('folderPluginWidget')
        .provider('Buildfire', [function () {
            this.$get = function () {
                return buildfire;
            };
        }])
        .provider('Messaging', [function () {
            this.$get = function () {
                return buildfire.messaging;
            };
        }])
        .service('Utility', function () {
            return {
                getPluginDetails: function (pluginsInfo, pluginIds) {
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
                                    if (obj.pluginType) {
                                        tempPlugin.pluginTypeId = obj.pluginType.token;
                                        tempPlugin.folderName = obj.pluginType.folderName;
                                    }
                                    else {
                                        tempPlugin.pluginTypeId = obj.pluginTypeId;
                                        tempPlugin.folderName = obj.folderName;
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
                },
                getDefaultScopeData: function () {
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
                            "hideText": false
                        },
                        "default": true
                    };
                },
                getLayouts: function () {
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
                },
                digest: function ($scope) {
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            }
        });
})(window.angular, window.buildfire);