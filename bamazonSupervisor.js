const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');
const Table = require('cli-table');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Noelrr01',
	database: 'bamazon' 
});

var outDesc = " " 

var chars = {
	'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
	'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
	'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─',
	'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│'
  };

// connection to DB, and start by displaying possible actions
connection.connect(function(err) {
	if (err) throw err;
	determineAction()
});

//fuction to determine what manager wnats to do.
function determineAction() {
	inquirer.prompt([
		{
			name: 'superAction',
			type: 'list',
			message: 'Select an action you want to perform',
			choices: ['Display Department Sales', 'Modify department overhead', 'Add Department', 'Remove Department', 'Exit']
		},
		]).then(function(answers){ 

			switch(answers.superAction){

				case('Display Department Sales'):
					displaySales()
					break

				case('Modify department overhead'):
					modifyOverhead()
					break

				case('Add Department'):
					newDept()
					break

				case('Remove Department'):
					deleteDept()
					break

				case('Exit'):
					process.exit(1)
					break

			}
				
		}
	);
}

//display sales from deparment table via view that uses alaias to calculate profit
function displaySales() {

	//connect to the mysql database and pull the information from the Products database to display to the user

	var sql = 'SELECT * FROM totalsales'
	connection.query(sql, function(err, result){
		if(err) console.log(err);

		//creates a table for the information from the mysql database to be placed
		console.log('>>>>>>Product Sales<<<<<<'.blue);
		var table = new Table({
			head: ['Dept Id#', 'Department Name', 'Overhead Costs', 'Sales', 'Profit'],
			chars: chars,
			colAligns: [null, null, 'right', 'right', 'right'],
			style: {
				head: ['blue'],
				compact: false
			}
		});

        //loops through each item in the mysql database and pushes that information into a new row in the table
        
		for (var i = 0; i < result.length; i++){
			if (result[i].profit < 0){
				table.push(
					[result[i].dept, result[i].dept_name, result[i].overhead_costs, result[i].dept_sales, colors.red(result[i].profit)]
				);
			}
			else {
				table.push(
					[result[i].dept, result[i].dept_name, result[i].overhead_costs, result[i].dept_sales, colors.green.bold(result[i].profit)]
				)
			}
		}
		//show the product info in tabular form
		console.log(table.toString());

		//recursive call to determine next action 
		determineAction()
	});
}

//function to allow more stock to be added to a product
function modifyOverhead() {

	var deptnames = [];

	connection.query('SELECT dept_name FROM departments', function(err, result){
	if(err) throw err;
	
		for(var i = 0; i<result.length; i++){
			deptnames.push(result[i].dept_name);
		}
				
		inquirer.prompt([

			{
				name: 'modDept',
				type: 'list',
				message: 'What is the department?',
				choices: deptnames
			},
			{
				name: 'modOver',
				type: 'input',
				message: "What is the new departmental overhead?",
				validate: validateInteger,
			},

		]).then(function(answers) {
			
			//connect to the mysql database and update the information in the departments table
					
				
			var sql = 'UPDATE departments SET overhead_costs = ? where dept_name = ?'
			connection.query(sql, [parseInt(answers.modOver), answers.modDept], function(err, result){
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
			
			});
			outDesc = 'Department ' + answers.modDept + ' now has a ' + answers.modOver + ' overhead'
			console.log(outDesc.green );
		

				//recursive call to determine next action
			determineAction()
			
		});

	})
}

function newDept() {

	inquirer.prompt([

        {
            name: "adddeptName",
            type: "input",
			message: "What department would you like to add?",
			validate: function validateAlpha(name){
				return name !== '';
			}
		}, 
		{
            name: 'adddeptOver',
            type: 'input',
			message: "How much overhead does the department take?",
			validate: validateInteger,
        }
    ]).then(function(answers) {
        

		var sql = 'SELECT * FROM departments WHERE dept_name = ?'

		connection.query(sql, [answers.adddeptName], function(err, result){
			   if(err) console.log(err);
			   
			   //Department already exists. 
			   if (result.length > 0) {
                outDesc = 'Department aready exists: ' + answers.adddeptName + 'Try again!'
				console.log(outDesc.red);
				
				//recursive call to determine next action 
				determineAction()
			}
		});  // end of select department

		//add new department into the department table
		var sql = 'INSERT INTO departments SET dept_name = ?, overhead_costs = ?'	
		connection.query(sql, [answers.adddeptName, parseInt(answers.adddeptOver)], function(err, result){
			if (err) {
				console.log(err)
				undoSQL() 
			}
            
            outDesc = 'Department ' + answers.adddeptName + ' with overhead of ' + answers.adddeptOver + ' is added to the department list'
			console.log(outDesc.green );
			
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
}

//function to delete a department
function deleteDept() {

	var deptnames = [];

	var sql = 'SELECT dept_name FROM departments'
	connection.query(sql, function(err, result){

		if(err) throw err;
		for(var i = 0; i<result.length; i++){
			deptnames.push(result[i].dept_name);
		}
	
		inquirer.prompt([

			{
				name: "deleteId",
				type: "list",
				message: "Which department do you want to delete?",
				choices: deptnames
			}, 

		]).then(function(answers) {

			//determine if any products are still in this department. Cannot delete if yes.
			var sql = 'SELECT * FROM PRODUCTS WHERE department_name = ?'
			connection.query(sql, [answers.deleteId], function(err, result){
				if (err) {
					console.log(err)
					undoSQL() 
				}
				if (result.length > 0) {

					outDesc = 'Products still exist with department name ' + answers.deleteId + '. Products must be removed first!'
					console.log(outDesc.red);
					
					//recursive call to determine next action 
					determineAction()
				}
				else {

					//connect to the mysql database and delete the department
					var sql = 'DELETE FROM departments WHERE dept_name = ?'
					connection.query(sql, [answers.deleteId], function(err, result){
						if (err) {
							console.log(err)
							undoSQL() 
						}
						
						outDesc = 'Department ' + answers.deleteId + ' has been removed'
						console.log(outDesc.green );

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
				}
			});
		});
	})
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