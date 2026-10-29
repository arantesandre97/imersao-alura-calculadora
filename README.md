# Tabajara Calculator 2000

A versatile arithmetic calculator engine featuring both a **100% Pure Python Terminal Interface** (zero external dependencies) and a **Modern Interactive Web UI**.

Capable of handling the four basic arithmetic operations (`+`, `-`, `*`, `/`), modulo (`%`), and complex nested parenthesis expressions like `(5-3)*10%5+15` and `(96+3)-(5*9)` with strict zero-division error handling.

---

## Prerequisites

| Interface | Requirements |
|---|---|
| **Python UI** | Python 3.8 or newer (uses only Python standard library: `ast`, `operator`, `sys`) |
| **Web UI** | Node.js 18+ and npm (or bun / pnpm / yarn) |

---

## 1. Running the Pure Python UI

The Python interface runs directly inside your terminal or command prompt with an interactive REPL, expression evaluation, and calculation history.

### On Windows

Open **Command Prompt** or **PowerShell** in the project directory:

```cmd
# Run using the Python launcher
py calculator.py

# Or directly with python
python calculator.py
```

> **Note for Windows users**: If `python` is not recognized, ensure Python is added to your system `PATH`, or use the official `py` launcher installed with Python on Windows.

### On Linux & macOS

Open your **Terminal** in the project directory:

```bash
# Make executable (optional)
chmod +x calculator.py

# Run with Python 3
python3 calculator.py
```

### Python UI Commands & Usage

Once started, you can enter mathematical expressions directly or use built-in commands:

```text
==================================================
              TABAJARA CALCULATOR 2000            
==================================================
  • Direct Expressions: (5-3)*10%5+15 or 99 / 3
  • Commands: 'menu' (guided mode), 'history', 'clear', 'exit'

Tabajara > (96+3)-(5*9)
= 54

Tabajara > (5+8)/2
= 6.5

Tabajara > 10 / 0
Error

Tabajara > history
Tabajara > menu
Tabajara > exit
```

### Running Automated Python Unit Tests

To run the full suite of unit tests on any platform:

- **Windows**:
  ```cmd
  python -m unittest test_calculator.py -v
  ```
- **Linux / macOS**:
  ```bash
  python3 -m unittest test_calculator.py -v
  ```

---

## 2. Running the Web UI

The Web interface provides a full desktop/mobile responsive keypad layout, real-time expression preview, parenthetical sub-expression calculation, and calculation history.

### Step 1: Install Dependencies

Run this in your terminal or command prompt:

- **Windows (Command Prompt / PowerShell)**:
  ```cmd
  npm install
  ```
- **Linux & macOS (Terminal)**:
  ```bash
  npm install
  ```

### Step 2: Start the Development Server

- **Windows, Linux, and macOS**:
  ```bash
  npm run dev
  ```

The server will start at:
```
http://localhost:3000
```
Open that address in any modern web browser (Chrome, Edge, Firefox, Safari).

### Step 3: Production Build (Optional)

To compile and preview the production build:

```bash
# Build optimized assets into /dist
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```text
├── calculator.py         # Pure Python engine & interactive terminal REPL UI
├── test_calculator.py    # Comprehensive automated unit test suite
├── package.json          # Node.js dependencies and scripts for Web UI
├── index.html            # Web application entry point
├── src/
│   ├── App.tsx           # React UI component with 5x4 keypad and expression parser
│   ├── main.tsx          # React application bootstrapping
│   └── index.css         # Styling and design system
└── README.md             # Multi-platform execution instructions
```
