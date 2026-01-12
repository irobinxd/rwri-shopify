if (typeof TermsAndConditionsToggle !== 'function') {

  class TermsAndConditionsToggle extends HTMLElement {
    constructor() {
      super();

      this.checkbox = this.querySelector('#AgreeToTos');
      this.checkoutButton = document.querySelector('#CheckOut');

      if (this.checkbox && this.checkoutButton) {
        this.toggleCheckoutButton();

        this.checkbox.addEventListener('change', () => {
          this.toggleCheckoutButton();
        });
      }
    }

    toggleCheckoutButton() {
      // Checkout button is always enabled - terms checkbox no longer disables it
      if (this.checkoutButton) {
        this.checkoutButton.disabled = false;
      }
    }
  }

  if (typeof customElements.get('terms-checkbox') === 'undefined') {
    customElements.define('terms-checkbox', TermsAndConditionsToggle);
  }

}
