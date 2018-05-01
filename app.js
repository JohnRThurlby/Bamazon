const inquirer = require('inquirer')
//const Customer = require('./bamazonCustomer.js')
//const Manager = require('./bamazonManager.js')
//const Supervisor = require('./bamazonSupervisor.js')

function userType() {

    console.log("in function")

    inquirer.prompt([
        {
        name: 'action',
		type: 'list',
		message: 'Are you a customer, manager, or supervisor? Select from the choices below.',
        choices: ['Customer', 'Manager', 'Supervisor', 'Exit']
        }
    ]).then(function(answers)
    {   
        console.log("user selection " + answers.action)
        switch(answers.action) {

            case('Customer'):
                Customer.checkUser()
                break

            case('Manager'):
                //Manager.determineAction()
                break

            case('Supervisor'):
                //Supervisor.determineAction()
                break

            case('Exit'):
                process.exit(1)
                break

            default:
                process.exit(1)

        }
    });
}

userType()
