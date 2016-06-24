var myApp = angular.module('myApp', ['ngRoute']);

var appControllers=angular.module('appControllers',[]);

myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/home', {
        templateUrl: "/assets/views/routes/home.html",
        controller: "HomeController"
        }).
    when('/register', {
        templateUrl: "/assets/views/routes/register.html",
        controller: "RegisterController"
    }).
    when('/profile', {
        templateUrl: "/assets/views/routes/profile.html",
        controller: "ProfileController"
    }).
    when('/forgot', {
        templateUrl: "/assets/views/routes/forgot.html",
        controller: "ForgotController"
    }).
    when('/dbAdd', {
        templateUrl: "/assets/views/routes/dbAdd.html",
        controller: "AddController"
    }).
    when('/dbEdit', {
        templateUrl: "/assets/views/routes/dbEdit.html",
        controller: "EditController"
    }).
    otherwise({
        redirectTo: "/home"
    });
}]);