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
    when('/dbAdd', {
        templateUrl: "/assets/views/routes/dbAdd.html",
        controller: "dbAdd"
    }).
    when('/dbEdit', {
        templateUrl: "/assets/views/routes/dbEdit.html",
        controller: "dbEdit"
    }).
    otherwise({
        redirectTo: "/home"
    });
}]);