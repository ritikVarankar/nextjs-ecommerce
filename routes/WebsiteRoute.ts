export const WEBSITE_HOME = "/"
export const WEBSITE_LOGIN = "/auth/login"
export const WEBSITE_REGISTER = "/auth/register"
export const WEBSITE_RESETPASSWORD = "/auth/reset-password"



// Shop Routes
export const WEBSITE_SHOP="/shop";

// Product Details
export const WEBSITE_PRODUCT_DETAILS= (slug:string)=> slug ? `/product/${slug}` : '/product';
// Cart
export const WEBSITE_CART="/cart";
// checkout
export const WEBSITE_CHECKOUT="/checkout"

// ORDER Details
export const WEBSITE_ORDER_DETAILS= (order_id:string)=> `/order-details/${order_id}`;

// User Routes
export const USER_DASHBOARD="/my-account";
export const USER_PROFILE="/profile";
export const USER_ORDERS="/orders";

export const WEBSITE_ABOUTUS="/about-us";
export const WEBSITE_TERMSANDCONDITIONS="/terms-and-conditions";
export const WEBSITE_PRIVACYANDPOLICY="/privacy-policy";