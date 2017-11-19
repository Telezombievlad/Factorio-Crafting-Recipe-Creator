import React from 'react';
import ReactDOM from 'react-dom';

import {recipeData} from './data';

//----------------------------------------------------
// Loading icons
//----------------------------------------------------

// let loadIcon(name) {
	
// }

//----------------------------------------------------
// Resource search and tree traversal
//----------------------------------------------------

let findPrimitiveIngredients = function(name, count) {
	let curRecipe = findRecipe(name);

	// Recursively getting to simplest ingredients
	if (curRecipe.ingredients.length != 0) {
		let toProduce = Math.ceil(count / curRecipe.resultCount);
		let ingrs = [];

		for (let curIngr of curRecipe.ingredients) {
			let curIngrSimpleRecipe = findPrimitiveIngredients(curIngr.name, curIngr.count * toProduce);

			// Applying optimized multiplier
			for (let curIngrSimpleIngr of curIngrSimpleRecipe.ingredients) ingrs.push(curIngrSimpleIngr);
		}

		return {ingredients: simplifyIngredients(ingrs), resultCount: curRecipe.resultCount * toProduce};
	}

	return {ingredients: [{name: name, count: count}], resultCount: count};
}

let findRecipe = function(name) {
	for (let recipe of recipeData) {
		if (recipe.name == name) {
			return recipe;
		}
	}

	return {name: name, ingredients: [], resultCount: 1};
}

let simplifyIngredients = function(ingrs) {
	let toReturn = [];

	for (let ingr of ingrs) {
		let foundName = false;

		for (let simpifiedIngr of toReturn) {
			if (simpifiedIngr.name == ingr.name) {
				simpifiedIngr.count += ingr.count;
				foundName = true;
				break;
			}
		}

		if (foundName == false) {
			toReturn.push(ingr);
		}
	}

	return toReturn;
}

//----------------------------------------------------
// React components
//----------------------------------------------------

let ResourceListItem = function(props) {
	return <div>
		<span> x{props.count.toString()} - {props.name} </span>
	</div>;
} 

//----------------------------------------------------
// Application class
//----------------------------------------------------

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "iron-axe",
			count: 1,
			ingredients: [],
			resultCount: 1
		};

		this.handleInputSubmit = this.handleInputSubmit.bind(this);
	}

	handleInputSubmit() {
		let recipe = findPrimitiveIngredients(this.state.name, this.state.count);

		this.setState({ingredients: recipe.ingredients, resultCount: recipe.resultCount});
	}

	render() {
		let listElements = [];

		for (let ingr of this.state.ingredients) {
			listElements.push(<ResourceListItem name={ingr.name} count={ingr.count} key={ingr.name}/>);
		}

		return <div>
				<span>
					<input
						onChange={(e) => this.setState({name: e.target.value})}
						value={this.state.name}
					/>
					<input
						onChange={(e) => this.setState({count: e.target.value})}
						value={this.state.count.toString()}
					/>
					<button onClick={this.handleInputSubmit}> Get recipe! </button>
				</span>
				<div> Ingredients: </div>
				<ul> {listElements} </ul>
				<span> Use ^ to craft {this.state.resultCount.toString()} </span>
			</div>;
	}
}

ReactDOM.render(<App/>, document.getElementById('root'));