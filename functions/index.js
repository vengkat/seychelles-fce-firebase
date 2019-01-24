const functions = require('firebase-functions');
const express = require('express');
const engine = require('ejs-locals');
const path = require('path')
const bodyParser = require('body-parser');
var firebase = require("firebase");
const admin = require("firebase-admin");
const serviceAccount = require(__dirname+"/seychelles-dev-env-firebase-adminsdk-alaas-aa6ed2d677.json");
const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


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
const PORef = db.collection('POMaster');


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

app.get('/timestamp',(request,response) => {
    response.send(`${Date.now()}`);
});

app.get('/timestamp-cached',(request,response) => {
    response.set('Cache-Control','public, max-age=300','s-maxage=600');
    response.send(`${Date.now()}`);
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
             console.log(PurchaseOrderList);   
             res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList,PurchaseOrderList : PurchaseOrderList};  
             res.render("Home");                                                            
          })                                                            
    })
    .catch(err => {
       console.log('Error getting documents', err);
       res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList};  
       res.render("Home"); 
    });  
 })
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//Invoice - Begins
app.get('/CreatePO', function (req, res) {   
    res.locals = {title : "Create PO"}; 
    res.render("CreatePO");
 })
 
 app.get('/ViewPO/:orderNo', function (req, res) {   
    let orderNo = parseInt(req.params.orderNo);
    let PurchaseOrderList = [];
    PORef.where("OrderNo", "==", orderNo).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          PurchaseOrderList.push(doc.data());                                 
       });           
       //console.log("list: ", PurchaseOrderList);
       res.locals = {title : "Purchase Order Details",PurchaseOrderList:PurchaseOrderList};
       res.render("ViewPO");                                                              
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.send(err);
    }); 
 })
 
 app.get('/CreateInvoice', function (req, res) {   
    res.locals = {title : "Create Invoice"}; 
    res.render("CreateInvoice");
 })
 
 app.get('/ViewInvoice/:invoiceNo', function (req, res) {   
    let invoiceNo = parseInt(req.params.invoiceNo);
    let InvoiceOrderList = [];
    InvoiceRef.where("OrderNo", "==", invoiceNo).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          InvoiceOrderList.push(doc.data());                                 
       });           
       //console.log("list: ", InvoiceOrderList);
       res.locals = {title : "View Invoice",InvoiceOrderList:InvoiceOrderList};
       res.render("ViewInvoice");                                                              
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.send(err);
    }); 
 })
 //Invoice - Ends
 
 
 //CurrencyMaster -- Begins
  app.get('/CurrencyRate', function (req, res) {
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
       res.render("CurrencyDetails");                                                            
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.locals = {title : "Currency Rate",currencyList : list};   
       res.render("CurrencyDetails"); 
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
 app.post('/api/Currency/CreatePO/:OrderDetail',function(req, res){
    let OrderDetail = JSON.parse(req.params.OrderDetail);
    console.log('CreatePO :: OrderDetail', OrderDetail);
    let PurchaseOrderList = {};
    let orderNo = 0;
    PORef.orderBy('OrderNo','desc').limit(1).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          PurchaseOrderList = doc.data();    
          console.log("PurchaseOrderList: ", PurchaseOrderList);                          
       });           
       OrderDetail.OrderNo = parseInt(PurchaseOrderList.OrderNo) + 1;      
       //console.log("list: ", orderNo);      
       //InsertPOData(OrderDetail,res);      
       var addDoc = PORef.add({
        OrderNo  :  OrderDetail.OrderNo,
        CurrencyId  :  1, 
        CurrencyName   :  OrderDetail.CurrencyName,
        FMTC : OrderDetail.FMTC,
        Amount   :  OrderDetail.Amount,
        Rate  :  OrderDetail.Rate,
        AmountPaid :  OrderDetail.AmountPaid,
        CustomerName : OrderDetail.CustomerName,
        Address  :{
           AddressLine1   :  OrderDetail.Address.AddressLine1,
           AddressLine2   :  OrderDetail.Address.AddressLine2,
           AddressLine3   :  OrderDetail.Address.AddressLine3
        }
      }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        res.send("Success");
      }).catch(err => {
        console.log('Error adding documents', err);
        res.send(err);
     });                                               
    })
    .catch(err => {
       //console.log('Error getting documents', err);
       res.send(err);
    }); 
 });
 
 //Create Invoice Order
 app.post('/api/Currency/CreateInvoice/:OrderDetail',function(req, res){
    let OrderDetail = JSON.parse(req.body.OrderDetail);
    console.log("CreateInvoice :: OrderDetail - ", OrderDetail);
    let InvoiceOrderList = {};
    let orderNo = 0;
    InvoiceRef.orderBy('OrderNo','desc').limit(1).get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          InvoiceOrderList = doc.data();    
                                   
       });           
       OrderDetail.OrderNo = parseInt(InvoiceOrderList.OrderNo) + 1;      
       console.log("orderNo: ", orderNo);
       //InsertInvoiceData(OrderDetail,res);  
       var addDoc = InvoiceRef.add({
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
        console.log('Added document with ID: ', ref.id);
        res.send("Success");
      }).catch(err => {
        console.log('Error adding documents', err);
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
 app.post('/api/Currency/UpdateCurrencyDetails/:currency',function(req, res){
    const currency = JSON.parse(req.params.currency);
    CurrencyRef.doc(currency.Id).set({
       Name :   currency.Name,
       BuyingMin :    currency.BuyingMin,
       SellingMax :   currency.SellingMax
     });
    res.send("Success");
 });

exports.app = functions.https.onRequest(app);
/*
exports.InsertPOData = async function InsertPOData(OrderDetail,response){    
    console.log("InsertPOData :: OrderDetail - " + OrderDetail);
    var addDoc = await PORef.add({
       OrderNo  :  OrderDetail.OrderNo,
       CurrencyId  :  1, 
       CurrencyName   :  OrderDetail.CurrencyName,
       FMTC : OrderDetail.FMTC,
       Amount   :  OrderDetail.Amount,
       Rate  :  OrderDetail.Rate,
       AmountPaid :  OrderDetail.AmountPaid,
       CustomerName : OrderDetail.CustomerName,
       Address  :{
          AddressLine1   :  OrderDetail.Address.AddressLine1,
          AddressLine2   :  OrderDetail.Address.AddressLine2,
          AddressLine3   :  OrderDetail.Address.AddressLine3
       }
     }).then(ref => {
       console.log('Added document with ID: ', ref.id);
       response.send("Success");
     }).catch(err => {
       console.log('Error adding documents', err);
       res.send(err);
    });
 }
*/