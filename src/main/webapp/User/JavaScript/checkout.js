import checkForErrorMessageParameter from "./Common/checkForError.js"
import URL_Mapper from "./Utils/URL_Mapper.js"
import CartManager from "./Managers/CartManager.js"
import OrdersManager from "./Managers/OrdersManager.js"
import UserAuthTracker from "./Common/UserAuthTracker.js"
import MessagePopup from "./Common/MessagePopup.js"

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter()

  // Add fade-in animation to main sections
  const sections = document.querySelectorAll("main > section")
  sections.forEach((section, index) => {
    section.classList.add("fade-in")
    section.style.animationDelay = `${index * 0.2}s`
  })

  // DOM Elements
  const subtotalElement = document.getElementById("subtotal")
  const shippingFeeElement = document.getElementById("shippingFee")
  const totalAmountElement = document.getElementById("totalAmount")
  const addressElement = document.getElementById("address")
  const accountBalanceElement = document.getElementById("accountBalance")
  const currentBalanceDisplayElement = document.getElementById("currentBalanceDisplay")
  const deductionAmountElement = document.getElementById("deductionAmount")
  const creditCardForm = document.getElementById("creditCardForm")
  const balanceNotice = document.getElementById("balanceNotice")
  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]')
  const backToCartButton = document.getElementById("backToCart")
  const placeOrderButton = document.getElementById("placeOrderButton")
  const expiryYearSelect = document.getElementById("expiryYear")

  // State variables
  let subtotal = 0
  let shippingFee = 30 // Default shipping fee
  let totalAmount = 0

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Initialize checkout page
  function initCheckoutPage() {
    // Populate expiry year dropdown
    populateExpiryYears()

    // Fetch cart subtotal
    CartManager.getSubtotal(userObject.userID, onSubtotalLoaded, onError)

    // Fetch shipping fee
    CartManager.getShippingFee(userObject.userID, onShippingFeeLoaded, onError)

    // Set user address
    addressElement.textContent = userObject.address || "No address provided"

    // Set account balance
    const balance = userObject.accountBalance || 0
    accountBalanceElement.textContent = balance.toFixed(2)
    currentBalanceDisplayElement.textContent = balance.toFixed(2)

    // Event listeners
    backToCartButton.addEventListener("click", () => {
      window.location.href = URL_Mapper.CART
    })

    placeOrderButton.addEventListener("click", placeOrder)

    // Payment method change handler
    paymentMethodRadios.forEach((radio) => {
      radio.addEventListener("change", togglePaymentMethod)
    })
  }

  // Populate expiry years dropdown
  function populateExpiryYears() {
    const currentYear = new Date().getFullYear()
    for (let i = 0; i < 10; i++) {
      const year = currentYear + i
      const option = document.createElement("option")
      option.value = year.toString().slice(-2) // Last two digits
      option.textContent = year
      expiryYearSelect.appendChild(option)
    }
  }

  // Handle subtotal loaded from API
  function onSubtotalLoaded(data) {
    subtotal = data
    updateOrderSummary()
  }

  // Handle shipping fee loaded from API
  function onShippingFeeLoaded(data) {
    shippingFee = data
    updateOrderSummary()
  }

  // Handle API errors
  function onError(error) {
    console.error("Error loading checkout data:", error)
    MessagePopup.show("Error loading checkout data: " + error, true)
  }

  // Update order summary
  function updateOrderSummary() {
    totalAmount = subtotal + shippingFee

    subtotalElement.textContent = subtotal.toFixed(2)
    shippingFeeElement.textContent = shippingFee.toFixed(2)
    totalAmountElement.textContent = totalAmount.toFixed(2)

    // Update deduction amount for account balance payment
    deductionAmountElement.textContent = totalAmount.toFixed(2)

    // Check if account balance is sufficient
    const balance = userObject.accountBalance || 0
    const accountBalanceRadio = document.querySelector('input[value="accountBalance"]')

    if (balance < totalAmount) {
      accountBalanceRadio.disabled = true
      accountBalanceRadio.parentElement.title = "Insufficient balance"

      // If account balance is selected but insufficient, switch to credit card
      if (accountBalanceRadio.checked) {
        document.querySelector('input[value="creditCard"]').checked = true
        togglePaymentMethod()
      }
    } else {
      accountBalanceRadio.disabled = false
      accountBalanceRadio.parentElement.title = ""
    }
  }

  // Toggle payment method display
  function togglePaymentMethod() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value

    if (selectedMethod === "creditCard") {
      creditCardForm.style.display = "block"
      balanceNotice.style.display = "none"
    } else {
      creditCardForm.style.display = "none"
      balanceNotice.style.display = "block"
    }
  }

  // Place order
  function placeOrder() {
    // Validate shipping address
    if (!userObject.address) {
      MessagePopup.show("Please update your profile with a shipping address", true)
      return
    }

    // Get selected payment method
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value

    // Show loading state
    placeOrderButton.textContent = "Processing..."
    placeOrderButton.disabled = true

    if (selectedMethod === "creditCard") {
      // Validate credit card form
      const nameOnCard = document.getElementById("nameOnCard").value.trim()
      const cardNumber = document.getElementById("cardNumber").value.trim()
      const expiryMonth = document.getElementById("expiryMonth").value
      const expiryYear = document.getElementById("expiryYear").value
      const cvc = document.getElementById("cvc").value.trim()

      if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvc) {
        MessagePopup.show("Please fill in all credit card details", true)
        resetPlaceOrderButton()
        return
      }

      // Create credit card details object
      const creditCardDetails = {
        nameOnCard,
        cardNumber,
        expiryMonth,
        expiryYear,
        cvc,
      }

      // Place order with credit card
      OrdersManager.checkoutUsingCreditCard(
        userObject.userID,
        userObject.address,
        creditCardDetails,
        onOrderPlaced,
        onOrderError,
      )
    } else {
      // Place order with account balance
      OrdersManager.checkoutUsingAccountBalance(userObject.userID, userObject.address, onOrderPlaced, onOrderError)
    }
  }

  // Handle successful order placement
  function onOrderPlaced(orderData) {
    MessagePopup.show("Order placed successfully!")

    // Redirect to order details page
    setTimeout(() => {
      window.location.href = `${URL_Mapper.ORDER_DETAILS}?orderID=${orderData.orderID}`
    }, 1500)
  }

  // Handle order placement error
  function onOrderError(error) {
    MessagePopup.show("Failed to place order: " + error, true)
    resetPlaceOrderButton()
  }

  // Reset place order button state
  function resetPlaceOrderButton() {
    placeOrderButton.textContent = "Place Order"
    placeOrderButton.disabled = false
  }

  // Initialize the page
  initCheckoutPage()
})
