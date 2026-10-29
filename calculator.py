#!/usr/bin/env python3
"""
Tabajara Calculator 2000 in Python.

Provides calculation logic for arithmetic operations (sum, subtraction,
multiplication, division, modulo, and complex expressions with parentheses)
with robust error handling for division by zero and an interactive User Interface (UI).

Author: Senior Software Engineer
Language: 100% Pure Python (Standard Library only - no external dependencies)
Run directly in terminal: python3 calculator.py
"""

from typing import Union, Callable, Dict, List, Optional
import ast
import operator
import sys

Number = Union[int, float]


class Calculator:
    """
    Core calculator engine responsible for mathematical evaluations.
    Separated from UI logic adhering to the Single Responsibility Principle (SRP).
    """

    def __init__(self) -> None:
        self._operations: Dict[str, Callable[[Number, Number], Number]] = {
            '+': self.add,
            'add': self.add,
            'sum': self.add,
            '-': self.subtract,
            'sub': self.subtract,
            'subtract': self.subtract,
            '*': self.multiply,
            'mul': self.multiply,
            'multiply': self.multiply,
            '/': self.divide,
            'div': self.divide,
            'divide': self.divide,
            '%': self.modulo,
            'mod': self.modulo,
            'modulo': self.modulo,
        }
        self.history: List[Dict[str, Union[str, Number]]] = []

    def add(self, a: Number, b: Number) -> Number:
        """Calculate the sum of two numbers."""
        return a + b

    def subtract(self, a: Number, b: Number) -> Number:
        """Calculate the difference between two numbers (a - b)."""
        return a - b

    def multiply(self, a: Number, b: Number) -> Number:
        """Calculate the product of two numbers."""
        return a * b

    def divide(self, a: Number, b: Number) -> Number:
        """
        Calculate the quotient of two numbers (a / b).

        Raises:
            ZeroDivisionError: If the divisor (b) is zero.
        """
        if b == 0:
            raise ZeroDivisionError("Error")
        return a / b

    def modulo(self, a: Number, b: Number) -> Number:
        """
        Calculate the remainder of division of two numbers (a % b).

        Raises:
            ZeroDivisionError: If the divisor (b) is zero.
        """
        if b == 0:
            raise ZeroDivisionError("Error")
        return a % b

    def evaluate_expression(self, expression: str) -> Number:
        """
        Safely evaluates an arithmetic expression with parentheses and precedence
        (e.g., '(5-3)*10%5+15') using Python's standard library abstract syntax tree (ast).

        Supported operators: +, -, *, /, %, unary +/-, and ()

        Raises:
            ZeroDivisionError: If division or modulo by zero occurs.
            ValueError: If the expression has invalid syntax or unsupported operations.
        """
        ops = {
            ast.Add: operator.add,
            ast.Sub: operator.sub,
            ast.Mult: operator.mul,
            ast.Div: operator.truediv,
            ast.Mod: operator.mod,
            ast.USub: operator.neg,
            ast.UAdd: operator.pos,
        }

        def _eval_node(node: ast.AST) -> Number:
            if isinstance(node, ast.Expression):
                return _eval_node(node.body)
            elif isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
                return node.value
            elif isinstance(node, ast.BinOp):
                left_val = _eval_node(node.left)
                right_val = _eval_node(node.right)
                op_type = type(node.op)
                if op_type in (ast.Div, ast.Mod) and right_val == 0:
                    raise ZeroDivisionError("Error")
                if op_type in ops:
                    return ops[op_type](left_val, right_val)
                raise ValueError("Error")
            elif isinstance(node, ast.UnaryOp):
                operand_val = _eval_node(node.operand)
                op_type = type(node.op)
                if op_type in ops:
                    return ops[op_type](operand_val)
                raise ValueError("Error")
            raise ValueError("Error")

        cleaned = expression.strip()
        try:
            tree = ast.parse(cleaned, mode='eval')
            result = _eval_node(tree)
            self.history.append({
                'expression': cleaned,
                'result': result,
                'representation': f"{cleaned} = {self.format_number(result)}"
            })
            return result
        except ZeroDivisionError:
            raise ZeroDivisionError("Error")
        except Exception:
            raise ValueError("Error")

    def calculate(self, operation: str, a: Number, b: Number) -> Number:
        """Dispatch standard binary arithmetic operation dynamically."""
        op_key = operation.strip().lower()
        if op_key not in self._operations:
            raise ValueError(f"Unsupported operation '{operation}'")

        func = self._operations[op_key]
        result = func(a, b)

        symbol_map = {'add': '+', 'sub': '-', 'mul': '*', 'div': '/', 'mod': '%'}
        symbol = symbol_map.get(op_key, op_key)

        self.history.append({
            'a': a,
            'operation': symbol,
            'b': b,
            'result': result,
            'representation': f"{self.format_number(a)} {symbol} {self.format_number(b)} = {self.format_number(result)}"
        })
        return result

    @staticmethod
    def format_number(val: Number) -> str:
        """Formats numbers cleanly: converts whole floats like 4.0 to '4'."""
        if isinstance(val, float) and val.is_integer():
            return str(int(val))
        return f"{val:.6g}" if isinstance(val, float) else str(val)

    def get_history(self) -> List[Dict[str, Union[str, Number]]]:
        """Return a copy of calculation history."""
        return list(self.history)

    def clear_history(self) -> None:
        """Clear all previous calculations."""
        self.history.clear()


class CalculatorUI:
    """
    Console User Interface for the Calculator written purely in Python.
    Provides direct expression evaluation (REPL) and guided menu workflows.
    No web browser or TypeScript required.
    """

    GUIDED_OPTIONS = {
        '1': ('Sum (Addition)', '+'),
        '2': ('Subtraction', '-'),
        '3': ('Multiplication', '*'),
        '4': ('Division', '/'),
        '5': ('Modulo (Remainder)', '%'),
        '6': ('Expression Mode (e.g. (5-3)*10%5+15)', 'expr'),
        '7': ('View Calculation History', 'history'),
        '8': ('Clear History', 'clear'),
        '9': ('Return to Direct Mode', 'back'),
    }

    def __init__(self, calculator: Optional[Calculator] = None) -> None:
        self.calc = calculator if calculator is not None else Calculator()
        self.running = True

    def display_banner(self) -> None:
        """Prints the welcoming banner."""
        print("=" * 55)
        print("             TABAJARA CALCULATOR 2000              ")
        print("   Pure Python Console Interface • Standard Library")
        print("=" * 55)

    def prompt_number(self, prompt_text: str) -> float:
        """Repeatedly prompts user until a valid number is entered."""
        while True:
            raw = input(prompt_text).strip()
            if not raw:
                print("  ! Input cannot be empty.")
                continue
            try:
                return float(raw)
            except ValueError:
                print(f"  ! Invalid number: '{raw}'. Please enter digits.")

    def run_guided_menu(self) -> None:
        """Interactive guided menu with numbered choices."""
        print("\n--- Guided Mode ---")
        for key, (label, _) in self.GUIDED_OPTIONS.items():
            print(f"  [{key}] {label}")
        print("-" * 55)

        choice = input("Select option (1-9): ").strip()
        if choice not in self.GUIDED_OPTIONS:
            print("  ! Invalid option.")
            return

        _, action = self.GUIDED_OPTIONS[choice]
        if action == 'back':
            return
        elif action == 'history':
            self.show_history()
        elif action == 'clear':
            self.calc.clear_history()
            print("  Calculation history cleared.")
        elif action == 'expr':
            expr = input("  Enter expression (e.g. (5-3)*10%5+15): ").strip()
            try:
                res = self.calc.evaluate_expression(expr)
                print(f"  = {Calculator.format_number(res)}")
            except ZeroDivisionError:
                print("  Error")
            except Exception:
                print("  Error")
        else:
            num1 = self.prompt_number("  First number:  ")
            num2 = self.prompt_number("  Second number: ")
            try:
                res = self.calc.calculate(action, num1, num2)
                print(f"  RESULT: {Calculator.format_number(num1)} {action} {Calculator.format_number(num2)} = {Calculator.format_number(res)}")
            except ZeroDivisionError:
                print("  Error")
            except Exception:
                print("  Error")

    def show_history(self) -> None:
        """Prints past calculation records."""
        history = self.calc.get_history()
        print("\n--- Calculation History ---")
        if not history:
            print("  No calculations recorded yet.")
        else:
            for idx, item in enumerate(history, 1):
                print(f"  {idx}. {item['representation']}")
        print("-" * 30)

    def start(self) -> None:
        """Main interaction loop: accepts expressions directly or commands."""
        self.display_banner()
        print("\nInstructions:")
        print("  • Type any expression directly: (5-3)*10%5+15, 20/4, 15+30*2")
        print("  • Commands: 'menu' (guided mode), 'history', 'clear', 'exit'\n")

        while self.running:
            try:
                line = input("Tabajara > ").strip()
            except (KeyboardInterrupt, EOFError):
                print("\nGoodbye!")
                break

            if not line:
                continue

            lowered = line.lower()
            if lowered in ('exit', 'quit', 'q'):
                print("Thank you for using Tabajara Calculator 2000. Goodbye!")
                self.running = False
            elif lowered == 'history':
                self.show_history()
            elif lowered == 'clear':
                self.calc.clear_history()
                print("Calculation history cleared.")
            elif lowered == 'menu':
                self.run_guided_menu()
            else:
                # Direct expression evaluation
                try:
                    result = self.calc.evaluate_expression(line)
                    print(f"= {Calculator.format_number(result)}\n")
                except ZeroDivisionError:
                    print("Error\n")
                except Exception:
                    print("Error\n")


if __name__ == "__main__":
    ui = CalculatorUI()
    try:
        ui.start()
    except (KeyboardInterrupt, EOFError):
        print("\nOperation cancelled. Exiting.")
        sys.exit(0)
