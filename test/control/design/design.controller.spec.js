/**
 * Created by zain on 13/01/16.
 */

describe('folderPlugin Content: design', function () {

    beforeEach(module('folderPluginDesign'));

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

        it('DataStore.save should exist and be a function', function () {
            expect(typeof buildfire.datastore.save).toEqual('function');
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

        it('it should pass if DataStore save service called', function () {
            spyOn(buildfire.datastore, 'save').and.callFake(function() {
                return {
                    then: function(callback) { return callback(result); }
                };
            });
        });
    });

    describe('Buildfire imageLib', function () {
        it('imageLib should exist and be an object', function () {
            expect(typeof buildfire.imageLib).toEqual('object');
        });

        it('imageLib.showDialog should exist and be a function', function () {
            expect(typeof buildfire.imageLib.showDialog).toEqual('function');
        });
    });

    describe('spy the service imgaeLib', function () {
        it('it should pass if imgaeLib showDialog service called', function () {
            spyOn(buildfire.imageLib, 'showDialog').and.callFake(function() {
                return {
                    then: function (callback) {
                        return callback(result);
                    }
                };
            });
        });
    });

    describe('folderPluginCtrl', function() {
        var $scope, designController;

        beforeEach(function() {
            $scope = {};
            designController = $controller('folderPluginCtrl', { $scope: $scope });
        });

        it('designController should be defined', function() {
            expect(designController).toBeDefined();
        });

        it('resizeImage should return background image thumbnail', function() {
            var thumbnail = $scope.resizeImage('https://www.google.com/images/srpr/logo11w.png');
            expect(thumbnail).toEqual('http://s7obnu.cloudimage.io/s/width/88/https://www.google.com/images/srpr/logo11w.png');
        });

        it('deleteBackground should remove background image ', function() {
            $scope.deleteBackground;
            expect($scope.data.design.backgroundImage).toBeNull();
        });
    });
});