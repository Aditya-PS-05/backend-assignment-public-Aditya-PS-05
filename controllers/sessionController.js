const { chromium, firefox, webkit } = require('playwright');
const { v4: uuidv4 } = require('uuid');

const sessions = new Map();

exports.startSession = async (req, res) => {
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
        sessions.set(sessionId, { browser: browserInstance, context, page });
        res.json({ sessionId });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.closeSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ status: 'error', error: 'Session not found' });
        }
        await session.context.close();
        await session.browser.close();
        sessions.delete(sessionId);
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.sessions = sessions; 