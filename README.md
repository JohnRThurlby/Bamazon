### Overview

This is an Amazon-like storefront application. There are three possible paths:

1. As a customer:   can view what products are for sale, purchase a product, and view the products they have purchased.  For a purchase, the customer can select to have a receipt emailed to them showing their purchase and its cost.

Usage: node bamazonCustomer.js

2. As a manager:    can view the available products, can view those products with low inventory, add stock to a product, add a new product, and remove a product. In the product low inventory view, those products with less that 50% of the inventory limit requested have the inventory shown in red, otherwise it is shown in yellow. 

Usage: node bamazonManager.js 

3. As a supervisor: can view the departmental sales, can modify the overhead costs for a department, add a new department, remove a  department, but only if no products are still in that department. In the departmental sales view, if a product has less than zero profit, the amount is displayed in red.

Usage: node bamazonSupervisor.js

Short videos showing usage and output:

1. Customer

![customer](https://user-images.githubusercontent.com/33644735/39631768-1dc37760-4f81-11e8-8e1f-faab77eb2e67.gif)

2. Manager

![manager](https://user-images.githubusercontent.com/33644735/39632279-9db3ab10-4f82-11e8-8c5f-06387bda18e1.gif)

3. Supervisor

![supervisor](https://user-images.githubusercontent.com/33644735/39631985-ca4380f2-4f81-11e8-917c-5ee2bae721d5.gif)

PDF of email for Customer purchase

[Purchase from Bamazon.pdf](https://github.com/JohnRThurlby/Bamazon/files/1974725/Purchase.from.Bamazon.pdf)


Software used: 

<img src="/nodejs_logo.png" width="256" height="256" title="NodeJS"><img src="/npm-logo.png" width="256" height="256" title="Node Package Manager"><img src="/inquirer.png" width="256" height="256" title="Inquirer">

<img src="/mysql.png" width="256" height="256" title="MySQL"><img src="/cli-tables.png" width="256" height="256" title="CLI Tables"><img src="/colors.png" width="256" height="256" title="Colors">

