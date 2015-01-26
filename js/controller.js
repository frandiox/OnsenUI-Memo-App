// Define Module
var myApp = angular.module('myApp', ['onsen']);

// Define Service
myApp.factory('memoService', function($rootScope) {


	var memo = new TaskContainer();
	memo.fixtures();

	var selectedIndex = 0;

	return {

		getMemo: function() {
			return memo.raw;
		},
		getFilteredMemo: function() {
			return memo.filteredMemo();
		},
		addMemo: function(newTask) {
			this.reloadFilter(newTask);
			memo.raw.push(newTask);
			memo.count++;
			this.addCategory(newTask.category);
		},
		removeMemo: function(index) {
			var category = memo.raw[memo.filteredIndexes[index]].category;
			memo.categoryCount[category] --;
			if (memo.categoryCount[category] <= 0) {
				delete memo.categoryCount[category];
				memo.categoryList.splice(memo.categoryList.indexOf(category), 1);
			}
			memo.raw.splice(memo.filteredIndexes[index], 1);
			//Some dirty magic to adjust the rest of the indexes after the one that is removed
			Array.prototype.splice.apply(memo.filteredIndexes, [index,(memo.filteredIndexes.length - index)]
			.concat(((memo.filteredIndexes.slice(index+1,memo.filteredIndexes.length))
			.map(function(index){return --index;}))));
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
			return memo.raw[selectedIndex];
		},
		setSelected: function(index) {
			selectedIndex = memo.filteredIndexes[index];
			console.log(index + ' -> ' +selectedIndex);
		},
		modifySelected: function(newTask){
			console.log(newTask.title);
			console.log(selectedIndex);
			console.log(memo.raw[selectedIndex].title);
			memo.raw[selectedIndex] = newTask;
			console.log(memo.raw[selectedIndex].title);
			
		},
		setCategory: function(newCategory) {
			memo.filter = newCategory.toLowerCase();
			this.reloadFilter();
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
			if (newCategory != ' ') { // ' ' ---> No category
				memo.categoryList.binaryInsert(newCategory);
			}

			if (newCategory in memo.categoryCount) {
				memo.categoryCount[newCategory] ++;
			} else {
				memo.categoryCount[newCategory] = 1;
			}
		},
		reloadFilter: function(newTask) {
			if (typeof newTask !== 'undefined') { // Add just one new element to the view
				if (memo.filter == 'all' || newTask.category === memo.filter) { // Only if matchs the category
					memo.filteredIndexes.push(memo.count);
				}
			} else {
				memo.filteredIndexes.length = 0;
				if (memo.filter == 'all') { // No restrictions
					var limit = memo.count,
						c = 0;
					while (c < limit) {
						memo.filteredIndexes[c] = c++;
					}
				} else { // Apply category filter
					console.log(memo.raw.length);
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

/*filteredMemo.length = 0;
if(category.toLowerCase() == 'all'){ // No restrictions
	filteredMemo = memo.slice();
}else{ // Apply category filter
	for (var index in memo){
		if(memo[index].category.toLowerCase() == category.toLowerCase()){
			filteredMemo.push(memo[index]);
		}
	}
}*/


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
		$scope.category = newValue === ' ' ? "no category" : newValue;
	}, true);

	$scope.$watch(function() {
		return memoService.countFilteredMemo();
	}, function(newValue) {
		$scope.countFiltered = newValue;
	}, true);

	$scope.setSelected = function(index) {
		memoService.setSelected(index);
	};
	$scope.deleteTask = function(index) {
		console.log(index);
		memoService.removeMemo(index);
	};

});

//Define Controller1
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

//Define Controller2
myApp.controller('addTaskController', function($scope, memoService) {
	
	ons.createPopover('popover.html').then(function(popover) {
		$scope.popover = popover;
	});

	$scope.addTask = function() {

		if (typeof($scope.task_title) != 'undefined' && $scope.task_title != '') {
			var category = $scope.task_category;
			if (typeof(category) == 'undefined') {
				category = ' ';
			}
			category = category.replace(/\s{2,}/g, ' ');
			var newTask = new Task($scope.task_title, category, $scope.task_description);
			memoService.addMemo(newTask);
			$scope.ons.navigator.popPage();
		}else{
			$scope.popover.show('#input-title');
		}
	};


});

/*
//Define Controller3
myApp.controller('detailsController', function($scope, memoService) {
	var selected = memoService.getSelected();
	$scope.title = selected.title;
	$scope.category = selected.category;
	$scope.description = selected.description;

});*/

//Define Controller4
myApp.controller('detailsController', function($scope, memoService) {
	var selected = memoService.getSelected();
	$scope.task_title = selected.title;
	$scope.task_category = selected.category;
	$scope.task_description = selected.description;
	
	ons.createPopover('popover.html').then(function(popover) {
		$scope.popover = popover;
	});
	
	$scope.modifyTask = function() {
		
		if (typeof($scope.task_title) != 'undefined' && $scope.task_title != '') {
			var category = $scope.task_category;
			if (typeof(category) == 'undefined') {
				category = ' ';
			}
			category = category.replace(/\s{2,}/g, ' ');
			selected.title = $scope.task_title;
			selected.category = $scope.task_category;
			selected.description = $scope.task_description;
			$scope.ons.navigator.popPage();
		}else{
			$scope.popover.show('#task-title');
		}
	};
	$scope.storeChanges = function(newTitle, newDescription){
		$scope.newTitle = newTitle;
	};
	
});