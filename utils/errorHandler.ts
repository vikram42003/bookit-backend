const errorHandler = (error, request, response, next) => {
  console.log(error);

  const statusCode = error.status || 500;
  const message = error.message || "Internal Server Error";

  response.status(statusCode).json({ message });
};

module.exports = errorHandler;
