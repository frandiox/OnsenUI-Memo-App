// Item object definition

var Item = function(name, category, description) {
	this.name = name;
	this.category = category;
	this.description = description;
	this.completed = false;
	this.date = new Date();
};

var MemoContainer = function() {
	this.raw = [];
	this.completedCount = 0;
	this.filteredIndexes = [];
	this.filter = "*";
	this.categoryList = [];
	this.countCategories = {};
	this.filteredMemo = function() {
		return this.filteredIndexes.map(function(index) {
			return this.raw[index];
		}, this);
	};
	this.fixtures = function() {
		this.raw = [new Item("Buy bananas", "shopping", ""), new Item("Call mother", "calls", ""), new Item("Buy apples", "shopping", ""), new Item("Study Japanese", "homework", "")];
		this.filteredIndexes = [0, 1, 2, 3];
		this.filter = "*";
		this.categoryList = "calls homework shopping".split(' ');
		this.countCategories = {
			"calls": {"total":1,"completed":0},
			"homework": {"total":1,"completed":0},
			"shopping": {"total":2,"completed":0},
		};
	};
};

Array.prototype.binaryInsert = function(value) {
	var startIndex = 0,
		stopIndex = this.length - 1,
		middle = Math.floor((stopIndex + startIndex) / 2);

	while (this[middle] != value && startIndex < stopIndex) {
		// adjust search area
		if (value < this[middle]) {
			stopIndex = middle - 1;
		} else if (value > this[middle]) {
			startIndex = middle + 1;
		}

		// recalculate middle
		middle = Math.floor((stopIndex + startIndex) / 2);
	}

	if (this[middle] !== value) {
		if (this[middle] > value) {
			this.splice(middle, 0, value);
		} else {
			this.splice(middle + 1, 0, value);
		}

	}
};