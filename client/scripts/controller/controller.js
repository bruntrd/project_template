var myApp = angular.module('myApp');

myApp.controller('HomeController', ['$scope','getToken','$http', function($scope,getToken,$http) {

    //variables

    $scope.user = {
        username: '',
        password: ''
    };
    $scope.incorrect = false;
    $scope.showMessage = false;
    //$scope.message = getToken.message;
    //$scope.login = getToken.login;

    //$scope.$watch(
    //    function(){ return getToken.incorrect},
    //
    //    function(newVal){
    //        console.log(newVal);
    //        $scope.incorrect = newVal;
    //    }
    //)
    $scope.login = function(user){
        console.log(user);
        $http.post('/auth/login',user)
            .then(function(res){
                if (res.data.valid == true){
                    console.log('here')
                    var responseObject = res.data;
                    getToken.storeToken(responseObject);
                    $scope.incorrect = false;
                    //loggedIn = true;
                } else {
                    //console.log(incorrect);
                    $scope.incorrect = true;
                    $scope.message = res.data.message;
                    //console.log(incorrect);
                }

            })
    };






}]);
myApp.controller('RegisterController', ['$scope','getToken','$http', function($scope,getToken,$http) {
    $scope.user = {
        userName: '',
        password: ''
    };
    $scope.incorrect = false;
    //$scope.register = getToken.register;

    $scope.register = function(user){
        $http.post('/auth/register', user)
            .then(function(res){
                if (res.data.valid == true) {
                    var responseObject = res.data;
                    getToken.storeToken(responseObject);
                    $scope.incorrec = false;
                } else {
                    $scope.incorrect = true;
                }
            })

    };
}]);
myApp.controller('ProfileController', ['$scope','getToken', function($scope,getToken) {


    //functions
    $scope.validate = getToken.validateToken;

    $scope.logout = getToken.logout;



    //oninit
    $scope.validate()



}]);
myApp.controller('dbAdd', ['$scope','getToken','$http', function($scope,getToken,$http) {

    //variables and scope

    $scope.validate = getToken.validateToken;
    $scope.addField = false;
    $scope.showCancel = false;
    $scope.tryAgain = false;
    $scope.item = {
        name : "",
        desc : ""
    };

    var emptyItem = angular.copy($scope.item);


    //db routes
    $scope.createItem = function(whatevs){
        console.log(whatevs);
        $http.post('/db', whatevs)
            .then(function(response){
                if (response.status = 200) {
                    $scope.addField = false;
                    $scope.showCancel = false;
                    $scope.reset();
                } else {
                    $scope.tryAgain = true;
                }
            })
    };

    //functions

    $scope.logout = getToken.logout;

    $scope.showField = function(){
        $scope.addField = true;
        $scope.showCancel = true;

    };
    $scope.hideField = function(){
        $scope.showCancel = false;
        $scope.addField = false;

    };
    $scope.reset = function(){
        $scope.item = emptyItem;
        $scope.addItem.$setPristine();
        $scope.itemAdded = true;
        setTimeout(function(){
            $scope.itemAdded = false;
            $scope.$apply();
        },5000)


    }


    //on-init
    $scope.validate()




}]);
myApp.controller('dbEdit', ['$scope','getToken','$http', function($scope,getToken,$http) {

    //scope and vars
    $scope.items = [];
    $scope.validate = getToken.validateToken;
    $scope.item = {
        name: '',
        desc: '',
        id: ''
    };
    $scope.editing =false

    //functions
    $scope.getItems= function(){
        $scope.items = []
        $http.get('/db')
            .then(function(res) {
                angular.forEach(res.data, function (value, key) {
                    $scope.items.push(value);
                })
            })
    };

    $scope.logout = getToken.logout;

    $scope.edit = function(index){
        console.log($scope.items[index])
        console.log(index)
        $scope.item.name = $scope.items[index].name;
        $scope.item.desc = $scope.items[index].desc;
        $scope.item.id = $scope.items[index]._id;
    };

    $scope.editItem = function(item){
        console.log(item)

        $http.put('/db', item)
            .then(function(res){

                $scope.getItems()
            })

    };

    $scope.delete = function(index){
        var item = $scope.items[index];
        if (confirm('Are you would like to delete?')){
            $http.delete('/db/'+item._id)
                .then(function(res){
                    $scope.getItems();
                })
        }
    };

    $scope.editFields = function(item){
        var el = $(item.target).parent().parent();
        el.append('<p>Hey</p>')

        //myEl.append('<editFields><editFields');
    }

    //oninit
    $scope.validate();
    $scope.getItems();



}]);



myApp.service('getToken', ['$http', function($http){
    var denied = false;
    var incorrect = false;
    var registered = false;
    var message = '';

    var storeToken = function(response){
        console.log(response);
        if (response.valid == true){
            denied = false;
            sessionStorage.setItem('sessionToken', response.token);
            sessionStorage.setItem('sessionExpires', response.expires);
            window.location.href =  '#/profile';
        } else{
            window.location.href = '#/home';
            denied = true;
        }

    };

    var validateToken = function(){
        var tokenCheck = sessionStorage.getItem('sessionToke');
        var expireCheck = sessionStorage.getItem('sessionExpires');
        console.log(moment().valueOf())
        if (expireCheck > moment().valueOf()){
            console.log('were ok')
        } else{
            console.log('were not ok');
            window.location.href = '#/home';
            denied = true;
        }

    };





    var logout = function(){
        $http.get('/auth/logout')
            .then(function(res){
                console.log(res.data.message);
                message = res.data.message;
                window.location.href='/#home';
                sessionStorage.clear();
            })
    }

    return {
        //login : login,
        logout : logout,
        //register : register,
        storeToken : storeToken,
        validateToken : validateToken,
        message : message,
        denied : denied,
        incorrect : incorrect,
        registered : registered
    };

}]);


