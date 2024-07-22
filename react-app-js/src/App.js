import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    const endpoint = `http://localhost:8000/ask?q=${query}`;

    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        const parsedData = Object.entries(data).map(([id, values]) => ({ id, ...values }));
        setResults(parsedData)
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="App">
      <h1>Ask me anything!</h1>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map((item, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', maxWidth: '600px' }}>
            <div style={{border: '1px solid #ccc' }} dangerouslySetInnerHTML={{ __html: item.content }} />
            <div style={{border: '1px solid #ccc' }}><strong>Confidence</strong>: {item.confidence.toFixed(2)}% </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
