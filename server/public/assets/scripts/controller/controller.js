var myApp = angular.module('myApp');

myApp.controller('HomeController', ['$scope','getToken','$http', function($scope,getToken,$http) {

    //variables

    $scope.user = {
        userName : '',
        password : ''
    };
    $scope.incorrect = false;
    $scope.showMessage = false;
    console.log('init user', $scope.user);
    sessionStorage.clear();

    $scope.login = function(user){
        $http.post('/auth/login',user)
            .then(function(res){
                if (res.data.valid == true){

                    $scope.user = res.data;
                    console.log('after login',$scope.user);
                    getToken.storeToken($scope.user);
                    $scope.incorrect = false;
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
    $scope.user =getToken.user;
    $scope.incorrect = false;
    sessionStorage.clear();

    //$scope.register = getToken.register;

    $scope.register = function(user){
        $http.post('/auth/register', user)
            .then(function(res){
                if (res.data.valid == true) {
                    $scope.user = res.data;
                    console.log('response user',$scope.user);
                    getToken.storeToken($scope.user);
                    $scope.incorrect = false;
                } else {
                    $scope.incorrect = true;
                }
            })

    };
}]);
myApp.controller('ProfileController', ['$scope','getToken','$http', function($scope,getToken,$http) {


    //functions
    $scope.validate = getToken.validateToken;
    $scope.logout = getToken.logout;
    $scope.user = getToken.getUser();
    $scope.id = getToken.getUserId();
    console.log('session user', $scope.user);
    console.log('session id', $scope.id);
    //$scope.profile = {}

    $scope.profileEdit = function(user){
        console.log($scope.id);
        $http.put('/auth/edit/'+$scope.id, user)
            .then(function(res, err){
                if (err){
                    $scope.success = false;
                    console.log(res.data);
                }
                else {
                    getToken.storeToken(res.data);
                    $scope.success = true;

                }
            })

    };








    //oninit
    $scope.validate();
    ;


}]);
myApp.controller('ForgotController', ['$scope', 'getToken', '$http', function($scope,getToken,$http){

    $scope.incorrect= false;
    $scope.emailSent = false;
    $scope.forgot ={
        username: '',
        email: ''
    };

    $scope.reset = function(forgot){
        console.log(forgot);
        $http.post('/auth/forgot',forgot)
            .then(function(res,err){
                if (res.data.message = "sent"){
                    console.log(res.data.message);
                    $scope.emailSent= true;
                } else{
                    $scope.incorrect = true;
                }
            })

    }

}]);

myApp.controller('AddController', ['$scope','getToken','$http', function($scope,getToken,$http) {

    //variables

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
myApp.controller('EditController', ['$scope','getToken','$http', function($scope,getToken,$http) {

    //scope and vars
    $scope.items = [];
    $scope.validate = getToken.validateToken;
    $scope.profile = {};
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



myApp.factory('getToken', ['$http', function($http){
    var denied = false;
    var incorrect = false;
    var registered = false;
    var message = '';
    var currentUser = '';
    var user = {
    };

    var storeToken = function(response){
        console.log(response);
        if (response.valid == true){
            denied = false;
            console.log('token store', response);
            sessionStorage.setItem('sessionToken', response.token);
            sessionStorage.setItem('sessionExpires', response.expires);
            sessionStorage.setItem('sessionFirstname', response.firstname);
            sessionStorage.setItem('sessionLastname', response.lastname);
            sessionStorage.setItem('sessionUsername', response.user);
            sessionStorage.setItem('sessionUserID', response._id);
            window.location.href =  '#/profile';
            user = response;
        } else{
            window.location.href = '#/home';
            denied = true;
        }

    };

    var validateToken = function(){
        var tokenCheck = sessionStorage.getItem('sessionToken');
        var expireCheck = sessionStorage.getItem('sessionExpires');
        if (expireCheck > moment().valueOf()){
            console.log('were ok')
            var newExpires = moment().add(10,'m').valueOf();
            sessionStorage.setItem('sessionExpires', newExpires);
        } else{
            sessionStorage.clear();
            window.location.href = '#/home';
            denied = true;

        }

    };



    var getUser = function(){
        user = {
            firstname: sessionStorage.getItem('sessionFirstname'),
            lastname: sessionStorage.getItem('sessionLastname'),
            username: sessionStorage.getItem('sessionUsername'),
            password: ''
        };

        return user;
    };

    var getUserId = function(){
        var id = sessionStorage.getItem('sessionUserID');
        return id

    }

    var logout = function(){
        $http.get('/auth/logout')
            .then(function(res){
                console.log(res.data.message);
                message = res.data.message;
                window.location.href='/#home';
                sessionStorage.clear();
            })
    };

    return {
        logout : logout,
        storeToken : storeToken,
        getUser : getUser,
        validateToken : validateToken,
        getUserId: getUserId,
        user: user,
        message : message,
        denied : denied,
        incorrect : incorrect,
        registered : registered
    };

}]);


