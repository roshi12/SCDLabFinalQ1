module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  // Handle proxy errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'The requested service is currently unavailable'
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
};
