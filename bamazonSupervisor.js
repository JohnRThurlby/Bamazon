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

    console.log('in here')

	//connect to the mysql database and pull the information from the Products database to display to the user

	var sql = 'SELECT * FROM totalsales'
	connection.query(sql, function(err, result){
		if(err) console.log(err);

		//creates a table for the information from the mysql database to be placed
		var table = new Table({
			head: ['Dept Id#', 'Department Name', 'Overhead Costs', 'Sales', 'Profit'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

        //loops through each item in the mysql database and pushes that information into a new row in the table
        console.log(result.length)
		for(var i = 0; i < result.length; i++){
			table.push(
				[result[i].dept, result[i].dept_name, result[i].overhead_costs, result[i].dept_sales, result[i].profit]
			);
		}
		//show the product info in tabular form
		console.log(table.toString());

		//recursive call to determine next action 
		determineAction()
	});
}

//function to allow more stock to be added to a product
function modifyOverhead() {

	inquirer.prompt([

        {
            name: "modDept",
            type: "input",
            message: "What is the department you want to change?"
        }, {
            name: 'modOver',
            type: 'input',
            message: "What is the new departmental overhead?"
        },

    ]).then(function(answers) {
        
		//connect to the mysql database and pull the information from the Products database to display to the user
		var sql = 'SELECT * FROM departments WHERE dept = ?'

		connection.query(sql, [answers.modDept], function(err, result){
			if(err) console.log(err);
			   
			if (result.length < 1) {
                outDesc = 'Department does not exist: ' + answers.modDept + 'Try again!'
				console.log(outDesc.red);
				
			}
            else {
                var sql = 'UPDATE departments SET overhead_costs = ? where dept = ?'
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
            }

             //recursive call to determine next action
            determineAction()
		});
	});
}

function newDept() {

	inquirer.prompt([

        {
            name: "adddeptName",
            type: "input",
            message: "What department would you like to add?"
		}, 
		{
            name: 'adddeptOver',
            type: 'input',
            message: "How much overhead does the department take?"
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

	inquirer.prompt([

        {
            name: "deleteId",
            type: "input",
            message: "What is the dept number of the department you wish to delete?"
        }, 

    ]).then(function(answers) {

        var sql = 'SELECT dept_name FROM departments WHERE dept = ?'
		connection.query(sql, [answers.deleteId], function(err, result){
			if (err) {
				console.log(err)
				undoSQL() 
			}

			if (result.length < 0) {
				console.log('Invalid department: ' + answers.deleteId + 'Try again!'.red);
				
				//recursive call to determine next action 
				determineAction()
			}

            //determine if any products are still in this department. Cannot delete if yes.
            var sql = 'SELECT department_name FROM PRODUCTS WHERE department_name = ?'
            connection.query(sql, [result[0].dept_name], function(err, result){
                if (err) {
                    console.log(err)
                    undoSQL() 
                }
                if (result.length > 0) {

                    outDesc = 'Products still exist with department name ' + result[0].dept_name + 'Products must be removed first!'
                    console.log(outDesc.red);
                    
                    //recursive call to determine next action 
                    determineAction()
                }
            });
						
		});
        
		//connect to the mysql database and delete the department
		var sql = 'DELETE FROM departments WHERE dept = ?'
		connection.query(sql, [answers.deleteId], function(err, result){
			if (err) {
				console.log(err)
				undoSQL() 
			}

			if (result.length < 0) {
                outDesc = 'Invalid department: ' + answers.deleteId + 'Try again!'
				console.log(outDesc.red);
				
				//recursive call to determine next action 
				determineAction()
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
	});
			
}

// function to rollback any updates if a DB error occurs
function undoSQL() {

	connection.query('ROLLBACK', function(err, response) {
		if (err) { console.log(err) }

})}