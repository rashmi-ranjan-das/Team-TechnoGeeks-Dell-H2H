import initializeRoutes from './routes';

console.log("&&&&&&&&",process.env);

if (process.env.NODE_ENV !== "development")
    console.log = () => {};
initializeRoutes();