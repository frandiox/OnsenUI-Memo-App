//Define Controller4
myApp.controller('detailsController', function($scope, memoService) {
	var selected = memoService.getSelected();
	$scope.item_name = selected.name;
	$scope.item_category = selected.category;
	$scope.item_description = selected.description;

	ons.createPopover('popover.html').then(function(popover) {
		$scope.popover = popover;
	});
	$scope.$on('$destroy',function(){
		$scope.popover.destroy();
	});

	$scope.modifyItem = function() {

		if (typeof($scope.item_name) != 'undefined' && $scope.item_name !== '') {
			selected.name = $scope.item_name;
			var category = $scope.item_category;
			if (typeof(category) == 'undefined' || category === '') {
				category = ' ';
			}
			category = category.replace(/\s{2,}/g, ' ');
			if (category != selected.category) {
				memoService.decreaseCategory(memoService.getSelectedIndex());
				memoService.addCategory(category);
				selected.category = category;
				if (memoService.getCurrentView() == FILTER) {
					memoService.removeFromView(memoService.getSelectedIndex(), 0);
				}
			}
			selected.description = $scope.item_description;
			$scope.ons.navigator.popPage();
		} else {
			$scope.popover.show('#item-name');
		}
	};
	$scope.storeChanges = function(newname, newDescription) {
		$scope.newname = newname;
	};
});