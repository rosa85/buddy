const http = require('http');  // Lokalny serwer HTTP
const https = require('https'); // Do komunikacji z zewnętrznym serwerem HTTPS
const fs = require('fs');
const path = require('path');

// Tworzymy lokalny serwer HTTP
const server = http.createServer((req, res) => {
    // Nasłuchuje na ścieżkę "/"
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } 
    // Statyczne pliki CSS
    else if (req.url === '/styles.css') {
        fs.readFile(path.join(__dirname, 'styles.css'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    } 
    // Statyczne pliki JavaScript
    else if (req.url === '/script.js') {
        fs.readFile(path.join(__dirname, 'script.js'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(content);
        });
    }
    // Ścieżka "/getData" – żądanie do serwera Spring Boot
    else if (req.url === '/getData') {
        // Opcje dla HTTPS do serwera Cloud Run (Spring Boot)
        const options = {
            hostname: 'spring-app-522762781675.europe-west1.run.app', // Adres serwera Spring Boot
            path: '/',                                                // Endpoint główny
            method: 'GET',                                            // Metoda HTTP GET
            headers: {
                'Content-Type': 'application/json'                   // Typ danych
            }
        };

        // Wysyłamy żądanie do serwera Spring Boot
        const javaReq = https.request(options, (javaRes) => {
            let data = '';

            // Odbieramy dane w częściach
            javaRes.on('data', (chunk) => {
                data += chunk;
            });

            // Po zakończeniu odpowiedzi z serwera zwracamy dane do klienta
            javaRes.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            });
        });

        // Obsługa błędów połączenia z serwerem Spring Boot
        javaReq.on('error', (error) => {
            console.error(`HTTPS Error: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error: ' + error.message);
        });

        // Zakończenie żądania do zewnętrznego serwera
        javaReq.end();
    } 
    // Obsługa ścieżek, które nie istnieją
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Uruchomienie lokalnego serwera HTTP na porcie 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});