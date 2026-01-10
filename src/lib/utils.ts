import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";
import { differenceInDays, differenceInHours } from "date-fns";
import { CartProductType } from "@/types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to grid grid classnames dependng on length
export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

export const getTimeUntil = (
  targetDate: string
): { days: number; hours: number } => {
  // Convert the date string to a Date object
  const target = new Date(targetDate);
  const now = new Date();

  // Ensure the target date is in the future
  if (target <= now) return { days: 0, hours: 0 };

  // Calculate days and hours left
  const totalDays = differenceInDays(target, now);
  const totalHours = differenceInHours(target, now) % 24;

  return { days: totalDays, hours: totalHours };
};

/**
 * Function: getShippingDatesRange
 * Description: Returns the shipping date range by adding the specified min and max days to the current date.
 * Parameters:
 *    - minDays: Minimum number of days to add to the current date.
 *    - maxDays: Maximum number of days to add to the current date.
 * Returns: Object containing minDate and maxDate.
 */

export const getShippingDatesRange = (
  minDays: number,
  maxDays: number,
  date?: Date
): { minDate: string; maxDate: string } => {
  // Get the current date
  const currentDate = date ? new Date(date) : new Date();

  // Calculate minDate by adding minDays to current date
  const minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + minDays);

  // Calculate maxDate by adding maxDays to current date
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + maxDays);

  // Return an object containing minDate and maxDate
  return {
    minDate: minDate.toDateString(),
    maxDate: maxDate.toDateString(),
  };
};

// Function to validate the product data before adding it to the cart
export const isProductValidToAdd = (product: CartProductType): boolean => {
  // Check that all required fields are filled
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    image,
    quantity,
    // price,
    sizeId,
    // size,
    stock,
    // shippingFee,
    // extraShippingFee,
    shippingMethod,
    //shippingService,
    // variantImage,
    // weight,
    deliveryTimeMin,
    deliveryTimeMax,
  } = product;

  // Ensure that all necessary fields have values
  if (
    !productId ||
    !variantId ||
    !productSlug ||
    !variantSlug ||
    !name ||
    !variantName ||
    !image ||
    quantity <= 0 ||
    // price <= 0 ||
    !sizeId || // Ensure sizeId is not empty
    // !size || // Ensure size is not empty
    stock <= 0 ||
    // weight <= 0 || // Weight should be <= 0
    !shippingMethod ||
    // !variantImage ||
    deliveryTimeMin < 0 ||
    deliveryTimeMax < deliveryTimeMin // Ensure delivery times are valid
  ) {
    return false; // Validation failed
  }

  return true; // Product is valid
};

// Handle product history in localStorage
export const updateProductHistory = (variantId: string) => {
  // Fetch existing product history from localStorage
  let productHistory: string[] = [];
  const historyString = localStorage.getItem("productHistory");

  if (historyString) {
    try {
      productHistory = JSON.parse(historyString);
    } catch (error) {
      productHistory = [];
    }
  }

  // Update the history: Remove the product if it exists, and add it to the front
  productHistory = productHistory.filter((id) => id !== variantId);
  productHistory.unshift(variantId);

  // Check storage limit (manage max number of products)
  const MAX_PRODUCTS = 100;
  if (productHistory.length > MAX_PRODUCTS) {
    productHistory.pop(); // Remove the oldest product
  }
  // Save updated history to localStorage
  localStorage.setItem("productHistory", JSON.stringify(productHistory));
};

export const downloadBlobAsFile = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const printPDF = (blob: Blob) => {
  const pdfUrl = URL.createObjectURL(blob);
  const printWindow = window.open(pdfUrl, "_blank");
  if (printWindow) {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }
};
