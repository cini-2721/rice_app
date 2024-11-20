import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [fluidBehavior, setFluidBehavior] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('fluid_behavior', fluidBehavior);

    try {
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data.prediction || 'Prediction failed');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Rice Type Classification</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Upload Image:
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </label>
        <br />
        <label>
          Fluid Behavior:
          <input
            type="number"
            value={fluidBehavior}
            onChange={(e) => setFluidBehavior(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {result && <p>Prediction: {result}</p>}
    </div>
  );
}

export default App;
