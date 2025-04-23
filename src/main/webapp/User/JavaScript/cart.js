import checkForErrorMessageParameter from "./Common/checkForError.js";
import "./Common/pageLoader.js";
import URL_Mapper from "./Utils/URL_Mapper.js";
import UserAuthTracker from "./Common/UserAuthTracker.js";
import MessagePopup from "./Common/MessagePopup.js";
import CartManager from "./Managers/CartManager.js";

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter();

  // DOM Elements
  const cartItemsContainer = document.getElementById("cartItems");
  const cartSummaryContainer = document.getElementById("cartSummary");
  const emptyCartMessage = document.getElementById("emptyCartMessage");

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject;
  if (!userObject) {
    displayUnauthenticatedState();
    return;
  }

  // Initialize cart page
  function initCartPage() {
    cartItemsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading cart"></div>
      </div>
    `;

    CartManager.getCart(
      userObject.userID,
      (response) => {
        if (!response.success && response.data === "you should log in first") {
          displayUnauthenticatedState();
          return;
        }
        const cartItems = response.data || [];
        if (cartItems.length === 0) {
          displayEmptyCart();
        } else {
          displayCartItems(cartItems);
          updateCartSummary(cartItems);
        }
      },
      (error) => {
        MessagePopup.show("Failed to load cart. Please try again.", true);
        console.error("Cart load error:", error);
        displayEmptyCart();
      }
    );
  }

  // Display unauthenticated state
  function displayUnauthenticatedState() {
    cartItemsContainer.innerHTML = "";
    emptyCartMessage.classList.remove("hidden");
    emptyCartMessage.innerHTML = `
      <p>You need to log in to view your cart.</p>
      <a href="${URL_Mapper.WELCOME}" class="continue-shopping">Log In</a>
    `;
    cartSummaryContainer.innerHTML = `
      <h2>Order Summary</h2>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>0.00 EGP</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>0.00 EGP</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>0.00 EGP</span>
      </div>
    `;
  }

  // Display cart items
  function displayCartItems(cartItems) {
    cartItemsContainer.innerHTML = "";
    emptyCartMessage.classList.add("hidden");

    cartItems.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      cartItemElement.style.animationDelay = `${index * 0.1}s`;

      const imageUrl = item.image || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;

      cartItemElement.innerHTML = `
        <div class="cart-item-image">
          <img src="${imageUrl}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p class="cart-item-author">By ${item.author || "Unknown"}</p>
          <p class="cart-item-price">${item.price.toFixed(2)} EGP</p>
          <div class="cart-item-quantity">
            <button class="quantity-button decrease-quantity" data-book-id="${item.bookID}">-</button>
            <input type="number" min="1" max="${item.stock}" value="${item.quantity}" class="quantity-input" data-book-id="${item.bookID}">
            <button class="quantity-button increase-quantity" data-book-id="${item.bookID}">+</button>
          </div>
        </div>
        <div class="cart-item-actions">
          <span class="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)} EGP</span>
          <button class="remove-item" data-book-id="${item.bookID}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      cartItemsContainer.appendChild(cartItemElement);
    });

    // Add event listeners
    const decreaseButtons = document.querySelectorAll(".decrease-quantity");
    const increaseButtons = document.querySelectorAll(".increase-quantity");
    const quantityInputs = document.querySelectorAll(".quantity-input");
    const removeButtons = document.querySelectorAll(".remove-item");

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const bookID = button.dataset.bookId;
        const input = document.querySelector(`.quantity-input[data-book-id="${bookID}"]`);
        const currentValue = Number.parseInt(input.value);
        if (currentValue > 1) {
          input.value = currentValue - 1;
          updateCartItemQuantity(bookID, currentValue - 1);
        }
      });
    });

    increaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const bookID = button.dataset.bookId;
        const input = document.querySelector(`.quantity-input[data-book-id="${bookID}"]`);
        const currentValue = Number.parseInt(input.value);
        const maxValue = Number.parseInt(input.max);
        if (currentValue < maxValue) {
          input.value = currentValue + 1;
          updateCartItemQuantity(bookID, currentValue + 1);
        }
      });
    });

    quantityInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const bookID = input.dataset.bookId;
        let value = Number.parseInt(input.value);
        const maxValue = Number.parseInt(input.max);

        if (value < 1) value = 1;
        if (value > maxValue) value = maxValue;

        input.value = value;
        updateCartItemQuantity(bookID, value);
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const bookID = button.dataset.bookId;
        removeCartItem(bookID);
      });
    });
  }

  // Update cart summary
  function updateCartSummary(cartItems) {
    CartManager.getSubtotal(
      userObject.userID,
      (subtotalResponse) => {
        if (!subtotalResponse.success && subtotalResponse.data === "you should log in first") {
          displayUnauthenticatedState();
          return;
        }
        const subtotal = subtotalResponse.data || 0;
        CartManager.getShippingFee(
          userObject.userID,
          (shippingResponse) => {
            if (!shippingResponse.success && shippingResponse.data === "you should log in first") {
              displayUnauthenticatedState();
              return;
            }
            const shipping = shippingResponse.data || 0;
            const total = subtotal + shipping;

            cartSummaryContainer.innerHTML = `
              <h2>Order Summary</h2>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} EGP</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)} EGP</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)} EGP</span>
              </div>
              <button id="checkoutButton" class="checkout-button">
                Proceed to Checkout
              </button>
              <a href="${URL_Mapper.PRODUCTS}" class="continue-shopping">
                Continue Shopping
              </a>
            `;

            document.getElementById("checkoutButton").addEventListener("click", () => {
              window.location.href = URL_Mapper.CHECKOUT;
            });
          },
          (error) => {
            MessagePopup.show("Failed to load shipping fee.", true);
            console.error("Shipping fee error:", error);
          }
        );
      },
      (error) => {
        MessagePopup.show("Failed to load subtotal.", true);
        console.error("Subtotal error:", error);
      }
    );
  }

  // Display empty cart message
  function displayEmptyCart() {
    cartItemsContainer.innerHTML = "";
    emptyCartMessage.classList.remove("hidden");
    emptyCartMessage.innerHTML = `
      <p>Your cart is empty.</p>
      <a href="${URL_Mapper.PRODUCTS}" class="continue-shopping">Browse Books</a>
    `;
    cartSummaryContainer.innerHTML = `
      <h2>Order Summary</h2>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>0.00 EGP</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>0.00 EGP</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>0.00 EGP</span>
      </div>
      <a href="${URL_Mapper.PRODUCTS}" class="continue-shopping">
        Browse Books
      </a>
    `;
  }

  // Update cart item quantity
  function updateCartItemQuantity(bookID, quantity) {
    CartManager.updateCartItem(
      userObject.userID,
      bookID,
      quantity,
      (response) => {
        if (!response.success && response.data === "you should log in first") {
          displayUnauthenticatedState();
          return;
        }
        const cartItems = document.querySelectorAll(".cart-item");
        const updatedItems = [];

        cartItems.forEach((item) => {
          const itemBookID = item.querySelector(".quantity-input").dataset.bookId;
          const itemQuantity = Number.parseInt(item.querySelector(".quantity-input").value);
          const itemPrice = Number.parseFloat(item.querySelector(".cart-item-price").textContent);
          const subtotalElement = item.querySelector(".cart-item-subtotal");

          if (itemBookID === bookID) {
            subtotalElement.textContent = `${(itemPrice * quantity).toFixed(2)} EGP`;
          }

          updatedItems.push({
            bookID: itemBookID,
            price: itemPrice,
            quantity: itemBookID === bookID ? quantity : itemQuantity,
          });
        });

        updateCartSummary(updatedItems);
        MessagePopup.show("Quantity updated");
      },
      (error) => {
        MessagePopup.show("Failed to update quantity.", true);
        console.error("Quantity update error:", error);
        initCartPage(); // Refresh cart
      }
    );
  }

  // Remove cart item
  function removeCartItem(bookID) {
    const itemToRemove = document
      .querySelector(`.cart-item .quantity-input[data-book-id="${bookID}"]`)
      .closest(".cart-item");

    itemToRemove.classList.add("removing");

    CartManager.removeCartItem(
      userObject.userID,
      bookID,
      (response) => {
        if (!response.success && response.data === "you should log in first") {
          itemToRemove.classList.remove("removing");
          displayUnauthenticatedState();
          return;
        }
        setTimeout(() => {
          itemToRemove.remove();
          const remainingItems = document.querySelectorAll(".cart-item");
          if (remainingItems.length === 0) {
            displayEmptyCart();
          } else {
            const updatedItems = [];
            remainingItems.forEach((item) => {
              const itemBookID = item.querySelector(".quantity-input").dataset.bookId;
              const itemQuantity = Number.parseInt(item.querySelector(".quantity-input").value);
              const itemPrice = Number.parseFloat(item.querySelector(".cart-item-price").textContent);

              updatedItems.push({
                bookID: itemBookID,
                price: itemPrice,
                quantity: itemQuantity,
              });
            });
            updateCartSummary(updatedItems);
          }
          MessagePopup.show("Item removed from cart");
        }, 300);
      },
      (error) => {
        itemToRemove.classList.remove("removing");
        MessagePopup.show("Failed to remove item.", true);
        console.error("Remove item error:", error);
      }
    );
  }

  // Update addToCart function
  function addToCart(bookID, quantity) {
    if (!userObject) {
      MessagePopup.show("Please log in to add items to your cart", true);
      return;
    }

    CartManager.addItem(
      userObject.userID,
      bookID,
      quantity,
      (response) => {
        if (!response.success && response.data === "you should log in first") {
          displayUnauthenticatedState();
          return;
        }
        MessagePopup.show(`Added ${quantity} item(s) to cart!`);
        initCartPage(); // Refresh cart
      },
      (error) => {
        MessagePopup.show("Failed to add item to cart.", true);
        console.error("Add to cart error:", error);
      }
    );
  }

  // Initialize the page
  initCartPage();
});