const { response, request } = require('express');
const express = require('express');
var Proizvodi = require('../Proizvodi/proizvodi');
var app = express();
const port = 5000;

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/', (request, response)=>{
    response.send('Server radi');
})

app.get('/sviProizvodi', (request, response)=>{
    response.send(Proizvodi.sviProizvodi());
})

app.post('/dodajProizvod', (request, response)=>{
    Proizvodi.dodajProizvod(request.body);
    response.end('ok');
})

app.post('/editProizvod/:id/:imeKategorije/:Cena/:Valuta/:Oznaka/:Tekst/:AkcijaCena/:AkcijaDatum', (request, response)=>{
    Proizvodi.editProizvod(request.params["id"], request.params["imeKategorije"], request.params["Cena"],
    request.params["Valuta"], request.params["Oznaka"], request.params["Tekst"], request.params["AkcijaCena"],
    request.params["AkcijaDatum"]);
     response.end('ok');
})

app.delete('/deleteProizvod/:id', (request, response)=>{
    Proizvodi.deleteProizvod(request.params['id']);
    response.end('ok');
})

app.get('/pretraziPoKategoriji', (request, response)=>{
    response.send(Proizvodi.pretraziPoKategoriji(request.query['imeKategorije']));
})

app.get('/getProizvod/:id', (request, response)=>{
    response.send(Proizvodi.getProizvod(request.params['id']));
})

app.listen(port, ()=>{console.log(`startovan server na portu ${port}`)})