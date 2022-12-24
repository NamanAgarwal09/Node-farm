const http = require('http');
const fs = require('fs');
const url = require('url');

//Fetching Data
const data = fs.readFileSync('./data.json', 'utf-8');
const dataObj = JSON.parse(data);

const TempOverview = fs.readFileSync('./Blog-overview.html', 'utf-8');
const TempCard = fs.readFileSync('./Blog-Template.html', 'utf-8');
const TempProduct = fs.readFileSync('./Blog-Product.html', 'utf-8');

//replace template data with data in json file
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%BLOGNAME%}/g, product.blogname);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%AUTHOR%}/g, product.Author);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%DATE%}/g, product.Date);
    output = output.replace(/{%LASTUPDATE%}/g, product.lastUpdate);
    output = output.replace(/{%DISCRIPTION%}/g, product.discription);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const server = http.createServer((req, res) => {
    const pathname = (req.url);
    const query = new URL(req.url, 'http://localhost:8000');  
    console.log(query.searchParams);
    console.log(query);

    // console.log(pathname);

    //Overview Page
    if (pathname == '/overview' || pathname == '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        // console.log(cardHtml);
        const cardHtml = dataObj.map(el => replaceTemplate(TempCard, el)).join(''); //el here holds data from data.json
        const output = TempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);
    }

    //Blog Page
    else if (pathname == '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        console.log(query.searchParams);
        console.log(query);
        const product = dataObj[query.id];
        const output = TempCard.replaceTemplate(TempProduct, product);
        res.end(output);

    }

    //API
    else if (pathname == '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.write(data);
        res.end();
    }

    //Not Found
    else {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.write('<h1>Page not is  found</h1>');
        res.end();
    }
});

server.listen('8090', '127.0.0.1', () => {
    console.log('listing radio on 8090');
});