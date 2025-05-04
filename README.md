[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iPRzcknB)
# Playwright Action API

A REST API service that exposes Playwright browser automation actions as HTTP endpoints. Built with Express.js and Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node index.js
```

The server will start on port 3001 by default.

## API Endpoints

### Session Management

#### Start a new session
```http
POST /session/start
Content-Type: application/json

{
    "browser": "chromium",  // or "firefox" or "webkit"
    "headless": true
}
```

Response:
```json
{
    "sessionId": "uuid-string"
}
```

#### Close a session
```http
POST /session/close
Content-Type: application/json

{
    "sessionId": "uuid-string"
}
```

### Action Endpoints

All action endpoints require a `sessionId` and return a base64-encoded screenshot.

#### Click
```http
POST /action/click
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "text=Submit"  // or {"role": "button", "name": "Submit"}
}
```

#### Fill
```http
POST /action/fill
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#email",  // or {"role": "textbox", "name": "Email"}
    "value": "test@example.com"
}
```

#### Type (character by character)
```http
POST /action/type
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#input",  // or {"role": "textbox", "name": "Input"}
    "text": "Hello World",
    "delay": 100  // optional delay between keystrokes in milliseconds
}
```

#### Press Keys
```http
POST /action/press
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#input",  // or {"role": "textbox", "name": "Input"}
    "key": "Enter"  // or "Control+A", "Shift+ArrowRight", etc.
}
```

#### Check/Uncheck
```http
POST /action/check
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#checkbox",  // or {"role": "checkbox", "name": "Agree"}
    "checked": true  // or false to uncheck
}
```

#### Select Options
```http
POST /action/select
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#dropdown",  // or {"role": "combobox", "name": "Select"}
    "value": "option1"  // or { label: "Option 1" }
}
```

#### Upload Files
```http
POST /action/upload
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#file-input",  // or {"role": "button", "name": "Upload"}
    "files": ["path/to/file1.txt", "path/to/file2.txt"]
}
```

#### Focus Element
```http
POST /action/focus
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#input"  // or {"role": "textbox", "name": "Input"}
}
```

#### Drag and Drop
```http
POST /action/drag
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "sourceLocator": "#draggable",  // or {"role": "button", "name": "Drag me"}
    "targetLocator": "#dropzone"    // or {"role": "region", "name": "Drop here"}
}
```

#### Hover
```http
POST /action/hover
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "locator": "#menu"  // or {"role": "button", "name": "Menu"}
}
```

#### Navigate to URL
```http
POST /action/goto
Content-Type: application/json

{
    "sessionId": "uuid-string",
    "url": "https://example.com"
}
```

## Response Format

### Success Response
```json
{
    "status": "success",
    "screenshot": "base64_png_data"
}
```

### Error Response
```json
{
    "status": "error",
    "error": "Error message"
}
```

## Notes

- The API supports both string selectors and structured locators
- Each action returns a base64-encoded screenshot
- Sessions are managed in memory and will be lost on server restart
- No authentication or rate limiting is implemented
- All actions support both string selectors and role-based locators
- Screenshots are taken after each action completes

---

### Tech Stack

You may use either of the following stacks:

- **Python** with **FastAPI**
- **JavaScript** with **Express.js**

All automation must use **[Playwright](https://playwright.dev/)**.

---

## Core Requirements

### 1. Session Management

Support multiple browser sessions via a `sessionId`. Each action must operate within its own session context.

- #### `POST /session/start`

  Start a new browser session.

  - **Sample Request:**

    ```json
    {
      "browser": "chromium",
      "headless": true,
      // add more config parameters
    }
    ```

  - **Sample Response:**

    ```json
    {
      "sessionId": "abc123"
    }
    ```


- ####  `POST /session/close`

  Close an active session.

  - **Request:**

    ```json
    {
      "sessionId": "abc123"
    }
    ```

---

### 2. Action Endpoints

Expose each Playwright action as a separate endpoint. Each endpoint should:

- Accept a `sessionId`
- Accept a `locator` (either string or structured format)
- Execute in real time
- Return a base64-encoded screenshot

Refer to the full list of actions and their usage here:  
📚 [Playwright Input Actions Documentation](https://playwright.dev/docs/input)

---

### 3. Locator Format

Endpoints must support both:

1.  **String selectors** (e.g., `"text=Submit"`, `"#email"`)

2.  **Structured locators** using role and name:
  

    ```json
    {
      "role": "button",
      "name": "Continue"
    }
    ```

---

## What NOT to Build

- No frontend UI
- No authentication or rate limiting
- No persistent storage for sessions
- No saving of screenshots (return as base64 only)

---

## Bonus 

If you can find and integrate an open source session management library. (it's hard to find, but it exists!)


---