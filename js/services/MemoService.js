// Define Service
myApp.factory('memoService', function($rootScope) {
	var memo = new MemoContainer();
	memo.fixtures();

	var currentView = ALL;
	var selectedIndex = 0;

	return {
		getCurrentView: function() {
			return currentView;
		},
		setCurrentView: function(newView) {
			currentView = newView;
		},
		getMemo: function() {
			return memo.raw;
		},
		getFilteredMemo: function() {
			return memo.filteredMemo();
		},
		addMemo: function(newItem) {
			memo.raw.push(newItem);
			this.addCategory(newItem.category);
		},
		removeMemo: function(index) {
			this.decreaseCategory(index);
			if (memo.raw[memo.filteredIndexes[index]].completed) {
				memo.completedCount--;
			}
			memo.raw.splice(memo.filteredIndexes[index], 1);
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
		countCategories: function() {
			return memo.countCategories;
		},
		countCompletedItems: function() {
			return memo.completedCount;
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
		setCompleted: function(index) {
			memo.raw[memo.filteredIndexes[index]].completed = true;
			memo.countCategories[memo.raw[memo.filteredIndexes[index]].category].completed ++;
			memo.completedCount++;
		},
		setCategory: function(newCategory) {
			memo.filter = newCategory.toLowerCase();
		},
		getCategory: function() {
			return memo.filter;
		},
		getCategoryList: function() {
			return memo.categoryList.filter(function(obj) {
				return memo.countCategories[obj];
			});
		},
		addCategory: function(newCategory) {
			if (newCategory != ' '){
				memo.categoryList.binaryInsert(newCategory);
			}
			if (newCategory in memo.countCategories) {
				memo.countCategories[newCategory].total ++;
			} else {
				memo.countCategories[newCategory] = {"total": 1, "completed": 0};
			}
		},
		decreaseCategory: function(index) {
			var category = memo.raw[memo.filteredIndexes[index]].category;
			memo.countCategories[category].total --;
			if (memo.raw[memo.filteredIndexes[index]].completed) {
				memo.countCategories[category].completed --;
			}
			if (memo.countCategories[category].total <= 0) {
				delete memo.countCategories[category];
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
			if (currentView == ALL || (currentView == FILTER && newItem.category === memo.filter)) { // Only if matchs the category
				memo.filteredIndexes.push(this.countRawMemo() - 1);
			}
		},
		refreshView: function() {
			memo.filteredIndexes.length = 0;
			if (currentView == ALL) { // No restrictions
				var limit = this.countRawMemo();
				for (var i = 0; i < limit; i++){
					memo.filteredIndexes[i] = i;
				}
			} else if (currentView == COMPLETED){
				var limit = this.countRawMemo();
				for (var i = 0; i < limit; i++){
					if(memo.raw[i].completed){
						memo.filteredIndexes.push(i);
					}
				}
			} else { // Apply category filter
				for (var index = 0; index < memo.raw.length; index++) {
					//for (var index in memo.raw){ // <-- This also access to the "binaryInsert" Array's method declared in model.js...
					if (memo.raw[index].category.toLowerCase() == memo.filter && !memo.raw[index].completed) {
						memo.filteredIndexes.push(index);
					}
				}
			}
		}
	};
});