var folderPluginShared = folderPluginShared || {};

folderPluginShared.getPluginDetails = function (pluginsInfo, pluginIds) {
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
};

folderPluginShared.getDefaultScopeData = function () {
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
                "iconUrl": "http://imageserver.prod.s3.amazonaws.com/1462345136293-07379761438351125/e5c4ac80-11c5-11e6-ad08-375cc71b6ca7.jpg",
                "title": "image"
            }, {
                "action": "noAction",
                "iconUrl": "http://imageserver.prod.s3.amazonaws.com/1462345136293-07379761438351125/e667f160-11c5-11e6-ad08-375cc71b6ca7.jpg",
                "title": "image"
            }, {
                "action": "noAction",
                "iconUrl": "http://imageserver.prod.s3.amazonaws.com/1462345136293-07379761438351125/e6f627a0-11c5-11e6-92ea-27ed66023d52.jpg",
                "title": "image"
            }],
            "text": "<p>Folder plugin allow user to add plugin inside and arrange them as per preference</p>",
            "loadAllPlugins": false
        },
        "design": {
            "backgroundImage": null,
            "selectedLayout": 1,
            "backgroundblur": 0
        }
    };
};

folderPluginShared.getEditorOptions = function () {
    return {
        plugins: 'advlist autolink link image lists charmap print preview',
        skin: 'lightgray',
        trusted: true,
        theme: 'modern'
    };
};

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

folderPluginShared.save = function (newObj) {
    buildfire.datastore.save(newObj, function (err, result) {
        if (err || !result) {
            console.error('Error saving the widget details: ', err);
        }
        else {
            console.info('Widget details saved');
        }
    });
};

folderPluginShared.digest = function ($scope) {
    if (!$scope.$$phase && !$scope.$root.$$phase) {
        $scope.$apply();
    }
};