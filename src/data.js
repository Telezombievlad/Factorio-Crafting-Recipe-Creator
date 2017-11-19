export let recipeData = [
	{
		name: 'wood',
		ingredients: [{name: "raw-wood", count: 1}],
		resultCount: 1
	},
	{
		name: "wooden-chest",
		ingredients: [{name: "wood", count: 4}],
		resultCount: 1
  	},
  	{
		name: "iron-stick",
		ingredients: [{name: "iron-plate", count: 1}],
		resultCount: 2
  	},
  	{
  		name: "iron-axe",
  		ingredients: [{name: "iron-stick", count: 2}, {name: "iron-plate", count: 3}],
  		resultCount: 1
  	}
];