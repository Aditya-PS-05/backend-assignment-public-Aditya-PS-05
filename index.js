const express = require('express');
const cors = require('cors');
const sessionRoutes = require('./routes/sessionRoutes');
const actionRoutes = require('./routes/actionRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/session', sessionRoutes);
app.use('/action', actionRoutes);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port by setting the PORT environment variable.`);
        console.error('You can also kill the process using the port with:');
        console.error(`lsof -i :${PORT} | grep LISTEN`);
        console.error(`kill -9 <PID>`);
        process.exit(1);
    } else {
        console.error('Error starting server:', err);
        process.exit(1);
    }
});
