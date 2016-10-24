/**
 * Created by zain on 05/01/16.
 */

describe('folderPlugin Content: controller', function () {

    beforeEach(module('folderPluginContent'));

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('Buildfire service', function () {

        it('Buildfire should exists', function () {
            expect(buildfire).toBeDefined();
        });
    });

    describe('Buildfire DataStore', function () {

        it('DataStore should exist and be an object', function () {
            expect(typeof buildfire.datastore).toEqual('object');
        });
        it('DataStore.getWithDynamicData should exist and be a function', function () {
            expect(typeof buildfire.datastore.getWithDynamicData).toEqual('function');
        });

    });

    describe('spy the service DataStore', function () {
        it('it should pass if DataStore getWithDynamicData service called', function () {
            spyOn(buildfire.datastore, 'getWithDynamicData').and.callFake(function() {
                return {
                    then: function(callback) { return callback(result); }
                };
            });
        });
    });

    describe('folderPluginCtrl', function() {
        var $scope, contentController;
        beforeEach(function() {
            var fixture = '<div id="carousel"></div><div id="plugins"></div>';
            document.body.insertAdjacentHTML('afterbegin', fixture);
            $scope = {
                $on:function(){

                }
            };
            contentController = $controller('folderPluginCtrl', { $scope: $scope });
        });

        it('contentController should be defined', function() {
            expect(contentController).toBeDefined();
        });
    });
});