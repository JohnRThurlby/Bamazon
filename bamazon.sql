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
  item INTEGER(11) AUTO_INCREMENT NOT NULL,
  dept_name VARCHAR(50) NOT NULL,
  overhead_costs DECIMAL(10,2) DEFAULT 0 NOT NULL,
  dept_sales DECIMAL(10,2) DEFAULT 0 NOT NULL,
  total_profits DECIMAL(10,2) DEFAULT 0 NOT NULL,
  PRIMARY KEY (item)
);

INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('Pride and Prejudice', 'Books', 11.00, 25), ('War and Peace', 'Books', 22.00, 15), ('McBeth', 'Books', 15.00, 10);
INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('Samsung Galaxy S9', 'Communication', 631.00, 100), ('iPhone X', 'Communication', 900.00, 25);
INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('LG French door refridgerator', 'Appliance', 2111.00, 4), ('GE glass tove top', 'Appliance', 2500.00, 3), ('Hitachi 52" Flatpanel TV', 'Appliance', 850.00, 25);
INSERT INTO products (product_name, department_name, price, stock_qty) 
values ('Polo neck t-shirt', 'Clothing', 18.00, 50), ('Levi Jeans', 'Clothing', 20.00, 30);

INSERT INTO departments (dept_name, overhead_costs, dept_sales, total_profits) 
values ('Books', 10000.00, 0, 0), ('Communication', 15000.00, 0, 0), ('Appliance', 15000.00, 0, 0), ('Clothing', 5000.00, 0, 0);
