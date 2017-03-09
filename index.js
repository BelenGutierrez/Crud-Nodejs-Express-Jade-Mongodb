var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;

var app = express()

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

var dbUrl = 'mongodb://localhost:27017/gestion'

app.get('/', function (req, res) {
  //res.send('Hello World')
  /*
  let datos = [
    {
      nombre: "Paco",
      apellido: "Muñoz",
      edad: 45,
      pais: "Austria"
    },
    {
      nombre: "Anna",
      apellido: "Grisburg",
      edad: 65,
      pais: "Suecia"
    }
  ]*/

  mongodb.connect(dbUrl, function(err, db){
    let datos = {};
    db.collection('usuarios').find().toArray(function(err, docs) {
      datos.usuarios = docs;
      res.render('index', datos);
    });
  });
});

app.get('/formulario', function (req, res) {
  res.render('formulario');
});

app.post('/insertar', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){
    datos = {};

    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;

    db.collection('usuarios').insert(usuario);

    res.render('insertar', datos);
  });
});

app.post('/modificar', function (req, res) {
   datos = {};

   console.log(req.body);

   if(req.body.pais == "undefined"){
     pais = "";
   }else{
     pais = req.body.pais;
   }

   if(req.body.apellido == "undefined"){
     apellido = "";
   }else{
     apellido = req.body.apellido;
   }

   if(req.body.nombre == "undefined"){
     nombre = "";
   }else{
     nombre = req.body.nombre;
   }
   

   let usuario = {
      _id : req.body._id,
      nombre: nombre,
      apellido: apellido,
      edad: req.body.edad,
      pais: pais
   };

   datos.usuario = usuario;

   //console.log(datos);
  res.render('modificar', datos);
});

app.post('/usuario-modificado', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){;

    datos = {};

    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;
    //console.log("{_id: ObjectId('"+ req.body._id + "')}");
     db.collection('usuarios').find({_id: ObjectId(req.body._id)}).toArray(function(err, p){
       // console.log(p);
        p[0].nombre = req.body.nombre,
        p[0].apellido= req.body.apellido,
        p[0].edad= req.body.edad,
        p[0].pais= req.body.pais
        

       // console.log(p);
        //console.log(p[0]);
        db.collection('usuarios').update({_id: ObjectId(req.body._id)},p[0]);
     });
    
   /* db.collection('usuarios').update(id,p);*/

    res.render('usuario-modificado', datos);
  });
});

app.post('/eliminar', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){

    let borrado = {
      _id: new mongodb.ObjectID(req.body._id)
    };

    db.collection('usuarios').remove(borrado)

    res.render('eliminar');
  });
});

app.listen(8080, function () {
  console.log('Servidor escuchando en http://localhost:8080')
})