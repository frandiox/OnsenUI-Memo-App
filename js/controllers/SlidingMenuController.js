// Change slidingMenu behaviour
myApp.controller('slidingMenuController', function($scope){
	$scope.open = function(){
		$scope.slidingMenu.setSwipeable(true);
	};
	$scope.close = function(){
		$scope.slidingMenu.setSwipeable(false);
	};
	$scope.checkSlidingMenuStatus = function(){
		$scope.slidingMenu.on('postclose',$scope.close);
		$scope.slidingMenu.on('postopen',$scope.open);
	};
});