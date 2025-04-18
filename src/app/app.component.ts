import { Component, HostListener, ResourceStatus } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AppComponent {
  display: string = '0'
  firstValue: number | null = null // first operand
  secondValue: number | null = null // second operand for repeated "="
  operator: string | null = null
  blinkDisplay: boolean = false // flag for blinking
  equalsPressed: boolean = false // flag for equals pressed
  operatorPressed: boolean = false //flag for operator
  result: number | null = null // result for calculate
  calcStatus: string = ''

  //console log report
  get report(): string {
    return `${this.firstValue} ${this.operator} ${this.secondValue} \n
result = ${this.result}`
  }

  appendToDisplay(num: string) {
    // assumes operator isnt pressed
    if (this.display === '0' || this.operatorPressed) {
      this.operatorPressed = false
      this.display = num
      console.log(`operator btn pressed = ${this.operatorPressed}`)
      return
    }
    // equals is pressed
    if (this.equalsPressed) {
      this.clearAll()
      this.result = null
      this.display = num
      return
    }
    // "default"
    if (this.display.length >= 23) {
      this.display = this.display.slice(1) // Remove the first character
    }
    this.display += num
    return
  }

  setOperation(operator: string) {
    // assumes operator has been pressed
    if (!this.operatorPressed && this.operator !== null && !this.equalsPressed) {
      this.secondValue = parseFloat(this.display)
      this.calculate()
      this.firstValue = this.result !== null ? this.result : this.firstValue
      this.calcStatus = `${this.firstValue} ${this.operator}`
      this.operatorPressed = true
      this.operator = operator
      console.log('calc case')
      return
    }
    // operator is required
    this.operator = operator
    if (this.firstValue === null) {
      this.firstValue = parseFloat(this.display)
      this.calcStatus = `${this.firstValue} ${this.operator}`
      this.operatorPressed = true
      console.log('default case')
      return
    }
    if (this.operatorPressed || this.equalsPressed) {
      this.secondValue = null
      this.calcStatus = `${this.firstValue} ${this.operator}`
      this.operatorPressed = true
      console.log('loop case')
      return
    }
  }

  submitEquals() {
    if (this.secondValue === null) {
      this.secondValue = parseFloat(this.display)
    }
    this.calculate()
    this.equalsPressed = true
    this.calcStatus = `${this.firstValue} ${this.operator} ${this.secondValue} = ${this.result}`
    this.firstValue = this.result
    console.log('final Report : ' + this.report)
  }

  calculate() {
    if (this.firstValue === null || this.operator === null || this.secondValue === null) return

    switch (this.operator) {
      case '+':
        this.result = this.firstValue + this.secondValue
        break
      case '-':
        this.result = this.firstValue - this.secondValue
        break
      case '*':
      case 'x':
        this.result = this.firstValue * this.secondValue
        break
      case '/':
        this.result = this.firstValue / this.secondValue
        break
    }
    if (this.result === null) return
    if (!this.result && this.result !== 0) {
      this.result = 0
    }

    //converts result to string for rendering to display
    let resultString = this.result.toString()
    if (resultString.length > 23) {
      resultString = resultString.slice(1) // Remove the first character
    }
    if ((resultString = 'Infinity')) {
      resultString = '0'
    }
    //renders to display
    this.display = resultString
    console.log('report:     ' + this.report)
    return
  }

  clearAll() {
    this.display = '0' // Reset the display to zero
    this.firstValue = null // Clear the stored first operand
    this.secondValue = null // Clear the last second operand
    this.operator = null // Clear the current operator
    this.operatorPressed = false // clear operator flag
    this.equalsPressed = false //clear equals flag
    this.triggerBlink() // Trigger blink on operator select
    this.calcStatus = ''
  }

  triggerBlink() {
    this.blinkDisplay = true
    setTimeout(() => {
      this.blinkDisplay = false
    }, 300) // 💡 adjust timing to match your CSS
  }
  backspace() {
    //exits when display is already '0'
    if (this.display === '0') return
    this.display = this.display.slice(0, -1) //main bckspc handler
  }
  addDecimal() {
    if (this.equalsPressed || this.operatorPressed) {
      this.equalsPressed = false
      this.operatorPressed = false
      this.display = '0.'
      return
    }
    if (!this.display.includes('.')) {
      this.display += '.'
      return
    } else {
      return
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key

    if ((key >= '0' && key <= '9') || key === '.') {
      this.appendToDisplay(key)
    } else if (['+', '-', '*', '/', 'x'].includes(key)) {
      this.setOperation(key)
    } else if (key === '=' || key === 'Enter') {
      this.submitEquals()
    } else if (key === 'Backspace') {
      this.display = this.display.slice(0, -1) || '0'
      this.secondValue = parseFloat(this.display)
    }
  }
}
