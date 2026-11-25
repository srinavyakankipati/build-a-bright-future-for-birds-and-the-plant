const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Workout Logger API is healthy',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealthStatus };
