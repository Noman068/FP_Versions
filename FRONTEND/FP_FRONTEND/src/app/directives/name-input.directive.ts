import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appNameInput]',
  standalone: true
})
export class NameInputDirective implements OnInit {
  @Input() appNameInput: 'firstname' | 'lastname' = 'firstname';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Set placeholder based on input type
    const placeholder = this.appNameInput === 'firstname' ? 'First Name' : 'Last Name';
    this.el.nativeElement.placeholder = placeholder;
    
    // Add CSS class for styling
    this.el.nativeElement.classList.add('name-input');
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isControlKey(event)) {
      return;
    }

    // Allow letters A-Z, a-z, and space
    const allowedPattern = /^[a-zA-Z\s]$/;
    if (!allowedPattern.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    
    // Filter out non-alphabetic characters and spaces
    const filteredText = pastedText.replace(/[^a-zA-Z\s]/g, '');
    
    // Insert the filtered text
    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;
    
    input.value = currentValue.substring(0, start) + filteredText + currentValue.substring(end);
    input.setSelectionRange(start + filteredText.length, start + filteredText.length);
    
    // Trigger input event
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private isControlKey(event: KeyboardEvent): boolean {
    return (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Enter' ||
      event.key === 'Escape' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Home' ||
      event.key === 'End'
    );
  }
}
