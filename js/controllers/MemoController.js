// Define Module
var myApp = angular.module('myApp', ['onsen']);

// Define Service
myApp.factory('memoService', function($rootScope) {


	var memo = new MemoContainer();
	memo.fixtures();

	var selectedIndex = 0;

	return {

		getMemo: function() {
			return memo.raw;
		},
		getFilteredMemo: function() {
			return memo.filteredMemo();
		},
		addMemo: function(newItem) {
			memo.raw.push(newItem);
			this.addToView(newItem);
			this.addCategory(newItem.category);
		},
		removeMemo: function(index) {
			this.decreaseCategory(index);
			memo.raw.splice(memo.filteredIndexes[index], 1);
			this.removeFromView(index, 1);
		},
		clearMemo: function() {
			memo.raw.length = 0;
		},
		countRawMemo: function() {
			return memo.raw.length;
		},
		countFilteredMemo: function() {
			return memo.filteredIndexes.length;
		},
		getSelected: function() {
			return memo.raw[memo.filteredIndexes[selectedIndex]];
		},
		getSelectedIndex: function() {
			return selectedIndex;
		},
		setSelected: function(index) {
			selectedIndex = index;
		},
		modifySelected: function(newItem) {
			memo.raw[memo.filteredIndexes[selectedIndex]] = newItem;
		},
		setComplete: function(index) {
			memo.raw[memo.filteredIndexes[index]].category = '~';
		},
		setCategory: function(newCategory) {
			memo.filter = newCategory.toLowerCase();
			this.addToView();
		},
		getCategory: function() {
			return memo.filter;
		},
		getCategoryList: function() {
			return memo.categoryList.filter(function(obj) {
				return memo.categoryCount[obj];
			});
		},
		getCategoryCount: function() {
			return memo.categoryCount;
		},
		addCategory: function(newCategory) {
			if (newCategory != ' ' && newCategory.toLowerCase() != '*' && newCategory != '~') { // ' ' ---> No category
				memo.categoryList.binaryInsert(newCategory);
			}
			if (newCategory in memo.categoryCount) {
				memo.categoryCount[newCategory] ++;
			} else {
				memo.categoryCount[newCategory] = 1;
			}
		},
		decreaseCategory: function(index) {
			var category = memo.raw[memo.filteredIndexes[index]].category;
			memo.categoryCount[category] --;
			if (memo.categoryCount[category] <= 0) {
				delete memo.categoryCount[category];
				memo.categoryList.splice(memo.categoryList.indexOf(category), 1);
			}
		},
		removeFromView: function(index, itemsDeleted) {
			//Some dirty magic to adjust the rest of the indexes after the one that is removed
			Array.prototype.splice.apply(memo.filteredIndexes, [index, (memo.filteredIndexes.length - index)]
				.concat(((memo.filteredIndexes.slice(index + 1, memo.filteredIndexes.length))
					.map(function(index) {
						return index -= itemsDeleted;
					}))));
		},
		addToView: function(newItem) {
			if (typeof newItem !== 'undefined') { // Add just one new element to the view
				if (memo.filter == '*' || newItem.category === memo.filter) { // Only if matchs the category
					memo.filteredIndexes.push(this.countRawMemo() - 1);
				}
			} else {
				memo.filteredIndexes.length = 0;
				if (memo.filter == '*') { // No restrictions
					var limit = this.countRawMemo(),
						c = 0;
					while (c < limit) {
						memo.filteredIndexes[c] = c++;
					}
				} else { // Apply category filter
					for (var index = 0; index < memo.raw.length; index++) {
						//for (var index in memo.raw){ // <-- This also access to the "binaryInsert" Array's method declared in model.js...
						if (memo.raw[index].category.toLowerCase() == memo.filter) {
							memo.filteredIndexes.push(index);
						}
					}
				}
			}
		}
	};
});

//Define Controller1
myApp.controller('memoController', function($scope, memoService) {
	$scope.$watch(function() {
		return memoService.getFilteredMemo();
	}, function(newValue) {
		$scope.filteredMemo = newValue;
	}, true);

	$scope.$watch(function() {
		return memoService.getCategory();
	}, function(newValue) {
		if (newValue == '*') {
			$scope.category_label = 'All tasks';
		} else if (newValue == ' ') {
			$scope.category_label = 'Tasks without category';
		} else if (newValue == '~') {
			$scope.category_label = 'Completed tasks';
		} else
			$scope.category_label = 'Category: ' + newValue;
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
	};
	$scope.completeItem = function(index) {
		memoService.decreaseCategory(index);
		memoService.addCategory('~');
		memoService.setComplete(index);
		if (memoService.getCategory() != '*') {
			memoService.removeFromView(index, 0);
		}
	};
});

//Define Controller2
myApp.controller('categoryController', function($scope, memoService) {
	$scope.$watch(function() {
		return memoService.getCategoryList();
	}, function(newValue) {
		$scope.categoryList = newValue;
	}, true);

	$scope.$watch(function() {
		return memoService.getCategoryCount();
	}, function(newValue) {
		$scope.categoryCount = newValue;
	}, true);

	$scope.$watch(function() {
		return memoService.countRawMemo();
	}, function(newValue) {
		$scope.countAll = newValue;
	}, true);

	$scope.setCategory = function(newCategory) {
		memoService.setCategory(newCategory);
		slidingMenu.closeMenu();
	};

});

//Define Controller3
myApp.controller('addItemController', function($scope, memoService) {
	ons.createPopover('popover.html').then(function(popover) {
		$scope.popover = popover;
	});

	$scope.addItem = function() {
		if (typeof($scope.item_name) != 'undefined' && $scope.item_name !== '') {
			var category = $scope.item_category;
			if (typeof(category) == 'undefined' || category === '') {
				category = ' ';
			}
			category = category.replace(/\s{2,}/g, ' ');
			var newItem = new Item($scope.item_name, category, $scope.item_description);
			memoService.addMemo(newItem);
			$scope.ons.navigator.popPage();
		} else {
			$scope.popover.show('#input-name');
		}
	};
});

//Define Controller4
myApp.controller('detailsController', function($scope, memoService) {
	var selected = memoService.getSelected();
	$scope.item_name = selected.name;
	$scope.item_category = selected.category;
	$scope.item_description = selected.description;

	ons.createPopover('popover.html').then(function(popover) {
		$scope.popover = popover;
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
				if (memoService.getCategory() != '*') {
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