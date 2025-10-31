import { Request, Response, NextFunction } from "express";

const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
  console.log("SERVER ERROR OCCURED");
  console.log(error);

  const statusCode: number = error.status || 500;
  const message: string = error.message || "Internal Server Error";

  response.status(statusCode).json({ message });
};

export default errorHandler;
