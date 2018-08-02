(function (angular) {
    "use strict";
    //created folderPluginContent module
    angular
        .module('folderPluginContent', ['ui.tinymce', 'folderPluginServices'])
        .provider('Buildfire', [function () {
            this.$get = function () {
                return buildfire;
            };
        }])
        .provider('Messaging', [function () {
            this.$get = function () {
                return buildfire.messaging;
            };
        }]);
})
(window.angular);