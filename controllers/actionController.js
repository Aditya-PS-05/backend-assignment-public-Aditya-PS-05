const { sessions } = require('./sessionController');

async function getSessionAndScreenshot(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) {
        throw new Error('Session not found');
    }
    const screenshot = await session.page.screenshot({ encoding: 'base64' });
    return { session, screenshot };
}

exports.click = async (req, res) => {
    try {
        const { sessionId, locator } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.click(locator);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).click();
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.fill = async (req, res) => {
    try {
        const { sessionId, locator, value } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.fill(locator, value);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).fill(value);
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.hover = async (req, res) => {
    try {
        const { sessionId, locator } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.hover(locator);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).hover();
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.goto = async (req, res) => {
    try {
        const { sessionId, url } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        await session.page.goto(url);
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.type = async (req, res) => {
    try {
        const { sessionId, locator, text, delay } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.locator(locator).pressSequentially(text, { delay });
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).pressSequentially(text, { delay });
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.press = async (req, res) => {
    try {
        const { sessionId, locator, key } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.locator(locator).press(key);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).press(key);
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.check = async (req, res) => {
    try {
        const { sessionId, locator, checked = true } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.locator(locator).setChecked(checked);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).setChecked(checked);
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.select = async (req, res) => {
    try {
        const { sessionId, locator, value } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.locator(locator).selectOption(value);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).selectOption(value);
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.upload = async (req, res) => {
    try {
        const { sessionId, locator, files } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.locator(locator).setInputFiles(files);
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).setInputFiles(files);
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.focus = async (req, res) => {
    try {
        const { sessionId, locator } = req.body;
        const { session, screenshot } = await getSessionAndScreenshot(sessionId);
        if (typeof locator === 'string') {
            await session.page.locator(locator).focus();
        } else {
            await session.page.getByRole(locator.role, { name: locator.name }).focus();
        }
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.drag = async (req, res) => {
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
        res.json({ status: 'success', screenshot });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.debug = async (req, res) => {
    try {
        const { sessionId, locator } = req.body;
        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ status: 'error', error: 'Session not found' });
        }
        const elementInfo = await session.page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            return {
                tagName: element.tagName,
                id: element.id,
                name: element.name,
                type: element.type,
                role: element.getAttribute('role'),
                ariaLabel: element.getAttribute('aria-label'),
                className: element.className,
                placeholder: element.placeholder,
                value: element.value
            };
        }, locator);
        res.json({ status: 'success', elementInfo });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}; 