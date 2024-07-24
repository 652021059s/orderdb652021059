'use strict';
const express = require('express');
const crypto = require('crypto');
const wrRoute = express.Router();
const connection = require('../db');

wrRoute.post('/orders', function (req, res, next) {
    let mypass = crypto.createHash('md5').update(req.body.password).digest("hex");
  
    connection.execute(
        `INSERT INTO orders (order_id	, customer_name, product, quantity, order_date, status) 
         VALUES (?, ?, ?, ?, NOW(), ?);`,
        [req.body.order_id, req.body.customer_name, req.body.product, req.body.quantity]
    ).then(() => {
        console.log(' inserted successfully');
        res.status(201).send("Insert Successfully.");
    }).catch((err) => {
        console.error('Error inserting :', err);
        res.status(500).send("Error inserting .");
    });
});


wrRoute.get('/orders', function (req, res, next) {
    connection.execute('SELECT * FROM orders;')
        .then((result) => {
            var rawData = result[0];
            res.send(JSON.stringify(rawData));
        }).catch((err) => {
            console.error('Error fetching users:', err);
            res.status(500).send("Error fetching users.");
        });
});


wrRoute.post('/check', function (req, res, next) {
    let mypass = crypto.createHash('md5').update(req.body.password).digest("hex");
    
    connection.execute('SELECT * FROM orders WHERE order_id=? AND customer_name=?;',
    [req.body.username, mypass]).then((result) => {
        var data = result[0];
        if (data.length === 0) {
           res.sendStatus(400);
        } else {
           res.sendStatus(200); 
        }
     }).catch((err) => {
        console.error('Error checking :', err);
        res.status(500).send("Error checking .");
     });
 });
wrRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
});

module.exports = wrRoute;
