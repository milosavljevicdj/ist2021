const fs = require('fs');
const putanja = "../Server/proizvodi.json";

let procitajIzFajla = () =>{
    let proizvodi = fs.readFileSync(putanja, (err, data)=>{
        if(err) throw err;
        return data;
    });
    return JSON.parse(proizvodi);
}

let sacuvajProizvode = (data) =>{
    fs.writeFileSync(putanja, JSON.stringify(data));
}

exports.sviProizvodi=()=>{
    return procitajIzFajla();
}

exports.dodajProizvod=(noviProizvod)=>{
    let id = 1;
    let proizvodi = this.sviProizvodi();
    if(proizvodi.length>0){
        id = proizvodi[proizvodi.length-1].id+1;
    }
    noviProizvod.id = id;
    proizvodi.push(noviProizvod);
    sacuvajProizvode(proizvodi);
}

exports.getProizvod = (id) =>{
    return this.sviProizvodi().find(x => x.id==id);
}

exports.editProizvod = (id, imeKategorije, Cena, Valuta, Oznaka, Tekst, AkcijaCena, AkcijaDatum)=>{
    let proizvodi = this.sviProizvodi();
    proizvodi.forEach(element => {
        if(element.id == id){
            element.Kategorija[0].imeKategorije[0] = imeKategorije;
            element.Cena[0]._ = Cena;
            element.Cena[0].valuta[0] = Valuta;
            element.Oznaka[0] = Oznaka;
            element.Tekst[0] = Tekst;
            element.Akcija[0].Cena[0] = AkcijaCena;
            element.Akcija[0].DatumIsteka[0] = AkcijaDatum
        };
    });
    sacuvajProizvode(proizvodi);
}

exports.deleteProizvod = (id) =>{
    sacuvajProizvode(this.sviProizvodi().filter(x => x.id != id));
}

exports.pretraziPoKategoriji = (imeKategorije) =>{
    return this.sviProizvodi().filter(x => x.Kategorija[0].imeKategorije[0] == imeKategorije);
} 
