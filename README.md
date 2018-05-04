<h2>Overview</h2>

This is an Amazon-like storefront application. There are three possible paths:

1. As a customer:       can view what products are for sale,
<br> 
                        purchase a product, 
<br>
                        and view the products they have purchased. 
<br> 
                        For a purchase, the customer can select to have a receipt emailed to them showing their purchase and its cost. See pdf shown below. 


<h4>Usage: node bamazonCustomer.js</h4>


2. As a manager:        can view the available products,
<br> 
                        can view those products with low inventory,
<br> 
                        add stock to a product,
<br> 
                        add a new product,
<br> 
                        or remove a product.
<br> 
                        In the product low inventory view, those products with less that 50% of the inventory limit requested have the inventory shown in red, otherwise it is shown in yellow. 


<h4>Usage: node bamazonManager.js</h4> 


3. As a supervisor:     can view the departmental sales,
<br>
                        can modify the overhead costs for a department,
<br>
                        add a new department,
<br>
                        or remove a  department, but only if no products are still in that department.
<br> 
                        In the departmental sales view, if a product has less than zero profit, the amount is displayed in red.

<h4>Usage: node bamazonSupervisor.js</h4>


<h2>Short videos showing usage and output:</h2>

<h3>1. Customer:</h3>

![customer](https://user-images.githubusercontent.com/33644735/39631768-1dc37760-4f81-11e8-8e1f-faab77eb2e67.gif)

<h3>2. Manager:</h3>

![manager](https://user-images.githubusercontent.com/33644735/39632279-9db3ab10-4f82-11e8-8c5f-06387bda18e1.gif)

<h3>3. Supervisor:</h3>

![supervisor](https://user-images.githubusercontent.com/33644735/39631985-ca4380f2-4f81-11e8-917c-5ee2bae721d5.gif)



<h3>PDF of email for Customer purchase:</h3>

[Purchase from Bamazon.pdf](https://github.com/JohnRThurlby/Bamazon/files/1974725/Purchase.from.Bamazon.pdf)





Software used: 

<img src="/nodejs_logo.png" width="256" height="256" title="NodeJS"><img src="/npm-logo.png" width="256" height="256" title="Node Package Manager"><img src="/inquirer.png" width="256" height="256" title="Inquirer">

<img src="/mysql.png" width="256" height="256" title="MySQL"><img src="/cli-tables.png" width="256" height="256" title="CLI Tables"><img src="/colors.png" width="256" height="256" title="Colors">

