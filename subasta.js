var casper = require('casper').create();
var fs = require('fs');
var listSubasta = [];

function getDatosSubastas() {
    var subasta = {};
    var titles = document.querySelectorAll('.datosSubastas tr th');
    var contents = document.querySelectorAll('.datosSubastas tr td');
    var arrayTitles = Array.prototype.map.call(titles, function(e) {
        console.log(e.textContent);
        return e.textContent;
    });
    var arrayContents = Array.prototype.map.call(contents, function(e) {
        console.log(e.textContent);
        return e.textContent;
    });
    arrayTitles.forEach(function(elem, index) {
        console.log(elem,": ", arrayContents[index]);
        var key = elem.split(' ').join('').replace('ó','o').replace('í','i').trim();
        subasta[key] = arrayContents[index].trim();
    });
    return subasta;
}
function getDatosAutoridadGestora() {
    var subasta = {};
    var titles = document.querySelectorAll('.datosSubastas tr th');
    var contents = document.querySelectorAll('.datosSubastas tr td');
    var arrayTitles = Array.prototype.map.call(titles, function(e) {
        console.log(e.textContent);
        return e.textContent;
    });
    var arrayContents = Array.prototype.map.call(contents, function(e) {
        return e.textContent;
    });
    arrayTitles.forEach(function(elem, index) {
        console.log(elem,": ", arrayContents[index]);
        var key = elem.split(' ').join('').replace('ó','o').replace('í','i').trim();
        subasta[key] = arrayContents[index].trim();
    });
    return subasta;
}

function getLinks() {
    var links = document.querySelectorAll('#map area');
    return Array.prototype.map.call(links, function(e) {
        return  { href: e.getAttribute('href'), alt: e.getAttribute('alt'),
        province: e.getAttribute('alt').split('(')[0].trim(), 
        quantity: parseInt(e.getAttribute('alt').split('(')[1].replace(')').trim() )};

    });
}

function getLinksCity() {
    var links = document.querySelectorAll('.resultado-busqueda .enlacesMas a.resultado-busqueda-link-defecto');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');

    });
}

function hasNextPage() {
    var links = document.querySelectorAll('.pagSig');
    var sig =  Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');

    });
    return sig.length > 0;
}

function getNextLinkPage() {
    var links = document.querySelectorAll('.paginar2 li a');
    var sig =  Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
    return sig.pop();
}

function hasBienes() {
    var links = document.querySelectorAll('ul.navlist li a');
    var sig =  Array.prototype.map.call(links, function(e) {
        return e.textContent;
    });
    
    return sig[2] == 'Bienes';
}

function openSubasta(url) {
    casper.thenOpen(domain + linkCity.substring(1), function() {
        casper.waitForSelector('.bloqueSubasta', function() {
            // this.capture('subasta' + index + index2 + '.png', {
            //     top: 0,
            //     left: 0,
            //     width: 1000,
            //     height: 1000
            // });
            var subastaInfo = this.evaluate(getDatosSubastas);
            subastaInfo.link = this.getCurrentUrl();
            // console.log(JSON.stringify(subastaInfo));
            listSubasta.push(subastaInfo);
            progress++;
            fs.write("log", ' { "total": ' + total + ', "progress":'+ progress + ' } ', 'w');
            fs.write("subasta.json", JSON.stringify(listSubasta), 'w');
        });
    });
}

casper.start('https://subastas.boe.es/', function() {
    this.echo(this.getTitle());
    links = this.evaluate(getLinks);
    var total = 0;
    var progress = 1;
    links.forEach(function(link, index) { 
        total += link.quantity;
    });

    links.forEach(function(link, index) {
        var domain = 'https://subastas.boe.es';
        casper.thenOpen(domain + link.href, function() {
            var linkCities = this.evaluate(getLinksCity);
            this.echo(link.alt);
            fs.write("log", '', 'w');
            //fs.write("./src/assets/log", ' {"province": "' + link.province + '", "quantity": ' + link.quantity + ' }', '+w');
            linkCities.forEach(function(linkCity, index2) {
                var urlCity = domain + linkCity.substring(1);
                casper.thenOpen(urlCity, function() {                
                    casper.waitForSelector('.bloqueSubasta', function() {
                        var bienes = this.evaluate(hasBienes);
                        //console.log( " --bienes " , bienes , " --url ", urlCity);
                        var subastaInfo = this.evaluate(getDatosSubastas);
                        subastaInfo.link = this.getCurrentUrl();
                        casper.thenOpen(urlCity + '&ver=2', function() {
                            casper.waitForSelector('.datosSubastas', function() {
                                var autoridadGestora = this.evaluate(getDatosSubastas);
                                subastaInfo.Tipodesubasta = autoridadGestora.Descripcion.toLowerCase().split('mercantil').length > 1 ? 'mercantil' : subastaInfo.Tipodesubasta;
                                subastaInfo.province = link.province;
                                listSubasta.push(subastaInfo);
                                progress++;
                                fs.write("log", '{ "total": ' + total + ', "progress": ' + progress+ ', "province": "' + link.province + '" }', 'w');
                                fs.write("subasta.json", JSON.stringify(listSubasta), 'w');
                            });
                        });
                        // console.log(JSON.stringify(subastaInfo));
                        
                        
                    });
                }); 
            });
            var nextPage = this.evaluate(hasNextPage); 
            if (nextPage) {
                var link2 = this.evaluate(getNextLinkPage);
                casper.thenOpen(domain + '/' +link2.replace('40-40', '40-1000'), function() {
                    casper.waitForSelector('.listadoResult', function() {

                        var linkCitiesNext = this.evaluate(getLinksCity);
                        linkCitiesNext.forEach(function(linkCityNext, index2) {

                            casper.thenOpen(domain + linkCityNext.substring(1), function() {
                                casper.waitForSelector('.bloqueSubasta', function() {
                                    // this.capture('subasta-' + index + index2 + '.png', {
                                    //     top: 0,
                                    //     left: 0,
                                    //     width: 1000,
                                    //     height: 1000
                                    // });
                                    var subastaInfo = this.evaluate(getDatosSubastas);
                                    subastaInfo.link = this.getCurrentUrl();
                                    subastaInfo.province = link.province;
                                    listSubasta.push(subastaInfo);
                                    //console.log(JSON.stringify(subastaInfo));
                                    progress++;
                                    fs.write("log", ' { "total": ' + total + ', "progress":' + progress + ' } ', 'w');
                                    fs.write("subasta.json", JSON.stringify(listSubasta), 'w');
                                });
                            });

                        });
                    });
                });
            }
        });
    });
    fs.write("subasta.json", JSON.stringify(listSubasta), 'w');
});

casper.run();
