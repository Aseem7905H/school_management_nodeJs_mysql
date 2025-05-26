const db = require('../db');

const isValidCoordinates = (lat, lon) => {
  return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !isValidCoordinates(latitude, longitude)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listSchools = async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (!isValidCoordinates(userLat, userLon)) {
    return res.status(400).json({ error: 'Invalid user coordinates' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');

    const withDistance = schools.map(school => {
      const dist = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) + Math.pow(userLon - school.longitude, 2)
      );
      return { ...school, distance: dist };
    });

    withDistance.sort((a, b) => a.distance - b.distance);

    res.json(withDistance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
