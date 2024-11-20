const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Load model
let model;
tf.loadLayersModel('file://path-to-your-model/model.json').then((loadedModel) => {
  model = loadedModel;
  console.log('Model loaded!');
});

// Endpoint for handling predictions
app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.body.fluid_behavior) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const tensor = tf.node
      .decodeImage(imageBuffer)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    const fluidBehavior = parseFloat(req.body.fluid_behavior);
    const fluidTensor = tf.tensor([[fluidBehavior]]);

    const prediction = model.predict([tensor, fluidTensor]);
    const classIndex = prediction.argMax(1).dataSync()[0];

    res.json({ prediction: `Class ${classIndex}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Prediction error' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
