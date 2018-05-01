const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');
const Table = require('cli-table');

var chars = {
	'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
	'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
	'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─',
	'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│'
  };

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Noelrr01',
	database: 'bamazon' 
});

// connection to DB, and start by displaying possible actions
connection.connect(function(err) {
	if (err) throw err;
	determineAction()
});

//fuction to determine what manager wnats to do.
function determineAction() {
	inquirer.prompt([
		{
			name: 'managerAction',
			type: 'list',
			message: 'Select an action you want to perform',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add stock to a Product', 'Add a New Product', 'Remove a Product', 'Exit']
		},
		]).then(function(answers){ 

			switch(answers.managerAction){

				case('View Products for Sale'):
					displayProducts()
					break

				case('View Low Inventory'):
					displayLowproducts()
					break

				case('Add stock to a Product'):
					addTostock()
					break

				case('Add a New Product'):
					newProduct()
					break

				case('Remove a Product'):
					deleteProduct()
					break

				case('Exit'):
					process.exit(1)
					break

			}
				
		}
	);
}

//display products for sale from products table
function displayProducts() {

	//connect to the mysql database and pull the information from the Products database to display to the user

	var sql = 'SELECT * FROM products'
	connection.query(sql, function(err, result){
		if(err) console.log(err);

		//creates a table for the information from the mysql database to be placed
		console.log('>>>>>>Products Available<<<<<<'.blue);
		var table = new Table({
			head: ['Product Id#', 'Product Name', 'Price', 'Stock Quantity', 'Sales'],
			chars: chars,
			colAligns: [null, null, 'right', 'right', 'right'],
			style: {
				head: ['blue'],
				compact: false
			}
		});

		//loops through each item in the mysql database and pushes that information into a new row in the table
		for(var i = 0; i < result.length; i++){
			table.push(
				[result[i].item, result[i].product_name, result[i].price, result[i].stock_qty, result[i].product_sales]
			);
		}
		//show the product info in tabular form
		console.log(table.toString());

		//recursive call to determine next action 
		determineAction()
	});
}

//display products that have a stock qty < quantity specfied
function displayLowproducts() {

	inquirer.prompt([
		{
			name: 'lowstockLevel',
			type: 'input',
			message: 'Enter the low stock quantity you want to view',
			validate: validateInteger
		}
		]).then(function(answers){ 

			var sql = 'SELECT * FROM products WHERE stock_qty < ?'

			connection.query(sql, [parseInt(answers.lowstockLevel)], function(err, result){
				if(err) console.log(err);
		
				//creates a table for the information from the mysql database to be placed
				console.log('>>>>>>Low Stock<<<<<<'.blue);
				var table = new Table({
					head: ['Product Id#', 'Product Name', 'Price', 'Stock Quantity','Sales'],
					chars: chars,
					colAligns: [null, null, 'right', 'right', 'right'],
					style: {
						head: ['blue'],
						compact: false
					}
				});
		
				//loops through each item in the mysql database and pushes that information into a new row in the table
				for(var i = 0; i < result.length; i++){
					if ( result[i].stock_qty < (parseInt(answers.lowstockLevel) / 2))
					{
						table.push(
						[result[i].item, result[i].product_name, result[i].price, colors.red(result[i].stock_qty), result[i].product_sales ]
					);
					}
					else 
					{
						table.push(
						[result[i].item, result[i].product_name, result[i].price, colors.yellow(result[i].stock_qty), result[i].product_sales ]
						);
					}
					
				}

				//show the product info in tabular form
				console.log(table.toString());

				//recursive call to determine next action 
				determineAction()
			});
		}
	);
}

//function to allow more stock to be added to a product
function addTostock() {

	inquirer.prompt([

        {
            name: "addtoId",
            type: "input",
			message: "What is the product number of the product you wish to restock?",
			validate: validateNumeric
        }, {
            name: 'quantity',
            type: 'input',
			message: "How much stock would you like to add?",
			validate: validateInteger
        },

    ]).then(function(answers) {
        
		//connect to the mysql database and pull the information from the Products database to display to the user
		var sql = 'SELECT * FROM products WHERE item = ?'

		connection.query(sql, [answers.addtoId], function(err, result){
			if(err) console.log(err);
			   
			if (result.length < 0) {
				console.log('Invalid product number: ' + answers.addtoId + 'Try again!'.red);
				
				//recursive call to determine next action 
				determineAction()
			}

			// Added input stock amount onto products existing stock
			var quantityAdded = parseInt(answers.quantity) + result[0].stock_qty
			
			var sql = 'UPDATE products set products.stock_qty = ? where item = ?'
			connection.query(sql, [quantityAdded, answers.addtoId], function(err, result){
				if (err) {
					console.log(err)
					undoSQL() 
				}
				   
				   console.log('Product ' + answers.addtoId + ' now has ' + quantityAdded + ' stock on hand'.green );

				   // commit DB changes in case of future error, then changes up to this point are saved
					connection.query('COMMIT', function(err, response) {
						if (err) {
							console.log(err)
							undoSQL() 
						}

					});

					//recursive call to determine next action 
				   determineAction()
			});
		});
	});
}

function newProduct() {

	 //get the department names

	 var deptnames = [];

	connection.query('SELECT dept_name FROM departments', function(err, result){
		if(err) throw err;

		for(var i = 0; i<result.length; i++){
			deptnames.push(result[i].dept_name);
		}
	

		inquirer.prompt([

			{
				name: 'addProd',
				type: 'input',
				message: 'What product name of the product you wish to add?',
				validate: function validateAlpha(name){
					return name !== '';
				}
			}, 
			{
				name: 'addDept',
				type: 'list',
				message: "What is the department?",
				choices: deptnames
			},
			{
				name: 'addPrice',
				type: 'input',
				message: "What is the price of the product?",
				validate: validateNumeric
			},
			{
				name: 'addStock',
				type: 'input',
				message: "How much stock is available?",
				validate: validateInteger
			}
		]).then(function(answers) {
			

			var sql = 'SELECT * FROM products WHERE product_name = ?'

			connection.query(sql, [answers.addProd], function(err, result){
				if(err) console.log(err);
				
				//Product name already exists. 
				if (result.length > 0) {
					console.log('Product already exists: ' + answers.addProd + 'Try again!'.red);
					
					//recursive call to determine next action 
					determineAction()
				}
			});  // end of select products

			//add new product into products table
			var sql = 'INSERT INTO products set product_name = ?, department_name = ?, price = ?, stock_qty = ?'	
			connection.query(sql, [answers.addProd, answers.addDept, parseFloat(answers.addPrice), parseInt(answers.addStock) ], function(err, result){
				if (err) {
					console.log(err)
					undoSQL() 
				}
					
				console.log('Product ' + answers.addProd + ' in department ' + answers.addDept + ' is added to the products list'.green );

				// commit DB changes in case of future error, then changes up to this point are saved
				connection.query('COMMIT', function(err, response) {
					if (err) {
						console.log(err)
						undoSQL() 
					}
				});

				//recursive call to determine next action 
				determineAction()

			});  //end to insert connection
			
		}); //end of inquirer

	})
}

//function to delete a product
function deleteProduct() {

	inquirer.prompt([

        {
            name: "deleteId",
            type: "input",
			message: "What is the product number of the product you wish to delete?",
			validate: validateInteger
        }, 

    ]).then(function(answers) {
        
		//connect to the mysql database and delete the Product
		var sql = 'DELETE FROM products WHERE item = ?'
		connection.query(sql, [answers.deleteId], function(err, result){
			if (err) {
				console.log(err)
				undoSQL() 
			}

			if (result.length < 0) {
				console.log('Invalid Product number: ' + answers.deleteId + 'Try again!'.red);
				
				//recursive call to determine next action 
				determineAction()
			}

			console.log('Product ' + answers.deleteId + ' has been removed'.green );

			// commit DB changes in case of future error, then changes up to this point are saved
			connection.query('COMMIT', function(err, response) {
				if (err) {
					console.log(err)
					undoSQL() 
				}

			});

			//recursive call to determine next action 
			determineAction()
			
		});
	});
			
}

// function to rollback any updates if a DB error occurs
function undoSQL() {

	connection.query('ROLLBACK', function(err, response) {
		if (err) { console.log(err) }

})}

// validateInteger makes sure that the user is supplying only positive integers for their inputs
function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

// validateNumeric makes sure that the user is supplying only positive numbers for their inputs
function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number.'
	}
}
