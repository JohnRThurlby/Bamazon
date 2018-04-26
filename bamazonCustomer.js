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


function displayProducts() {
	//connect to the mysql database and pull the information from the Products database to display to the user
	connection.query('SELECT item, product_name, price FROM products', function(err, result){
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
			table.push(
				[result[i].item, result[i].product_name, result[i].price]
			);
		}
		console.log(table.toString());
		determinePurchase()
	});
}

function determinePurchase() {
	inquirer.prompt([
		{
			name: 'itemId',
			type: 'input',
			message: 'Enter an item ID of the product you want to purchase'
			//validate: function(str){
			//	var regEx = new RegExp("^[a-zA-Z\s]{1,1}$");
			//	return regEx.test(str);
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'How many would you like to purchase?'
			//validate: function(str){
			//	var regEx = new RegExp("^[a-zA-Z\s]{1,1}$");
			//	return regEx.test(str);
		},
		]).then(function(answers){ 

			//set captured input as variables, pass variables as parameters.
			var quantityNeeded = answers.quantity;
			var itemNeeded = answers.itemId;
			purchase(itemNeeded, quantityNeeded);
				
		}
	);
}

function purchase(itemNeeded, quantityNeeded) {

	connection.query('SELECT * FROM products WHERE item = ' + itemNeeded, function(error, response) {
        if (error) { console.log(error) };

        //if in stock
        if (quantityNeeded <= response[0].stock_qty) {
            //calculate cost
            var totalCustcost = response[0].price * quantityNeeded;
            //inform user
            console.log("We have enough in stock. We will ship your order right out!".green);
            console.log("Your total cost for " + quantityNeeded + response[0].product_name + " is " + totalCustcost + ". Thank you for doing business with us!".green);
            //update database, minus purchased quantity
            connection.query('UPDATE products SET stock_qty = stock_qty - ' + quantityNeeded + ' WHERE item = ' + itemNeeded);
        } else {
            console.log("Sorry, we do not have enough of " + response[0].product_name + " to fulfill your order.".red);
        };
        displayProducts();
    });


}

//function startCustomer(){

displayProducts()

//}

//startCustomer()



	
