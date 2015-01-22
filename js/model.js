// Task object definition

var Task = function(title, category, description) {
	this.title = title;
	this.category = category;
	this.description = description;
	this.date = new Date();
};

var TaskContainer = function() {
	this.count = 0;
	this.raw = [];
	this.filteredIndexes = [];
	this.filter = "all";
	this.categoryList = [];
	this.categoryCount = {};
	/*this.categoryList = function(){
		return Object.keys(this.categoryCount);
	};*/
	this.filteredMemo = function() {
		if (this.filter === "all") {
			return this.raw.slice();
		} else {
			return this.filteredIndexes.map(function(index) {
				return this.raw[index];
			}, this);
		}
	};
	this.fixtures = function() {
		this.count = 4;
		this.raw = [new Task("Buy bananas", "shopping", ""), new Task("Call mother", "calls", ""), new Task("Buy apples", "shopping", ""), new Task("Study Japanese", "homework", "")];
		this.filteredIndexes = [0, 2];
		this.filter = "shopping";
		this.categoryList = "calls homework shopping".split(' ');
		this.categoryCount = {
			"calls": 1,
			"homework": 1,
			"shopping": 2
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