import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AppComponent {
  display: string = '0';
  storedValue: number | null = null; // first operand
  lastOperand: number | null = null; // second operand for repeated "="
  operator: string | null = null;
  blinkDisplay: boolean = false; // flag for blinking
  equalsPressed: boolean = false; // flag for equals pressed
  calcStatus: string = '';

  appendToDisplay(num: string) {
    if (!this.operator || (this.display.length === 1 && this.display !== '0')) {
      this.display += num;
      return;
    } else {
      this.display = num;
      return;
    }
  }

  setOperation(operator: string) {
    this.operator = operator;
    if (!this.storedValue) {
      this.storedValue = parseFloat(this.display);
      return;
    }
    if (!this.lastOperand) {
      this.lastOperand = parseFloat(this.display);
      return;
    }
    if (this.operator && this.lastOperand) {
      this.calculate;
      this.lastOperand = null;
      return;
    }
  }

  submitEquals() {
    this.calcStatus = `${this.storedValue} ${this.operator} ${this.lastOperand} =`;
    this.calculate();
    this.equalsPressed = true;
  }

  calculate() {
    if (
      this.storedValue === null ||
      this.lastOperand === null ||
      this.operator === null
    )
      return;

    switch (this.operator) {
      case '+':
        this.storedValue = this.storedValue + this.lastOperand;
        break;
      case '-':
        this.storedValue = this.storedValue - this.lastOperand;
        break;
      case '*':
      case 'x':
        this.storedValue = this.storedValue * this.lastOperand;
        break;
      case '/':
        this.storedValue = this.storedValue / this.lastOperand;
        break;
    }

    this.display = this.storedValue.toString();
  }

  clearAll() {
    this.display = '0'; // Reset the display to zero
    this.storedValue = null; // Clear the stored first operand
    this.lastOperand = null; // Clear the last second operand
    this.operator = null; // Clear the current operator
    this.triggerBlink(); // Trigger blink on operator select
    this.calcStatus = '';
  }

  triggerBlink() {
    this.blinkDisplay = true;
    setTimeout(() => {
      this.blinkDisplay = false;
    }, 300); // 💡 adjust timing to match your CSS
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if ((key >= '0' && key <= '9') || key === '.') {
      this.appendToDisplay(key);
    } else if (['+', '-', '*', '/', 'x'].includes(key)) {
      this.setOperation(key);
    } else if (key === '=' || key === 'Enter') {
      this.submitEquals();
    } else if (key === 'Backspace') {
      this.display = this.display.slice(0, -1) || '0';
      this.lastOperand = parseFloat(this.display);
    }
  }
}
