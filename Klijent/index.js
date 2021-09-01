const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const { response } = require("express");
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogled=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(procitajPogled("index"));
});


app.get('/sviProizvodi', (request, response)=>{
    axios.get('http://localhost:5000/sviProizvodi').then(res=>{
        let view='';
        res.data.forEach(element=>{
            view+=`<tr>
            <td>${element.id}</td>
            <td>${element.Kategorija[0].imeKategorije[0]}</td>
            <td>${element.Cena[0]._}</td>
            <td>${element.Cena[0].valuta[0]}</td>
            <td><a href="/editProizvod/${element.id}">Izmeni</a></td>
            <td><a href="/detaljnije/${element.id}">Detaljnije</a></td>
            <td><a href="/deleteProizvod/${element.id}">Izbrisi</a></td>
            </tr>`;
        });
        response.send(procitajPogled("sviProizvodi").replace("#{data}", view));
    }).catch(error=>{
        console.log(error);
    });
});

app.get('/deleteProizvod/:id', (req, res)=>{
    axios.delete(`http://localhost:5000/deleteProizvod/${req.params["id"]}`);
    res.redirect("/sviProizvodi");
})

app.get('/detaljnije/:id', (req, res)=>{
    axios.get(`http://localhost:5000/getProizvod/${req.params["id"]}`).then(response=>{
        let view='';
        view+=`
        <td>Tekst</td>
        <td>Oznaka</td>
        <td>Akcijska cena</td>
        <td>Datum isteka akcije</td>
        </tr>
        <tr>
        <td>${response.data.id}</td>
        <td>${response.data.Kategorija[0].imeKategorije[0]}</td>
        <td>${response.data.Cena[0]._}</td>
        <td>${response.data.Cena[0].valuta}</td>
        <td>${response.data.Tekst}</td>
        <td>${response.data.Oznaka}</td>
        <td>${response.data.Akcija[0].Cena[0]}</td>
        <td>${response.data.Akcija[0].DatumIsteka[0]}</td>
        <td><a href="/editProizvod/${response.data.id}">Izmeni</a></td>
        <td><a href="/deleteProizvod/${response.data.id}">Izbrisi</a></td>
        </tr>`;
        res.send(procitajPogled("sviProizvodi").replace("#{data}", view));
    }).catch(error =>{console.log(error);});
});

app.get('/dodajProizvod', (req, res)=>{
    res.send(procitajPogled("formazadodavanje"));
});

app.post('/sacuvajProizvod', (req, res)=>{
    axios.post('http://localhost:5000/dodajProizvod', {
        Kategorija:[{imeKategorije:[req.body.imeKategorije]}],
        Cena:[{_:req.body.cena,valuta:[req.body.valuta]}],
        Oznaka:[req.body.oznaka],
        Tekst:[req.body.Tekst],
        Akcija:[{Cena:[req.body.cena2],DatumIsteka:[req.body.datumIsteka]}]
    })
    res.redirect("sviProizvodi");
});

app.post('/pretraziPoKategoriji',(req, res)=>{
    axios.get(`http://localhost:5000/pretraziPoKategoriji?imeKategorije=${req.body.imeKategorije}`)
    .then(response=>{
        let view='';
        response.data.forEach(element=>{
            view+=`<tr>
            <td>${element.id}</td>
            <td>${element.Kategorija[0].imeKategorije[0]}</td>
            <td>${element.Cena[0]._}</td>
            <td>${element.Cena[0].valuta[0]}</td>
            <td><a href="/editProizvod/${element.id}">Izmeni</a></td>
            <td><a href="/detaljnije/${element.id}">Detaljnije</a></td>
            <td><a href="/deleteProizvod/${element.id}">Izbrisi</a></td>
            </tr>`;
        });
        res.send(procitajPogled("sviProizvodi").replace("#{data}", view));
    })
});

app.get('/editProizvod/:id', (req, res)=>{
    axios.get(`http://localhost:5000/getProizvod/${req.params["id"]}`).then(response=>{
        let view = '';
        view+=`
        <br>
        Izabrani proizvod: ${response.data.Kategorija[0].imeKategorije[0]}
        <br><br>
        <form action="/sacuvajEditovaniProizvod" method="POST">
            Id proizvoda:  <input name="id" type="text" value="${response.data.id}" readonly>  
            <br><br>
            Ime kategorije: <input name="imeKategorije" type="text" value="${response.data.Kategorija[0].imeKategorije[0]}">
            <br><br>
            Cena proizvoda: <input name="Cena" type="text" value="${response.data.Cena[0]._}">
            <br><br>
            Valuta proizvoda: <input name="Valuta" type="text" value="${response.data.Cena[0].valuta[0]}">
            <br><br>
            Oznaka: <input name="Oznaka" type="text" value="${response.data.Oznaka[0]}">
            <br><br>
            Tekst: <input name="Tekst" type="text" value="${response.data.Tekst[0]}">
            <br><br>
            Akcijska cena: <input name="AkcijaCena" type="text" value="${response.data.Akcija[0].Cena[0]}">
            <br><br>
            Datum isteka akcije: <input name="AkcijaDatum" type="text" value="${response.data.Akcija[0].DatumIsteka[0]}">
            <br><br>
            <button type="submit">Promeni</button>
        </form>`;
        res.send(procitajPogled("sviProizvodi").replace("#{data}", view));
    }).catch(error => {
        console.log(error);
    });
});

app.post('/sacuvajEditovaniProizvod', (req, res)=>{
    axios.post(`http://localhost:5000/editProizvod/${req.body["id"]}/${req.body["imeKategorije"]}/${req.body["Cena"]}
    /${req.body["Valuta"]}/${req.body["Oznaka"]}/${req.body["Tekst"]}/${req.body["AkcijaCena"]}/${req.body["AkcijaDatum"]}`);
    res.redirect("/sviProizvodi");
});
app.listen(port,()=>{console.log(`klijent na portu ${port}`)});