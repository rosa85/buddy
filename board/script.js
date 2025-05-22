document.getElementById('fetchButton').addEventListener('click', function() {
    fetch('/getData')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            let result = document.getElementById('result');
            try {
            
                let jsonData = JSON.parse(data);
                result.innerHTML = '<pre>' + JSON.stringify(jsonData, null, 2) + '</pre>';
            } catch (e) {
          
                result.innerHTML = '<p>Data from server:</p><pre>' + data + '</pre>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = 'Error during communication with server: ' + error.message;
        });
});