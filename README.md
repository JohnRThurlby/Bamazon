### Overview

This is an Amazon-like storefront application. There are three possible paths:

1. As a customer:   can view what products are for sale, purchase a product, and view the products they have purchased. 
Usage: node bamazonCustomer.js

2. As a manager:    can view the available products, can view those products with low inventory, add stock to a product, add a new product, and remove a product. In the product low inventory view, those products with less that 50% of the inventory limit requested have the inventory shown in red, otherwise it is shown in yellow.  
Usage: node bamazonManager.js 

3. As a supervisor: can view the departmental sales, can modify the overhead costs for a department, add a new department, remove a  department, but only if no products are still in tht department. In the departmental sales view, if a product has less than zero profit, the amount is displayed in red. 
Usage: node bamazonSupervisor.js

Short video showing usage and output:

![word-game](https://user-images.githubusercontent.com/33644735/39363971-3ef102ea-49fa-11e8-902d-d7bc590320bd.gif)

Software used: 

<img src="/nodejs_logo.png" width="256" height="256" title="NodeJS"><img src="/npm-logo.png" width="256" height="256" title="Node Package Manager"><img src="/inquirer.png" width="256" height="256" title="Inquirer">

<img src="/mysql.png" width="256" height="256" title="MySQL"><img src="/cli-tables.png" width="256" height="256" title="CLI Tables"><img src="/colors.png" width="256" height="256" title="Colors">

