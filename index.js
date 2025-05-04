const express = require('express');
const { chromium, firefox, webkit } = require('playwright');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Store active browser sessions
const sessions = new Map();

// Start a new browser session
app.post('/session/start', async (req, res) => {
    try {
        const { browser = 'chromium', headless = true } = req.body;
        const sessionId = uuidv4();
        
        let browserInstance;
        switch (browser.toLowerCase()) {
            case 'firefox':
                browserInstance = await firefox.launch({ headless });
                break;
            case 'webkit':
                browserInstance = await webkit.launch({ headless });
                break;
            default:
                browserInstance = await chromium.launch({ headless });
        }

        const context = await browserInstance.newContext();
        const page = await context.newPage();
        
        sessions.set(sessionId, {
            browser: browserInstance,
            context,
            page
        });

        res.json({ sessionId });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Close a browser session
app.post('/session/close', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = sessions.get(sessionId);
        
        if (!session) {
            return res.status(404).json({
                status: 'error',
                error: 'Session not found'
            });
        }

        await session.context.close();
        await session.browser.close();
        sessions.delete(sessionId);

        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Helper function to get session and take screenshot
async function getSessionAndScreenshot(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) {
        throw new Error('Session not found');
    }
    
    const screenshot = await session.page.screenshot({ encoding: 'base64' });
    return { session, screenshot };
}

// Action endpoints
app.post('/action/click', async (req, res) => {
    try {
        const { sessionId, locator } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.click(locator);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).click();
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

app.post('/action/fill', async (req, res) => {
    try {
        const { sessionId, locator, value } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.fill(locator, value);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).fill(value);
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

app.post('/action/hover', async (req, res) => {
    try {
        const { sessionId, locator } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.hover(locator);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).hover();
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Navigate to URL
app.post('/action/goto', async (req, res) => {
    try {
        const { sessionId, url } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        await session.page.goto(url);

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Type characters
app.post('/action/type', async (req, res) => {
    try {
        const { sessionId, locator, text, delay } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.locator(locator).pressSequentially(text, { delay });
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).pressSequentially(text, { delay });
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Press keys
app.post('/action/press', async (req, res) => {
    try {
        const { sessionId, locator, key } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.locator(locator).press(key);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).press(key);
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Check/Uncheck
app.post('/action/check', async (req, res) => {
    try {
        const { sessionId, locator, checked = true } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.locator(locator).setChecked(checked);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).setChecked(checked);
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Select options
app.post('/action/select', async (req, res) => {
    try {
        const { sessionId, locator, value } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.locator(locator).selectOption(value);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).selectOption(value);
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Upload files
app.post('/action/upload', async (req, res) => {
    try {
        const { sessionId, locator, files } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.locator(locator).setInputFiles(files);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).setInputFiles(files);
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Focus element
app.post('/action/focus', async (req, res) => {
    try {
        const { sessionId, locator } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        if (typeof locator === 'string') {
            await session.page.locator(locator).focus();
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).focus();
        }

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// Drag and drop
app.post('/action/drag', async (req, res) => {
    try {
        const { sessionId, sourceLocator, targetLocator } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        
        const source = typeof sourceLocator === 'string' 
            ? session.page.locator(sourceLocator)
            : session.page.getByRole(sourceLocator.role, { name: sourceLocator.name });
            
        const target = typeof targetLocator === 'string'
            ? session.page.locator(targetLocator)
            : session.page.getByRole(targetLocator.role, { name: targetLocator.name });

        await source.dragTo(target);

        res.json({
            status: 'success',
            screenshot
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

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