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
    $scope.pods = [];
    $scope.podVars = [];
    $scope.doctorList = [];
    $scope.playlistIDS = [];
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
    $scope.playlistIdAssign = function(nameList){
        var myID;
        console.log('doctorList', $scope.doctorList);
        console.log('nameList', nameList);
        for (var i = 0; i < nameList.length; i++){
            if ($scope.doctorList[i].name == nameList[i].name){
                myID = $scope.doctorList[i].id;
                break;
            }
        }
        console.log(myID);
        return myID;
        console.log('hey');
    };

    $scope.login  = function(){

        $http.get('/contentmanager/login')
            .then(function(response){
                var ourToken = {
                    token: response.data.apiToken
                };
                $scope.getPlaylists(ourToken);
            });
    };

    $scope.getPlaylists = function(ourToken){
        console.log(ourToken);
        $http.post('/contentmanager/playlists', ourToken)
            .then(function(response){
                console.log(response.data.list);
                angular.forEach(response.data.list, function(value,key){
                    console.log(value);
                    var i = 'doctorObj' + key;
                    $scope[i] = {
                        name : value.name,
                        id : value.id
                    }
                    $scope.doctorList.push($scope[i]);
                });
            });
    };

    $scope.getPlayers = function(ourToken){
        console.log(ourToken);
        $http.post('/contentmanager/players')
            .then(function(response){

            })
    };

    $scope.getPods = function(){
        $http.get('/db')
            .then(function(res){
                angular.forEach(res.data, function(value,key){
                    $scope.pods.push(value.name);
                    var podName = value.name;
                    $scope[podName] = {
                        pod: '',
                        id : value.channelId
                    };
                    $scope.podVars.push($scope[podName]);

                });

            });
    };

    $scope.setPlaylists = function(playlists){
        console.log('playlists being passed', playlists);

        $http.get('/contentmanager/login')
            .then(function(res) {
                var ourToken = {
                    token: res.data.apiToken
                };
                $http.post('/contentmanager/channels', ourToken)
                    .then(function (res) {
                        angular.forEach(res.data.list, function (value, key) {
                            console.log('channel id', value.id)
                            var playlistID = $scope.playlistIdAssign(playlists);

                            console.log('frame id', value.frameset.frames[0].id);
                            var timeSlot = {
                                channelID: value.id,
                                frameID: value.frameset.frames[0].id,
                                date: moment().format("YYYY-MM-DD"),
                                token: ourToken.token,
                                name: value.frameset.frames[0].name,
                                plylist : playlistID,
                                timeslotID: ''
                            };
                            $http.post('/contentmanager/timeslots', timeSlot)
                                .then(function (res) {
                                    if (angular.equals({}, res.data)) {
                                        $http.post('/contentmanager/scheduleSet', timeSlot)
                                            .then(function (res) {
                                                console.log('set schedule after no delete');
                                            });

                                    } else {
                                        console.log('delete that schedule');
                                        timeSlot.timeslotID = res.data.timeslots[0].id;
                                        $http.post('/contentmanager/scheduleRemove', timeSlot)
                                            .then(function (res) {
                                                console.log('deleted schedule', res.data);

                                                $http.post('/contentmanager/scheduleSet', timeSlot)
                                                    .then(function (res) {
                                                        console.log('set schedule after delete', res.data)
                                                    })

                                            })
                                    }
                                });
                        });
                    })
            })
        };

    $scope.getTimeslots = function(){
        $http.get('/contentmanager/login')
            .then(function(res) {
                console.log(res.data.apiToken);
                var ourToken = {
                    token: res.data.apiToken
                };
                $http.post('/contentmanager/timeslots', ourToken)
                    .then(function(res){
                        console.log(res.data);
                    })
            });


    };



    $scope.submitPlaylists = function(token, playlists){
        for (var i= 0; i<playlists.length; i++){
            var header = {
                loginToken : token,
                playlist : playlists[i].name
            };
            $http.post('contentmanager/channel', header)
                .then(function(res){
                    if (res.status == 200){console.log('cool')}
                    else{console.log('some has occured')};
                })

        }

    };







    //oninit
    $scope.validate();
    $scope.getPods();
    $scope.login();
    $scope.now = moment().format("YYYY-MM-DD");
    console.log($scope.now);



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
        location : "",
        channelId : ""
    };
    $scope.availableIds = [];
    $scope.usedIds = [];
    $scope.myArray = [22,23,24];

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

    $scope.loginCM = function(){

        $http.get('/contentmanager/login')
            .then(function(response){
                console.log(response.data);
                var ourToken = {
                    token: response.data.apiToken
                };
                console.log(ourToken.token);
                $scope.getChannels(ourToken);
            });

    }

    $scope.getChannels = function(token){

        $http.post('/contentmanager/channels', token)
            .then(function(res){
                if (res.status==200) {
                    $scope.availableIds = [];
                    console.log(res.data);
                    angular.forEach(res.data.list, function (value, key) {
                        var ourID = (value.id).toString();
                        console.log('ourId', ourID);
                        console.log('value.id', value.id);
                        if ($scope.usedIds.length > 0) {
                            if ($scope.usedIds.indexOf(ourID) === -1){
                                $scope.availableIds.push(ourID)
                            } else {
                                console.log('yoooo');
                            }
                        } else {
                            $scope.availableIds.push(value.id);
                        }

                    });
                } else {
                    console.log(res.status);
                }
            });

    };

    $scope.getPods= function(){
        $http.get('/db')
            .then(function(res) {
                if(res.status == 200) {
                    angular.forEach(res.data, function (value, key) {

                        $scope.usedIds.push(value.channelId);
                    });
                    console.log($scope.usedIds);
                    $scope.loginCM();
                } else {
                    console.log(res.status)
                }
            })
    };

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


    };


    //on-init
    $scope.validate();
    $scope.getPods();




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
        $scope.items = [];
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

myApp.factory('cmActions', ['$http', function($http){


    var login  = function(){

        $http.get('/contentmanager/login')
            .then(function(response){
                console.log(response.data);
                var ourToken = {
                    token: response.data.apiToken
                };
                console.log(ourToken.token);
                $scope.getPlaylists(ourToken);
            });
    };

    var getPlaylists = function(ourToken){
        console.log(ourToken);
        $http.post('/contentmanager/playlists', ourToken)
            .then(function(response){
                console.log(response.data.list);
                $scope.createLists(response.data.list);
            });
    };

    var getPlayers = function(ourToken){
        console.log(ourToken);
        $http.post('/contentmanager/players')
            .then(function(response){

            })
    };

    return {

        login : login,
        getPlaylists : getPlaylists

    }

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


