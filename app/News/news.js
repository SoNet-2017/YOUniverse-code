/**
 * Created by edoardovr on 10/07/17.
 */

angular.module("myApp.News", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/news', {
            templateUrl: 'News/news.html',
            controller: 'NewsCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]

            }
        })

    }])

    .controller("NewsCtrl", ['$scope', 'Users','UserList', 'currentAuth', '$firebaseAuth', '$rootScope', 'UniversesList', 'UsersChatService','$firebaseStorage', 'PostList', '$firebaseObject', function($scope, Users,UserList, currentAuth, $firebaseAuth, $rootScope, UniversesList, UsersChatService,$firebaseStorage, PostList) {

        $scope.tuttiIpost=PostList.getPosts();


        //recupero storia più votata
        $scope.Universes = UniversesList.getListOfUniverses();

        $scope.Universes.$loaded().then(function()
        {
            for (var i=0; i<$scope.Universes.length; i++)
            {
                $scope.storie=UniversesList.getStories($scope.Universes[i].$id);
                richiamo($scope.storie);
            }

        });

        function richiamo(lista)
        {
            lista.$loaded().then(function()
            {
                for (var i=0; i<lista.length; i++)
                {
                    $rootScope.availableStories = [].concat($rootScope.availableStories ,lista[i]);
                }
            }).then(function(){
                //$scope.storiaMostVotata.voti=0;
                for(var i=1; i<$rootScope.availableStories.length; i++) {
                    if (i > 1) {
                        if ($rootScope.availableStories[i].voti > $scope.storiaMostVotata.voti) {
                            $scope.storiaMostVotata = $rootScope.availableStories[i];
                        }
                    }
                    else {
                        $scope.storiaMostVotata = $rootScope.availableStories[i];
                    }
                }
            });

        }



        $scope.getUser=function (userId, postId) {
            var userName=UsersChatService.getUserInfo(userId);
            userName.$loaded().then(function(){
                PostList.setImage(postId,userName.profilo);
                PostList.setName(postId,userName.name);
            });
        };

        $scope.altri= function(value){
            $rootScope.other=value;
            $rootScope.ricercaEffettuata=true;
            $rootScope.currentPosition= 1;
        };

        $scope.storiaDaLeggere = function(c,b) {
            $rootScope.S=b;
            $rootScope.T=c;
        };


    }]);
