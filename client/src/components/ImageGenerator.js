import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const generateImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/images/generate', {
        prompt,
        userId: 'test-user' // In a real app, this would come from authentication
      });

      setGeneratedImage(response.data.image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-generator">
      <form onSubmit={generateImage}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image prompt"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {generatedImage && (
        <div className="generated-image">
          <img src={generatedImage.imageUrl} alt={generatedImage.prompt} />
          <p>Prompt: {generatedImage.prompt}</p>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator; 