var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Noelrr01',
	database: 'bamazon' 
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	connection.end();
  });




function determineAction() {
	inquirer.prompt([
		{
			name: 'managerAction',
			type: 'list',
			message: 'Select an action you want to perform',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Remove Product', 'Exit']
		},
		]).then(function(answers){ 

			switch(answers.managerAction){

				case('View Products for Sale'):
					displayProducts()
					break

				case('View Low Inventory'):
					displayLowproducts()
					break

				case('Add to Inventory'):
					addTostock()
					break

				case('Add New Product'):
					newProduct()
					break

				case('Remove Product'):
					deleteProduct()
					break

				case('Exit'):
					process.exit(1)
					break

			}
				
		}
	);
}

function displayProducts() {
	//connect to the mysql database and pull the information from the Products database to display to the user
	connection.query('SELECT * FROM products', function(err, result){
		if(err) console.log(err);

		//creates a table for the information from the mysql database to be placed
		var table = new Table({
			head: ['Item Id#', 'Product Name', 'Price', 'Stock Quantity'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//loops through each item in the mysql database and pushes that information into a new row in the table
		for(var i = 0; i < result.length; i++){
			table.push(
				[result[i].item, result[i].product_name, result[i].price, result[i].stock_qty]
			);
		}
		console.log(table.toString());
		determineAction()
	});
}

function displayLowproducts() {
	//connect to the mysql database and pull the information from the Products database to display to the user
	connection.query('SELECT * FROM products where stock_qty < 5', function(err, result){
		if(err) console.log(err);

		//creates a table for the information from the mysql database to be placed
		var table = new Table({
			head: ['Item Id#', 'Product Name', 'Price', 'Stock Quantity'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//loops through each item in the mysql database and pushes that information into a new row in the table
		for(var i = 0; i < result.length; i++){
			table.push(
				[result[i].item, result[i].product_name, result[i].price, result[i].stock_qty]
			);
		}
		console.log(table.toString());
		determineAction()
	});
}

function addTostock() {

	inquirer.prompt([

        {
            name: "addtoId",
            type: "input",
            message: "What is the item number of the product you wish to restock?"
        }, {
            name: 'quantity',
            type: 'input',
            message: "How much stock would you like to add?"
        },

    ]).then(function(answers) {
        //set captured input as variables, pass variables as parameters.
		;

		//connect to the mysql database and pull the information from the Products database to display to the user
		connection.query('SELECT * FROM products where item = ' + answers.addtoId, function(err, result){
		   	if(err) console.log(err);

			var quantityAdded = parseInt(answers.quantity) + result[0].stock_qty
			  
			connection.query('UPDATE products set products.stock_qty = ' + quantityAdded + ' where item = ' + answers.addtoId, function(err, result){
				   if(err) console.log(err);
				   
				   console.log('Item ' + answers.addtoId + ' now has ' + quantityAdded + ' stock on hand'.green );

				   determineAction()
			});
		});
	
	   
	});

	// determineAction()
}

function newProduct() {

	inquirer.prompt([

        {
            name: "addtoId",
            type: "input",
            message: "What is the item number of the product you wish to restock?"
        }, {
            name: 'quantity',
            type: 'input',
            message: "How much stock would you like to add?"
        },

    ]).then(function(answers) {
        //set captured input as variables, pass variables as parameters.
		;

		//connect to the mysql database and pull the information from the Products database to display to the user
		connection.query('SELECT * FROM products where item = ' + answers.addtoId, function(err, result){
		   	if(err) console.log(err);

			var quantityAdded = parseInt(answers.quantity) 
			  
			connection.query('INSERT  INTO products set products.stock_qty = ' + quantityAdded + ' where item = ' + answers.addtoId, function(err, result){
				   if(err) console.log(err);
				   
				   console.log('Item ' + answers.addtoId + ' now has ' + quantityAdded + ' stock on hand'.green );

				   determineAction()
			});
		});
	
	   
	});

	
}

function deleteProduct() {

	inquirer.prompt([

        {
            name: "deleteId",
            type: "input",
            message: "What is the item number of the product you wish to delete?"
        }, 

    ]).then(function(answers) {
        //set captured input as variables, pass variables as parameters.
		;

		//connect to the mysql database and pull the information from the Products database to display to the user
		connection.query('DELETE FROM products where item = ' + answers.deleteId, function(err, result){
		   	if(err) console.log(err);

			    console.log('Item ' + answers.deleteId + ' has been removed'.green );

			    determineAction()
			
			});
		});
			
}

determineAction()
