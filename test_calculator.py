#!/usr/bin/env python3
"""
Unit tests for the Python Calculator.
Uses Python standard library 'unittest' to verify sum, subtraction,
multiplication, division, and error handling for division by zero.
"""

import unittest
from calculator import Calculator


class TestCalculator(unittest.TestCase):
    """Test suite for core arithmetic operations and edge cases."""

    def setUp(self) -> None:
        """Create a fresh calculator instance before each test."""
        self.calc = Calculator()

    # --- Sum / Addition Tests ---
    def test_addition_integers(self) -> None:
        self.assertEqual(self.calc.add(10, 5), 15)
        self.assertEqual(self.calc.calculate('+', 10, 5), 15)

    def test_addition_negatives(self) -> None:
        self.assertEqual(self.calc.add(-10, 5), -5)
        self.assertEqual(self.calc.add(-4, -6), -10)

    def test_addition_floats(self) -> None:
        self.assertAlmostEqual(self.calc.add(2.5, 3.1), 5.6, places=7)

    # --- Subtraction Tests ---
    def test_subtraction_positive_result(self) -> None:
        self.assertEqual(self.calc.subtract(20, 8), 12)
        self.assertEqual(self.calc.calculate('-', 20, 8), 12)

    def test_subtraction_negative_result(self) -> None:
        self.assertEqual(self.calc.subtract(5, 12), -7)

    def test_subtraction_with_negatives(self) -> None:
        self.assertEqual(self.calc.subtract(-5, -5), 0)

    # --- Multiplication Tests ---
    def test_multiplication_positive(self) -> None:
        self.assertEqual(self.calc.multiply(6, 7), 42)
        self.assertEqual(self.calc.calculate('*', 6, 7), 42)

    def test_multiplication_by_zero(self) -> None:
        self.assertEqual(self.calc.multiply(99, 0), 0)
        self.assertEqual(self.calc.multiply(0, 99), 0)

    def test_multiplication_negatives(self) -> None:
        self.assertEqual(self.calc.multiply(-4, 5), -20)
        self.assertEqual(self.calc.multiply(-3, -3), 9)

    # --- Division Tests ---
    def test_division_exact(self) -> None:
        self.assertEqual(self.calc.divide(20, 4), 5.0)
        self.assertEqual(self.calc.calculate('/', 20, 4), 5.0)

    def test_division_float_result(self) -> None:
        self.assertAlmostEqual(self.calc.divide(7, 2), 3.5, places=7)

    def test_division_negative_numbers(self) -> None:
        self.assertEqual(self.calc.divide(-15, 3), -5.0)
        self.assertEqual(self.calc.divide(-15, -3), 5.0)

    # --- Error Handling: Division by Zero ---
    def test_division_by_zero_raises_exception(self) -> None:
        """Verifies that dividing by zero raises ZeroDivisionError with 'Error'."""
        with self.assertRaises(ZeroDivisionError) as context:
            self.calc.divide(10, 0)
        self.assertEqual(str(context.exception), "Error")

    def test_calculate_dispatch_division_by_zero(self) -> None:
        """Verifies calculate dispatch handles division by zero error cleanly."""
        with self.assertRaises(ZeroDivisionError):
            self.calc.calculate('/', 42, 0)

    # --- Validation and History ---
    def test_unsupported_operation_raises_value_error(self) -> None:
        with self.assertRaises(ValueError):
            self.calc.calculate('^', 2, 3)

    # --- Modulo and Expression Evaluation Tests ---
    def test_modulo_positive(self) -> None:
        self.assertEqual(self.calc.modulo(10, 3), 1)
        self.assertEqual(self.calc.calculate('%', 20, 6), 2)

    def test_modulo_by_zero_raises_exception(self) -> None:
        with self.assertRaises(ZeroDivisionError):
            self.calc.modulo(10, 0)

    def test_expression_complex_pemdas(self) -> None:
        """Verifies expression with parentheses, modulo, multiplication, subtraction, addition."""
        result = self.calc.evaluate_expression("(5-3)*10%5+15")
        self.assertEqual(result, 15)

    def test_expression_fractional_parentheses(self) -> None:
        """Verifies expression (5+8)/2 == 6.5."""
        result = self.calc.evaluate_expression("(5+8)/2")
        self.assertEqual(result, 6.5)

    def test_expression_division_by_zero(self) -> None:
        with self.assertRaises(ZeroDivisionError):
            self.calc.evaluate_expression("10/(5-5)")

    def test_history_logging(self) -> None:
        self.calc.calculate('+', 2, 3)
        self.calc.calculate('*', 4, 5)
        history = self.calc.get_history()
        self.assertEqual(len(history), 2)
        self.assertEqual(history[0]['representation'], '2 + 3 = 5')
        self.assertEqual(history[1]['representation'], '4 * 5 = 20')

        self.calc.clear_history()
        self.assertEqual(len(self.calc.get_history()), 0)


if __name__ == "__main__":
    unittest.main()
