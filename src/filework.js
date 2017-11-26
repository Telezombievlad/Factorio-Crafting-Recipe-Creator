const recipes = require('../data/recipes.json');

let parse_ingredients = function(recipe, expensive) {
	let toReturn = [];

	let ingrs = [];	
	if (recipe.hasOwnProperty('ingredients')) ingrs = recipe.ingredients;
	else if (expensive) ingrs = recipe.expensive.ingredients;
	else ingrs = recipe.normal.ingredients;

	for (let i of ingrs) {
		if (i.hasOwnProperty('name')) { // Object form {}
			toReturn.push([i.name, i.amount]);
		}
		else toReturn.push(i); // Array form []
	}

	return toReturn;
}

let parse_result_count = function(recipe, expensive) {
	if (recipe.hasOwnProperty('result_count')) {
		return {result_count: recipe.result_count, additional_results: []};
	}
	
	if (recipe.hasOwnProperty('results')) {
		let parsed_results = parse_ingredients({ingredients: recipe.results});
		let result_count = 1;

		parsed_results = parsed_results.filter(function(elem) {
			if (elem[0] === recipe.name) {
				result_count = elem[1];
				return false;
			}
			else return true;
		});

		return {result_count: result_count, additional_results: parsed_results};
	}
	
	// Yep, some cases are ignored (for instance, kovarex-enrichment-process)
	return {result_count: 1, additional_results: []}; 
}

let transform_to_map = function(expensive) {
	let toReturn = new Map();

	for (let curKey in recipes) {
		let r = recipes[curKey];

		let parsed_res_count = parse_result_count(r, expensive);

		toReturn.set(r.name, {
			name: r.name,
			ingredients: parse_ingredients(r, expensive),
			result_count: parsed_res_count.result_count,
			additional_results: parsed_res_count.additional_results
		});
	}

	toReturn.forEach(function(value, key, map) {
		let newIngrs = [];

		for (let ingr of value.ingredients) {
			if (recipes.hasOwnProperty(ingr[0])) {
				newIngrs.push({ref: map.get(ingr[0]), count: ingr[1]});
			}
			else newIngrs.push({name: ingr[0], count: ingr[1]});
		}

		value.ingredients = newIngrs;
	});

	return toReturn;
}

export const recipes_expensive = transform_to_map(recipes);
export const recipes_normal = transform_to_map(recipes);