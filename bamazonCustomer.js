const mysql = require('mysql')
const inquirer = require('inquirer')
const colors = require('colors')
const Table = require('cli-table')
const nodemailer = require('nodemailer');

var currentUser = " "
var outDesc = " "
var mailOptions = " " 
var outEmail = " "

var chars = {
	'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
	'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
	'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─',
	'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│'
  }

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Noelrr01',
	database: 'bamazon' 
})

// connection to DB, and start by displaying product data
connection.connect(function(err) {
	if (err) throw err;
	checkUser()
});

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'bamazonucf@gmail.com',
	  pass: 'bamazon01!'
	}
  });

//connect to the mysql database and pull the information from the Products database to display to the user
function displayProducts() {
	
	var sql = 'SELECT item, product_name, price FROM products'

	connection.query(sql, function(err, result){

		if(err) console.log(err);

		//creates a table for the information from the mysql database to be placed
		console.log('>>>>>>Products Available for Purchase<<<<<<'.blue)
		var table = new Table({
			head: ['Item Id#', 'Product Name', 'Price'],
			chars: chars,
			colAligns: [null, null, 'right'],
			style: {
				head: ['blue'],
				compact: false
			}
		})

		//loops through each item in the mysql database and pushes that information into a new row in the table
		
		for(var i = 0; i < result.length; i++){
			table.push([result[i].item, result[i].product_name, result[i].price])
		}
		//show the product info in tabular form

		console.log(table.toString());
		
		//determine what customer wants to do
		determineAction()
	});
}

//connect to the mysql database and pull the information from the Products database to display to the user
function displayPurchased() {
	
	var sql = 'SELECT purchases.purchaseqty, purchases.purchaseprice, products.product_name FROM purchases INNER JOIN products on products.item = purchases.purchaseprodId where purchases.purchaseuser = ?'

	connection.query(sql, [currentUser], function(err, result){

		if(err) console.log(err)

		//creates a table for the information from the mysql database to be placed
		console.log('>>>>>>Products Purchased<<<<<<'.blue);
		var table = new Table({
			head: ['Product Name', 'Purchase Price', 'Purchased Quantity', 'Total Cost'],
			chars: chars,
			colAligns: [null, 'right', 'right', 'right'],
			style: {
				head: ['blue'],
				compact: false
			}
		});

			//loops through each item in the mysql database and pushes that information into a new row in the table
		if (result.length > 0) {
			for(var i = 0; i < result.length; i++){
				table.push([result[i].product_name, result[i].purchaseprice, result[i].purchaseqty, result[i].purchaseprice * result[i].purchaseqty])
			}
			//show the purchased product info in tabular form

			console.log(table.toString())

		}
		else{ 

			console.log('You have not purchased any products yet.... Time to shop!'.red);

		}
		
		//determine what customer wants to do
		determineAction()
	});
}

// function for customer to purchase an item
function determinePurchase() {

	inquirer.prompt([
		{
			name: 'itemId',
			type: 'input',
			message: 'Enter an item ID of the product you want to purchase',
			validate: validateInteger,
			filter: Number
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'How many would you like to purchase?',
			validate: validateNumeric
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
			outDesc = "Your total cost for " + quantityNeeded + " " + response[0].product_name + " is " + totalCustcost + ". Thank you for doing business with us!" 
            console.log(outDesc.green);
			
			//update product table minus purchased quantity for stock and how mucgh sales are for this product
			var stockUpdate = response[0].stock_qty - quantityNeeded
			var priceUpdate = response[0].product_sales + totalCustcost
			var sql = 'UPDATE products SET stock_qty = ?, product_sales = ? WHERE item = ?'

            connection.query(sql, [stockUpdate, priceUpdate, itemNeeded], function(err, response) {
				if (err) {
					console.log(err)
					undoSQL() 
				}
			});
			//get dept table so can update sales and profits based on this transaction

			var sql = 'SELECT * FROM departments WHERE dept_name = ?'

            connection.query(sql, [saveDepartment], function(err, response) {
				if (err) {
					console.log(err)
					undoSQL() 
				}

				//update department table for sales and profits

				response[0].dept_sales += totalCustcost
			    
				var sql = 'UPDATE departments SET dept_sales = ? WHERE dept_name = ?'
				
                connection.query(sql, [response[0].dept_sales, saveDepartment], function(err, response) {
					if (err) {
						console.log(err)
						undoSQL() 
					}
				});	
			});
				
			var sql = 'INSERT INTO purchases (purchaseuser, purchaseprodId, purchaseqty, purchaseprice) values(?, ?, ?, ?)'
			
			connection.query(sql, [currentUser, response[0].item, quantityNeeded, response[0].price], function(err, response) {
				if (err) {
					console.log(err)
					undoSQL() 
				}
				
				// commit DB changes in case of future error, then changes up to this point are saved
				connection.query('COMMIT', function(err, response) {
					if (err) {
						console.log(err)
						undoSQL() 
					}

				});

				inquirer.prompt([
					{
						name: 'emailAddr',
						type: 'input',
						message: 'If you would like an email receipt, please enter an email',
					}
				]).then(function(answers){ 
						
						if (answers.emailAddr !== '') {
							outEmail = answers.emailAddr
							mailOptions = {
								from: 'bamazonUCF@gmail.com',
								to: answers.emailAddr, 
								subject: 'Purchase from Bamazon',
								text: outDesc
							};
							deliverMail()
						}
						else determineAction();
					});
			});
		} 
		else {
			//Tell customer, not enough stock for purchase. 
		   	console.log("Sorry, we do not have enough of " + response[0].product_name + " to fulfill your order.".red);
			determineAction();
		};
		
        
    });

}

// function to rollback any updates if a DB error occurs
function undoSQL() {

	connection.query('ROLLBACK', function(err, response) {
		if (err) { console.log(err) }

})}

function determineAction() {
	inquirer.prompt([
		{
			name: 'action',
			type: 'list',
			message: 'Select action from below',
			choices: ['View products to purchase', 'Purchase a product', 'View products you already purchased', 'Exit']
		}		
		]).then(function(answers){ 

			switch(answers.action) {

				case('View products to purchase'):
					displayProducts()
					break

				case('Purchase a product'):
					determinePurchase()
					break

				case('View products you already purchased'):
					displayPurchased()
					break

				case('Exit'):
					connection.end();
					process.exit(1)
					break
		}
	});
}

function checkUser() {
	inquirer.prompt([
		{
			name: 'action',
			type: 'list',
			message: 'Select user action',
			choices: ['Are you a new user?', 'Existing user?','Exit']
		}		
		]).then(function(answers){ 

			switch(answers.action) {

				case('Are you a new user?'):
					newUser() 
					break

				case('Existing user?'):
					existingUser()
					break

				case('Exit'):
					connection.end();
					process.exit(1)
					break
		}
	});
}
function newUser() {

	var done = " "

	inquirer.prompt([
		{
			name: 'newuserId',
			type: 'input',
			message: 'Enter a userId',
			validate: function validateAlpha(name){
				return name !== '';
			}
		},
		{
			name: 'newuserPassword',
			type: 'password',
			message: 'Enter a password',
			validate: function validateAlpha(name){
				return name !== '';
			}
		}	
		]).then(function(answers){ 

			var sql = 'INSERT INTO users (username, userpassword) values(?, ?)'
				
			connection.query(sql, [answers.newuserId, answers.newuserPassword], function(err, result) {
				if (err) { console.log(err) };
				var outDesc = "User " +  answers.newuserId + " successfully added"
				console.log(outDesc.green);
				outDesc = "Welcome " + answers.newuserId + ", enjoy shopping at Bamazon!"
				console.log(outDesc.green);
				currentUser = answers.newuserId
				determineAction()
			});	
		})						
}
function existingUser() {

	inquirer.prompt([
		{
			name: 'curuserId',
			type: 'input',
			message: 'Enter a userId',
			validate: function validateAlpha(name){
				return name !== '';
			}
		},
		{
			name: 'curPassword',
			type: 'password',
			message: 'Enter a password',
			validate: function validateAlpha(name){
				return name !== '';
			}
		}	
		]).then(function(answers){ 
			
			var name = answers.curuserId
			var pass = answers.curPassword
			var sql = 'SELECT * FROM users WHERE username = ? AND userpassword = ?';
			connection.query(sql, [name, pass], function(error, result) {
				if (error) { console.log(error) };

				if (result.length < 1) {

					var outDesc = "The user name/user password does not exist, please try again!"
					console.log(outDesc.red);
					checkUser()

				}

				else {

					var outDesc = "Welcome " + answers.curuserId + ", enjoy shopping at Bamazon!"
					console.log(outDesc.green);
					currentUser = answers.curuserId
					determineAction()

				}
					
			});
		})
}

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

function deliverMail() {

	transporter.sendMail(mailOptions, function(err, info){
	if (err) {
		console.log(err);
	} else {
		console.log('Email sent to ' + outEmail);
		determineAction();
	}
	});
}
