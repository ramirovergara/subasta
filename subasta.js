var url = 'https://subastas.boe.es/detalleSubasta.php?idSub=SUB-JA-2018-105524&idBus=_enV4d1NmaTlNZW1kRzMxTE5PdDlEN01RaGRXbVFjY2p6T3V5dEZyblJGOUNTakR0V2NCcGwyQjZob3Q2SlZ6M0luNERCRVFubituOFlKVDB0NG80OEV2YzZPOTNqMlBJeTRLb3BYc3FPY0NnM1IrcmlhQWtPQ3ZySDRuMCtqQzR0YjRSb0RFTnNhYkQvOWh3UDFydlphVno3eGJ1a0grTjZrWktnUGNmbXM0eksyN3dHK25NZFhsSEFyekU5KzRSM2pDOEIwcmsyS1pzbUxFSmxVVUI0ZGFLRkI2ekRoVUw0TGlWd2lyWFprdmpMQzN4Vnh1S0tGclRReWVpa05CK2ZVaE9xUEcvbUlnZWxGYUt1MXhjNnJFTXZsbWp4UVFpRGUyeDdDbDdNa3M9';
var casper = require('casper').create();
var fs = require('fs');
var listSubasta = [];
// casper.start('http://casperjs.org/', function() {
//     this.echo(this.getTitle());
//     this.capture('google.png', {
//         top: 100,
//         left: 100,
//         width: 500,
//         height: 400
//     });
// });

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

function getLinks() {
    var links = document.querySelectorAll('#map area');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');

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

casper.start('https://subastas.boe.es/', function() {
    this.echo(this.getTitle());
    this.capture('google.png', {
        top: 200,
        left: 400,
        width: 700,
        height: 700
    });
    links = this.evaluate(getLinks);
    this.log('and an informative one', 'info');
    console.log('links: ', links.length);
    links.forEach(function(link, index) {
        var domain = 'https://subastas.boe.es';
        casper.thenOpen(domain + link, function() {
            // this.echo(index);
            // this.capture('subasta' + index + '.png', {
            //     top: 100,
            //     left: 100,
            //     width: 500,
            //     height: 400
            // });
            var linkCities = this.evaluate(getLinksCity);
            this.echo(linkCities.length);
            linkCities.forEach(function(linkCity, index2) {
                //console.log(domain + linkCity);
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
                        fs.write("./subasta-app/src/assets/subasta.json", JSON.stringify(listSubasta), 'w');
                    });
                });
            });
            var nextPage = this.evaluate(hasNextPage); 
            if (nextPage) {
                this.echo('truee');
                // this.captureSelector('.listadoResult', 'html');
                var link2 = this.evaluate(getNextLinkPage);
                console.log(link2);
                casper.thenOpen(domain + '/' +link2.replace('40-40', '40-1000'), function() {
                    casper.waitForSelector('.listadoResult', function() {

                        var linkCitiesNext = this.evaluate(getLinksCity);
                        this.echo(linkCitiesNext.length);
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
                                    //console.log(JSON.stringify(subastaInfo));
                                    fs.write("./subasta-app/src/assets/subasta.json", JSON.stringify(subastaInfo), 'w');
                                    listSubasta.push(subastaInfo);
                                });
                            });

                        });
                    });
                });
            }
        });
        //console.log('link: ', link, ' : ',casper.getTitle());
    });
    fs.write("./subasta-app/src/assets/subasta.json", JSON.stringify(listSubasta), 'w');
});

// casper.thenOpen('http://phantomjs.org', function() {
//     this.echo(this.getTitle());
// });

casper.run();
