
document.addEventListener("DOMContentLoaded", function () {
    // Handling decrement and increment buttons
    const decrementButton = document.getElementById("decrement");
    const incrementButton = document.getElementById("increment");
    const countElement = document.getElementById("count");
  
    let count = parseInt(countElement.textContent);
  
    decrementButton.addEventListener("click", function () {
      if (count > 1) {
        count--;
        countElement.textContent = count;
      }
    });
  
    incrementButton.addEventListener("click", function () {
      count++;
      countElement.textContent = count;
    });
  });
  
  // API URL for fetching product data
  const apiUrl =
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";
  
  // Asynchronous function to fetch data from the API
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Data received:", data);
  
      updateProductDetails(data.product);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  fetchData();
  
  // Function to update the HTML content
  function updateProductDetails(productData) {
    // Update heading and vendor
    const headingContainer = document.querySelector(".heading-container");
    headingContainer.querySelector("span").textContent = productData.vendor;
    headingContainer.querySelector("h1").textContent = productData.title;
  
    // Update prices
    const priceContainer = document.querySelector(".price-container");
    priceContainer.querySelector("h1").textContent = productData.price + ".00";
  
    // Function to extract numeric value from a price string
    const extractNumericValue = (priceString) => {
    
      return parseFloat(priceString.replace(/[^0-9.]/g, ""));
    };
  
    // Extract and calculate discount percentage
    const currentPrice = extractNumericValue(productData.price);
    const oldPrice = extractNumericValue(productData.compare_at_price);
    const discountPercentage = ((oldPrice - currentPrice) / oldPrice) * 100;
  
    // Update discount
    priceContainer.querySelector("span").textContent =
      discountPercentage.toFixed(0) + "% Off";
    priceContainer.querySelector("p").textContent =
      productData.compare_at_price + ".00";
  
    // Update colors
    const colorsBar = document.querySelector(".colors-bar");
    colorsBar.innerHTML = "";
    const colorOptions = productData.options.find(
      (option) => option.name === "Color"
    ).values;
  
    colorOptions.forEach((color, index) => {
      const colorOption = document.createElement("div");
      colorOption.className = "color-option";
      colorOption.style.backgroundColor = Object.values(color)[0];
      colorOption.addEventListener("click", () => handleColorClick(index));
      colorsBar.appendChild(colorOption);
    });
  
    function handleColorClick(index) {
      const selectedColorOption = colorsBar.querySelector(
        ".color-option.active-color"
      );
      if (selectedColorOption) {
        selectedColorOption.classList.remove("active-color");
      }
  
      const clickedColorOption = colorsBar.children[index];
      clickedColorOption.classList.add("active-color");
    }
  
    // Update sizes
    const sizeSelector = document.querySelector(".size-selector");
    sizeSelector.innerHTML = "";
    productData.options
      .find((option) => option.name === "Size")
      .values.forEach((size) => {
        const radioButton = document.createElement("div");
        radioButton.className = "radio-button";
        radioButton.innerHTML = `
              <input type="radio" id="${size.toLowerCase()}" name="size" />
              <label for="${size.toLowerCase()}">${size}</label>
            `;
        sizeSelector.appendChild(radioButton);
      });
  
    // Update product description
    const descriptionContainer = document.querySelector(".description-container");
    descriptionContainer.querySelector("p").innerHTML = productData.description;
  }
  
  // Event handler to change the main product image
  function changeProductImage(event) {
    const smallImages = document.querySelectorAll(".small-image");
    smallImages.forEach((image) => image.classList.remove("active-image"));
  
    if (event.target.classList.contains("small-image")) {
      event.target.classList.add("active-image");
  
      const mainProductImage = document.getElementById("mainProductImage");
      mainProductImage.src = event.target.src;
    }
  }
  
  const addToCartBtn = document.getElementById("addToCartBtn");
  addToCartBtn.addEventListener("click", addToCart);
  
  function addToCart() {
    // Get the product title
    const productTitle = document.querySelector(
      ".heading-container h1"
    ).textContent;
  
    // Get the selected size
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const sizeValue = selectedSize ? selectedSize.id : null;
  
    // Get the active color
    const activeColorOption = document.querySelector(
      ".color-option.active-color"
    );
    const colorValue = activeColorOption
      ? activeColorOption.style.backgroundColor
      : null;
  
    if (sizeValue && colorValue) {
      // Save the product title, selected size, and active color to local storage
      localStorage.setItem("cartProductTitle", productTitle);
      localStorage.setItem("cartSelectedSize", sizeValue);
      localStorage.setItem("cartActiveColor", colorValue);
  
      const addedProductsDiv = document.querySelector(".addedProducts");
      addedProductsDiv.textContent = `${productTitle} with Color ${colorValue} and Size ${sizeValue} added to cart`;
    } else {
      alert("Please select a size and color before adding to cart");
    }
  }