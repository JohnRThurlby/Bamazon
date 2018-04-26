DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INTEGER(11),
  stock_qty INTEGER(11),  
  PRIMARY KEY (item)
);

INSERT INTO products (product_name, department_name, price, stock_qty) values ('Pride and Prejudice', 'Books', 11.00, 25);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('War and Peace', 'Books', 22.00, 15);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('McBeth', 'Books', 15.00, 10);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('Samsung Galaxy S9', 'Communication', 631.00, 100);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('iPhone X', 'Communication', 900.00, 25);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('LG French door refridgerator', 'Appliance', 2111.00, 4);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('GE glass tove top', 'Appliance', 2500.00, 3);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('Hitachi 52" Flatpanel TV', 'Appliance', 850.00, 25);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('Polo neck t-shirt', 'Clothing', 18.00, 50);
INSERT INTO products (product_name, department_name, price, stock_qty) values ('Jeans', 'Clothing', 20.00, 30);
