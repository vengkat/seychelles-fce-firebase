'use strict'
const functions = require('firebase-functions');
const express = require('express');
const engine = require('ejs-locals');
const path = require('path')
const bodyParser = require('body-parser');
var firebase = require("firebase");
const admin = require("firebase-admin");
//var morgan = require('morgan');
//var fs = require('fs')
const serviceAccount = require(__dirname+"/seychelles-dev-env-firebase-adminsdk-alaas-aa6ed2d677.json");
const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
//var accessLogStream = fs.createWriteStream(path.join(__dirname+'/Logs/', 'logs.log'), { flags: 'a' })
//app.use(morgan('combined', { stream: accessLogStream }));

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var config = {
    projectId:"seychelles-dev-env",
    apiKey: "AIzaSyBaE4VqLu8JGgUkQiSO5pv52TCyh-H93zY",
    authDomain: "seychelles-dev-env.firebaseapp.com",
    databaseURL: "https://seychelles-dev-env.firebaseio.com",
    storageBucket: "gs://seychelles-dev-env.appspot.com",
    credential: admin.credential.cert(serviceAccount)
  };
  firebase.initializeApp(config);
  const db = firebase.firestore();

const CurrencyRef = db.collection('CurrencyMaster');
const InvoiceRef = db.collection('InvoiceMaster');
const PORef = db.collection('PurchaseMaster');


app.get('/',(request,response) => {
    let InvoiceOrderList = [];
    let PurchaseOrderList = [];
    InvoiceRef.orderBy("OrderNo").get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          InvoiceOrderList.push(doc.data());                                 
       });           
          PORef.orderBy("OrderNo").get()
          .then(snapshot => {                              
             snapshot.forEach(doc => {
                PurchaseOrderList.push(doc.data());                                 
             });           
             //console.log(PurchaseOrderList);   
             res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList,PurchaseOrderList : PurchaseOrderList};  
             res.render("Home");                                                            
          })                                                            
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList};  
       res.render("Home"); 
    });  
});

app.get('/Home', function (req, res) {
    let InvoiceOrderList = [];
    let PurchaseOrderList = [];
    InvoiceRef.orderBy("OrderNo").get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          InvoiceOrderList.push(doc.data());                                 
       });           
          PORef.orderBy("OrderNo").get()
          .then(snapshot => {                              
             snapshot.forEach(doc => {
                PurchaseOrderList.push(doc.data());                                 
             });           
             //console.log(PurchaseOrderList);   
             res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList,PurchaseOrderList : PurchaseOrderList};  
             res.render("Home");                                                            
          })                                                            
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList};  
       res.render("Home"); 
    });  
 })
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//Selling - Begins
app.get('/CreateBuying', function (req, res) {   
    res.locals = {title : "Create Buying"}; 
    res.render("CreateBuying");
 })
 
 app.get('/ViewPurchase/:orderNo', function (req, res) {   
    let orderNo = parseInt(req.params.orderNo);
    let PurchaseOrderList = [];
    PORef.where("OrderNo", "==", orderNo).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          PurchaseOrderList.push(doc.data());                                 
       });           
       //console.log("list: ", PurchaseOrderList);
       res.locals = {title : "Purchase Order Details",PurchaseOrderList:PurchaseOrderList};
       res.render("ViewPurchase");                                                              
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.send(err);
    }); 
 })
 
 app.get('/CreateSelling', function (req, res) {   
    res.locals = {title : "Selling"}; 
    res.render("CreateSelling");
 })
 
 app.get('/ViewSold/:orderNo', function (req, res) {   
    let orderNo = parseInt(req.params.orderNo);
    //console.log("list: ", orderNo);
    let InvoiceOrderList = [];
    InvoiceRef.where("OrderNo", "==", orderNo).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          InvoiceOrderList.push(doc.data());                                 
       });           
       //console.log("list: ", InvoiceOrderList);
       res.locals = {title : "View Invoice",InvoiceOrderList:InvoiceOrderList};
       res.render("ViewSold");                                                              
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.send(err);
    }); 
 })
 //Selling - Ends
 
 
 //CurrencyMaster -- Begins
  app.get('/CurrencyMaster', function (req, res) {
    let list = [];
    CurrencyRef.orderBy("Name").get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          let data = doc.data();
          data.Id=doc.id;
          list.push(data);                                 
       });           
       //console.log(list);   
       res.locals = {title : "Currency Rate",currencyList : list};    
       res.render("CurrencyMaster");                                                            
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.locals = {title : "Currency Rate",currencyList : list};   
       res.render("CurrencyMaster"); 
    });  
  })
 
 
  //CurrencyMaster -- Ends
  app.get('/Exchange', function (req, res) {
     res.sendFile( __dirname + "/" + "src/template/ExchangeCurrency.html" );
  })
 
  //API Services
 
   //Get Purchase Order Details
   app.get('/api/Orders/InvoiceOrderList/', function (req, res) {
    res.send(InvoiceOrderList);
 })
 
  //Get Currency Details
  app.get('/api/Currency/GetCurrencyList/', function (req, res) {
    console.log("Getting currency list");   
    let list = [];   
    CurrencyRef.get()
             .then(snapshot => {                              
                snapshot.forEach(doc => {
                   let data =    doc.data();
                   data.Id  =  doc.id;
                   //console.log("data: ", data);        
                   list.push(data);                    
                });           
                console.log(list);   
                res.send(list);                                                                
             })
             .catch(err => {
                //console.log('Error getting documents', err);
                res.send(err);
             });      
 });
 
 //Get Currency Details by ID
  app.get('/api/Currency/GetCurrencyList/:id', function (req, res) {
    let id =req.params.id;
    //console.log("ID - "+id); 
    let list = [];
     
       CurrencyRef.doc(id).get()
       .then(function(doc) {
          if (doc.exists) {
             //console.log("Document data:", doc.data());
             let data = doc.data();
             data.Id = id;
             res.send(data); 
          } else {
             //console.log("No such document!");
             res.send("No such document!");
          }
       }).catch(function(error) {
          //console.log("Error getting document:", error);
       });
 })
 
 //============================================================================================================
 
 //Create Purchase Order
 app.post('/api/Currency/CreateBuying/',function(req, res){
   
    let OrderDetails = {
      "OrderNo"  :  0,
      "CurrencyFrom"  : req.body.CurrencyFrom, 
      "CurrencyTo" : req.body.CurrencyTo,
      "Quantity" : req.body.Quantity,
      "Rate" : req.body.Rate,
      "AmountReceived" : req.body.AmountReceived,
      "CustomerName" : req.body.CustomerName,
      "PassportNumber":req.body.PassportNumber,
      "Address"  : req.body.Address,
      "Country":req.body.Country,
      "NIN":req.body.NIN,
      "PhoneNumber":req.body.PhoneNumber
  };
  
    let InvoiceOrderList = {};
    let orderNo = 0;
    //console.log('OrderDetails - '+OrderDetails);
    PORef.orderBy('OrderNo','desc').limit(1).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          InvoiceOrderList = doc.data();        
       });           
       OrderDetails.OrderNo = parseInt(InvoiceOrderList.OrderNo) + 1;      
       var addDoc = PORef.add(OrderDetails).then(ref => {
        //console.log('Added document with ID: '+ ref.id);
        res.send("Success");
      }).catch(err => {
        //console.log('Error adding documents - '+ err);
        res.send(err);
     });                                                   
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.send(err);
    }); 
 });
 
 //Create Invoice Order
 app.post('/api/Currency/CreateSelling/',function(req, res){
  
   let OrderDetails = {
      "OrderNo"  :  0,
      "CurrencyFrom"  : req.body.CurrencyFrom, 
      "CurrencyTo" : req.body.CurrencyTo,
      "Quantity" : req.body.Quantity,
      "Rate" : req.body.Rate,
      "AmountReceived" : req.body.AmountReceived,
      "CustomerName" : req.body.CustomerName,
      "PassportNumber":req.body.PassportNumber,
      "Address"  : req.body.Address,
      "Country":req.body.Country,
      "NIN":req.body.NIN,
      "PhoneNumber":req.body.PhoneNumber
  };
  
    let InvoiceOrderList = {};
    let orderNo = 0;
    console.log('OrderDetails - '+OrderDetails);
    InvoiceRef.orderBy('OrderNo','desc').limit(1).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          InvoiceOrderList = doc.data();        
       });           
       OrderDetails.OrderNo = parseInt(InvoiceOrderList.OrderNo) + 1;      
       var addDoc = InvoiceRef.add(OrderDetails).then(ref => {
        console.log('Added document with ID: '+ ref.id);
        res.send("Success");
      }).catch(err => {
        console.log('Error adding documents - '+ err);
        res.send(err);
     });                                                   
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.send(err);
    }); 
 });
 
 
 /*
 async function InsertInvoiceData(OrderDetail,response){
    var addDoc = await InvoiceRef.add({
       OrderNo  :  OrderDetail.OrderNo,
       CurrencyId  :  1, 
       CurrencyName   :  OrderDetail.CurrencyName,
       FM : OrderDetail.FM,
       Amount   :  OrderDetail.Amount,
       Rate  :  OrderDetail.Rate,
       AmountReceived :  OrderDetail.AmountReceived,
       CustomerName : OrderDetail.CustomerName,
       Address  :{
          AddressLine1   :  OrderDetail.Address.AddressLine1,
          AddressLine2   :  OrderDetail.Address.AddressLine2,
          AddressLine3   :  OrderDetail.Address.AddressLine3
       }
     }).then(ref => {
       //console.log('Added document with ID: ', ref.id);
       response.send("Success");
     }).catch(err => {
       //console.log('Error adding documents', err);
       res.send(err);
    });
 }
 */

 //Update currency details
 app.post('/api/Currency/UpdateCurrencyDetails/',function(req, res){
   res.setHeader("Content-Type","application/json");
    let CurrencyDetails = JSON.parse(JSON.stringify(req.body.CurrencyDetails));

    CurrencyRef.doc(CurrencyDetails.Id).set({
      Name : CurrencyDetails.Name,
      Code : CurrencyDetails.Code,
      Value :CurrencyDetails.Value
     }).then(ref => {
      console.log('Document updated: ', ref.id);
      res.statusCode = 200;
      //res.json({"status":"Success"});
      res.sendStatus(200);
    }).catch(err => {
      console.log('Error adding documents', err);
      res.sendStatus(400) 
   });
 });

exports.app = functions.https.onRequest(app);