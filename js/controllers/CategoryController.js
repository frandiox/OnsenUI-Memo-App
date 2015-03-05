//Define Controller2
myApp.controller('categoryController', function($scope, $rootScope, memoService) {
	$scope.$watch(function() {
		return memoService.getCategoryList();
	}, function(newValue) {
		$scope.categoryList = newValue;
	}, true);

	$scope.$watch(function() {
		return memoService.countCategories();
	}, function(newValue) {
		$scope.countCategories = newValue;
	}, true);

	$scope.$watch(function() {
		return memoService.countCompletedItems();
	}, function(newValue) {
		$scope.completedCount = newValue;
	}, true);

	$scope.$watch(function() {
		return memoService.countRawMemo();
	}, function(newValue) {
		$scope.countAll = newValue;
	}, true);

	$scope.setViewRefresh = function(newView,newCategory) {
		$rootScope.$broadcast('restoreCarousel');

		if (typeof newCategory != 'undefined'){
			memoService.setCategory(newCategory);
		}
		memoService.setCurrentView(newView);
		memoService.refreshView();
	};
});