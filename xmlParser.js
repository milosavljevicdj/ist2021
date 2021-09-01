const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const xml = fs.readFileSync('proizvodi.xml');
const parser = new xml2js.Parser();

xml2js.parseString(xml, {mergeAttrs:true}, (err, result)=>{
    if(err) throw err;
    const json = JSON.stringify(result, null, 4);
    fs.writeFileSync('proizvodi.json', json);
})