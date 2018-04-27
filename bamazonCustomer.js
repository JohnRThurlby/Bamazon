const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');
const Table = require('cli-table');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Noelrr01',
	database: 'bamazon' 
})

// connection to DB, and start by displaying product data
connection.connect(function(err) {
	if (err) throw err;
	displayProducts()
});

//connect to the mysql database and pull the information from the Products database to display to the user
function displayProducts() {
	
	var sql = 'SELECT item, product_name, price FROM products'

	connection.query(sql, function(err, result){

		if(err) console.log(err);

		//creates a table for the information from the mysql database to be placed
		var table = new Table({
			head: ['Item Id#', 'Product Name', 'Price'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//loops through each item in the mysql database and pushes that information into a new row in the table
		for(var i = 0; i < result.length; i++){
			table.push([result[i].item, result[i].product_name, result[i].price])
		}
		//show the product info in tabular form

		console.log(table.toString());
		
		//determine what customer wants to do
		determinePurchase()
	});
}

// function for customer to purchase an item
function determinePurchase() {

	inquirer.prompt([
		{
			name: 'itemId',
			type: 'input',
			message: 'Enter an item ID of the product you want to purchase'
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'How many would you like to purchase?'
		},
		]).then(function(answers){ 

			//set captured input as variables, pass variables as parameters.
			var quantityNeeded = parseInt(answers.quantity);
			var itemNeeded = answers.itemId;
			purchase(itemNeeded, quantityNeeded);
				
		}
	);
}

//function to perform purchase
function purchase(itemNeeded, quantityNeeded) {

	// get the item picked
	var sql = 'SELECT * FROM products WHERE item = ?'

	connection.query(sql, [itemNeeded], function(error, response) {
        if (error) { console.log(error) };

        //there is enough in stock for purchase to continue
        if (quantityNeeded <= response[0].stock_qty) {
			
			//calculate cost
			var totalCustcost = response[0].price * quantityNeeded;
			var saveDepartment = response[0].department_name 
            //inform user sale is okay, and how much it will cost
			
			console.log("We have enough in stock. We will ship your order right out!".green);
            console.log("Your total cost for " + quantityNeeded + response[0].product_name + " is " + totalCustcost + ". Thank you for doing business with us!".green);
			
			//update product table minus purchased quantity for stock and how mucgh sales are for this product
			var stockUpdate = response[0].stock_qty - quantityNeeded
			var priceUpdate = response[0].product_sales + totalCustcost
			var sql = 'UPDATE products SET stock_qty = ?, product_sales = ? WHERE item = ?'

            connection.query(sql, [stockUpdate, priceUpdate, itemNeeded], function(error, response) {
				if (error) {
					console.log(error)
					undoSQL() 
				}
			});
			//get dept table so can update ales and profits based on this transaction

			var sql = 'SELECT * FROM departments WHERE dept_name = ?'

            connection.query(sql, [saveDepartment], function(error, response) {
				if (error) {
					console.log(error)
					undoSQL() 
				}

				//update department table for sales and profits

				response[0].dept_sales += totalCustcost
			    response[0].total_profits = response[0].dept_sales - response[0].overhead_costs
				var sql = 'UPDATE departments SET dept_sales = ?, total_profits = ? WHERE dept_name = ?'
				
                connection.query(sql, [response[0].dept_sales, response[0].total_profits, saveDepartment], function(error, response) {
					if (error) {
						console.log(error)
						undoSQL() 
					}
					
					// commit DB changes in case of future error, then changes up to this point are saved
					connection.query('COMMIT', function(error, response) {
						if (error) {
							console.log(error)
							undoSQL() 
						}

					});
			    });
			});
			
		} 
		else {
			//Tell customer, not enough stock for purchase. 
            console.log("Sorry, we do not have enough of " + response[0].product_name + " to fulfill your order.".red);
        };
        displayProducts();
    });

}

// function to rollback any updates if a DB error occurs
function undoSQL() {

	connection.query('ROLLBACK', function(error, response) {
		if (error) { console.log(error) }

}
