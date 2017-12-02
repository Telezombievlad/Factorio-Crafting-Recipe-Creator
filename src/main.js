import React from 'react';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import {recipes_expensive, recipes_normal} from './filework.js';

//----------------------------------------------------
// Loading icons
//----------------------------------------------------

//----------------------------------------------------
// Resource search and tree traversal
//----------------------------------------------------

let simplify = function(ingredients) {
	let toReturn = new Map();

	for (let i of ingredients) {
		let value = toReturn.get(i.name);

		if (typeof(value) !== 'undefined') {
			toReturn.set(i.name, value + i.count);
		}
		else toReturn.set(i.name, i.count);
	}

	return toReturn;
}

let find_primitive_ingredients = function(name, count, recipe_map) {
	let resource = recipe_map.get(name);

	if (typeof(resource) === 'undefined') {
		alert('Error 22: Recipe not found!');
		return new Map();
	}

	let produced_count = Math.ceil(count / resource.result_count);

	let find_prim_ingrs_by_recipe = function(recipe, count) {
		let to_produce = Math.ceil(count / recipe.result_count);
		let ingredients = [];

		for (let i of recipe.ingredients) {
			let cur_ingr_simple_ingrs = [];

			if (i.hasOwnProperty('ref')) {
				cur_ingr_simple_ingrs = find_prim_ingrs_by_recipe(i.ref, i.count * to_produce);
			}
			else {
				cur_ingr_simple_ingrs = [{name: i.name, count: i.count * to_produce}];
			}

			cur_ingr_simple_ingrs.forEach(x => ingredients.push(x));
		}

		return ingredients;
	}

	let additional_results = resource.additional_results.map(r => [r[0], r[1] * produced_count]);

	return {
		ingredients: simplify(find_prim_ingrs_by_recipe(resource, count)), 
		result_count: produced_count * resource.result_count,
		additional_results: additional_results};
}

//----------------------------------------------------
// React components
//----------------------------------------------------

let IOBox = function(props) {
	return <div className={props.className}>
		<h3 className="iotext"> {props.text} </h3>
		{props.children}
	</div>
}

let ResourceTable = function(props) {
	return <BootstrapTable data={props.data}>
			<TableHeaderColumn isKey dataField='name'> Ingredient </TableHeaderColumn>
			<TableHeaderColumn dataField='count'> Count </TableHeaderColumn>
		</BootstrapTable>
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
			ingredients: new Map(),
			additional_results: new Map(),
			result_count: 1
		};

		this.handle_input_submit = this.handle_input_submit.bind(this);
	}

	handle_input_submit() {
		let result = find_primitive_ingredients(this.state.name, this.state.count, recipes_normal);

		this.setState({
			ingredients: result.ingredients,
			additional_results: new Map(result.additional_results),
			result_count: result.result_count});
	}

	render() {
		let list_ingrs = [];
		this.state.ingredients.forEach(function(count, name, map) {
			list_ingrs.push({name: name, count: count});
		});

		let list_additional_results = [];
		this.state.additional_results.forEach(function(count, name, map) {
			list_additional_results.push({name: name, count: count});
		});

		return <div className="mainbox">
			<h1>Recipe Calculator</h1>
			<IOBox className="input" text="Name">
				<input
					onChange={(e) => this.setState({name: e.target.value})}
					value={this.state.name}
				/>
			</IOBox>
			<IOBox className="input" text="Count">
				<input
				onChange={(e) => this.setState({count: e.target.value})}
				value={this.state.count.toString()}
				/>
			</IOBox>
			<IOBox className="input" text="">
				<button onClick={this.handle_input_submit}> Get Recipe! </button>
			</IOBox>
			<IOBox className="output" text="Ingredients">
				<ResourceTable data={list_ingrs}/>
			</IOBox>
			<IOBox className="output" text="">
				<h4> Result Count: {this.state.result_count.toString()} </h4>
			</IOBox>
			<IOBox className="output" text="Additional Results">
				<ResourceTable data={list_additional_results}/>
			</IOBox>
		</div>;
	}
}

ReactDOM.render(<App/>, document.getElementById('root'));