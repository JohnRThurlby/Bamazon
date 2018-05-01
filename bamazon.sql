DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0 NOT NULL,
  stock_qty INTEGER(11) DEFAULT 0 NOT NULL, 
  product_sales DECIMAL(10,2) DEFAULT 0 NOT NULL,
  PRIMARY KEY (item)
);

CREATE TABLE departments(
  dept INTEGER(11) AUTO_INCREMENT NOT NULL,
  dept_name VARCHAR(50) NOT NULL,
  overhead_costs DECIMAL(10,2) DEFAULT 0 NOT NULL,
  dept_sales DECIMAL(10,2) DEFAULT 0 NOT NULL,
  PRIMARY KEY (dept)
);

CREATE TABLE users(
  userId INTEGER(11) AUTO_INCREMENT NOT NULL,
  username VARCHAR(20) NOT NULL,
  userpassword VARCHAR(20) NOT NULL,
  PRIMARY KEY (userId)
);

CREATE TABLE purchases(
  purchaseId INTEGER(11) AUTO_INCREMENT NOT NULL,
  purchaseuser VARCHAR(20) NOT NULL,
  purchaseprodId INTEGER(11) NOT NULL,
  purchaseqty INTEGER(11) NOT NULL, 
  purchaseprice INTEGER(10,2) NOT NULL, 
  PRIMARY KEY (purchaseId)
);

INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('Pride and Prejudice', 'Books', 11.00, 25), ('War and Peace', 'Books', 22.00, 15), ('McBeth', 'Books', 15.00, 10);
INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('Samsung Galaxy S9', 'Communication', 631.00, 100), ('iPhone X', 'Communication', 900.00, 25);
INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('LG French door refridgerator', 'Appliance', 2111.00, 4), ('GE glass tove top', 'Appliance', 2500.00, 3), ('Hitachi 52" Flatpanel TV', 'Appliance', 850.00, 25);
INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('Polo neck t-shirt', 'Mens Clothing', 18.00, 50), ('Levi Jeans', 'Mens Clothing', 20.00, 30),("Cool Shades","Mens Clothing",75.00,5),
       ("Worn Denim Jeans","Mens Clothing",54.25,35);
INSERT INTO products (product_name, department_name, price, stock_qty) 
values ("Bill and Ted's Excellent Adventure","Entertainment",15.00,25), ("Mad Max: Fury Road","Entertainment",25.50,57), 
       ("Monopoly","Entertainment",30.50,35), ("Yahtzee","Entertainment",19.95,23);
INSERT INTO products (product_name, department_name, price, stock_qty)
VALUES ('Glad 12 Gal Trash Bags', 'Grocery', 5.99, 300), ('Brawny Paper Towels', 'Grocery', 4.25, 400),
			 ('Tropicana Orange Juice', 'Grocery', 4.45, 267),	('Horizon Organic Milk', 'Grocery', 4.50, 200),
			 ('Charmin Toiler Paper', 'Grocery', 12.99, 575), ('Ben & Jerry Ice Cream', 'Grocery', 3.25, 432);

INSERT INTO departments (dept_name, overhead_costs, dept_sales) 
values ('Books', 1000.00, 0), ('Communication', 15000.00, 0), ('Appliance', 15000.00, 0),
       ('Mens Clothing', 2500.00, 0), ('Entertainment', 5000.00, 0), ('Grocery', 1500.00, 0);

CREATE VIEW totalsales AS SELECT dept, dept_name, overhead_costs, dept_sales, dept_sales-overhead_costs AS profit FROM departments;

