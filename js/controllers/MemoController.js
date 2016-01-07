//Define Controller1
myApp.controller('memoController', function($scope, memoService) {
	$scope.$watch(function() {
		return memoService.getFilteredMemo();
	}, function(newValue) {
		$scope.filteredMemo = newValue;
	}, true);

	$scope.$watch(function() {
		return {
			view : memoService.getCurrentView(),
			category : memoService.getCategory()
		};
	}, function(newValue) {
		if (newValue.view == ALL) {
			$scope.category_label = 'All tasks';
		} else if (newValue.view == COMPLETED) {
			$scope.category_label = 'Completed tasks';
		} else {
			if (newValue.category == ' ') {
				$scope.category_label = 'Tasks without category';
			} else {
				$scope.category_label = 'Category: ' + newValue.category;
			}
		}
	}, true);

	$scope.$watch(function() {
		return memoService.countFilteredMemo();
	}, function(newValue) {
		$scope.countFiltered = newValue;
	}, true);

	$scope.setSelected = function(index) {
		memoService.setSelected(index);
	};
	$scope.deleteItem = function(index) {
		memoService.removeMemo(index);
		memoService.removeFromView(index, 1);
	};
	$scope.completeItem = function(index) {
		memoService.setCompleted(index);
		if (memoService.getCurrentView() == FILTER) {
			memoService.removeFromView(index, 0);
		}
	};

	// Fixes some distance bug in Carousel when changing view
	$scope.$on('restoreCarousel',function(){
		var itemNumber = memoService.countFilteredMemo();
		for (var i = 0; i <  itemNumber; i++){
			carousel['id'+i].setActiveCarouselItemIndex(1);
		}
	});
});
