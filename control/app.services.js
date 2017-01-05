(function (angular, buildfire) {
    'use strict';

    angular
        .module('folderPluginServices', [])
        .service('Utility', function () {
            return {
                getPluginDetails: function (pluginsInfo, pluginIds) {
                    var returnPlugins = [];
                    var tempPlugin = null;
                    for (var id = 0; id < pluginIds.length; id++) {
                        for (var i = 0; i < pluginsInfo.length; i++) {
                            tempPlugin = {};
                            if (pluginIds[id] == pluginsInfo[i].data.instanceId) {
                                tempPlugin.instanceId = pluginsInfo[i].data.instanceId;
                                if (pluginsInfo[i].data) {
                                    tempPlugin.iconUrl = pluginsInfo[i].data.iconUrl;
                                    tempPlugin.iconClassName = pluginsInfo[i].data.iconClassName;
                                    tempPlugin.title = pluginsInfo[i].data.title;
                                    tempPlugin.pluginTypeId = pluginsInfo[i].data.pluginType.token;
                                    tempPlugin.folderName = pluginsInfo[i].data.pluginType.folderName;
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
                getDefaultScopeBlankData: function () {
                    return {
                        "_buildfire": {
                            "plugins": {
                                "dataType": "pluginInstance",
                                "data": []
                            }
                        },
                        "content": {
                            "carouselImages": [],
                            "text": "",
                            "loadAllPlugins": false
                        },
                        "design": {
                            "backgroundImage": null,
                            "selectedLayout": 1,
                            "backgroundblur": 0,
                            "hideText": false
                        }
                    };
                },

                getEditorOptions: function () {
                    return {
                        plugins: 'advlist autolink link image lists charmap print preview',
                        skin: 'lightgray',
                        trusted: true,
                        theme: 'modern'
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
                save: function (newObj) {
                    buildfire.datastore.save(newObj, function (err, result) {
                        if (err || !result) {
                            console.error('Error saving the widget details: ', err);
                        }
                        else {
                            console.info('Widget details saved');
                        }
                    });
                },
                digest: function ($scope) {
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            }
        });
})(window.angular, window.buildfire);