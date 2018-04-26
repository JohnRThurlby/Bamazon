var inquirer = require("inquirer");
//var customer = require("./bamazonCustomer.js");
//var manager = require("./bamazonManager.js");

function userType() {

    inquirer.prompt([
        {
        name: 'userType',
		type: 'list',
		message: 'Are you a customer, manager, or executive? Select from the choices below.',
        choices: ['customer', 'manager', 'executive']
        }
    ]).then(function(answers)
    {   
        
        switch(answers.userType) {

            case('customer'):
                //customer.displayProducts()
                break

            case('manager'):
                //manager.determineManageraction()
                break

        }
        
        
        
	}
   );
}

userType()
