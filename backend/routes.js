const express = require('express');
const router = express.Router();
const Gripper = require('./schema');

// Get all grippers
router.get('/grippers', async (req, res) => {
  try {
    const grippers = await Gripper.find();
    res.status(200).json(grippers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred while fetching grippers.' });
  }
});

router.get('/grippers/minmax', async (req, res) => {
  try {
    const grippers = await Gripper.find();

    if (!Array.isArray(grippers)) {
      return res.status(500).json({ error: 'Grippers data is not an array.' });
    }

    const dimensionValues = grippers.map((gripper) => {
      const dimensionValue = gripper.Data.find((data) => data.Property === 'Dimension(MM)').Value;
      const [min, max] = dimensionValue.split('-').map(parseFloat);
      return { min, max };
      
    });

    const dimensionMin = Math.min(...dimensionValues.map((value) => value.min));
    const dimensionMax = Math.max(...dimensionValues.map((value) => value.max));
 
    const minMaxValues = {
      dimensionMin,
      dimensionMax,
      payloadMin: Math.min(...grippers.map((gripper) => parseFloat(gripper.Data.find((data) => data.Property === 'Payload(Kg)').Value))),
      payloadMax: Math.max(...grippers.map((gripper) => parseFloat(gripper.Data.find((data) => data.Property === 'Payload(Kg)').Value))),
      forceMin: Math.min(...grippers.map((gripper) => parseFloat(gripper.Data.find((data) => data.Property === 'Gripping Force').Value))),
      forceMax: Math.max(...grippers.map((gripper) => parseFloat(gripper.Data.find((data) => data.Property === 'Gripping Force').Value))),
      pressureMin: Math.min(...grippers.map((gripper) => parseFloat(gripper.Data.find((data) => data.Property === 'Feed pressure Max').Value))),
      pressureMax: Math.max(...grippers.map((gripper) => parseFloat(gripper.Data.find((data) => data.Property === 'Feed pressure Max').Value))),
    };

    res.status(200).json(minMaxValues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred while fetching grippers.' });
  }
});


module.exports = router;
