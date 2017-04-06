(function (angular, buildfire) {
    "use strict";
    angular
        .module('folderPluginWidget')

    .directive("loadImage", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

                attrs.$observe('finalSrc', function () {
                    var _img = attrs.finalSrc;

                    if (attrs.cropType == 'resize') {
                        buildfire.imageLib.local.resizeImage(_img, {
                            width: attrs.cropWidth,
                            height: attrs.cropHeight
                        }, function (err, imgUrl) {
                            _img = imgUrl;
                            replaceImg(_img);
                        });
                    } else {
                        buildfire.imageLib.local.cropImage(_img, {
                            width: attrs.cropWidth,
                            height: attrs.cropHeight
                        }, function (err, imgUrl) {
                            _img = imgUrl;
                            replaceImg(_img);
                        });
                    }
                });

                function replaceImg(finalSrc) {
                    var elem = $("<img>");
                    elem[0].onload = function () {
                        element.attr("src", finalSrc);
                        elem.remove();
                    };
                    elem.attr("src", finalSrc);
                }
            }
        };
    })

    .directive('backImg', ["$rootScope", function ($rootScope) {
        return function (scope, element, attrs) {
            attrs.$observe('backImg', function (value) {
                var img = '';
                if (value) {
                    buildfire.imageLib.local.cropImage(value, {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }, function (err, imgUrl) {
                        if (imgUrl) {
                            img = imgUrl;
                            element.attr("style", 'background:url(' + img + ') !important ; background-size: cover !important;');
                        } else {
                            img = '';
                            element.attr("style", 'background-color:white');
                        }
                        element.css({
                            'background-size': 'cover !important'
                        });
                    });
                }
                else {
                    img = "";
                    element.attr("style", 'background-color:white');
                    element.css({
                        'background-size': 'cover !important'
                    });
                }
            });
        };
    }])

    .directive('imgPreload', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            scope: {
                ngSrc: '@'
            },
            link: function (scope, element, attrs) {
                element.on('load', function () {
                    element.addClass('in');
                }).on('error', function () {
                    //
                });

                scope.$watch('ngSrc', function (newVal) {
                    element.removeClass('in');
                });
            }
        };
    }])

    .directive('emitLastRepeaterElement', function () {
        return function (scope) {
            if (scope.$last) {
                scope.$emit('LastRepeaterElement');
            }
        };
    })

    .directive('imageCarousel', function ($timeout) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem, attrs) {
                scope.carousel = null;
                scope.timeout = null;
                function initCarousel() {
                    if (scope.timeout) {
                        $timeout.cancel(scope.timeout);
                    }
                    if (scope.carousel) {
                        scope.carousel.trigger("destroy.owl.carousel");
                        $(elem).find(".owl-stage-outer").remove();
                    }
                    scope.carousel = null;
                    scope.timeout = $timeout(function () {
                        var obj = {
                            loop: false,
                            nav: false,
                            items: 1
                        };
                        scope.carousel = $(elem).owlCarousel(obj);
                    }, 100);
                }

                initCarousel();
                attrs.$observe("imageCarousel", function (newVal, oldVal) {
                    if (newVal) {
                        if (scope.carousel) {
                            initCarousel();
                        }
                    }
                });
            }
        }
    });
})(window.angular, window.buildfire);