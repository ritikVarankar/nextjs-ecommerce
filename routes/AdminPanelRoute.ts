export const ADMIN_DASHBOARD="/admin/dashboard";

// Media Routes
export const ADMIN_MEDIA_SHOW="/admin/media";
export const ADMIN_MEDIA_EDIT= (id:string)=> id ? `/admin/media/edit/${id}` : '';

// CATEGORY Routes
export const ADMIN_CATEGORY_ADD="/admin/category/add";
export const ADMIN_CATEGORY_SHOW="/admin/category";
export const ADMIN_CATEGORY_EDIT= (id:string)=> id ? `/admin/category/edit/${id}` : '';

// PRODUCT Routes
export const ADMIN_PRODUCT_ADD="/admin/product/add";
export const ADMIN_PRODUCT_SHOW="/admin/product";
export const ADMIN_PRODUCT_EDIT= (id:string)=> id ? `/admin/product/edit/${id}` : '';

// PRODUCT_Variant Routes
export const ADMIN_PRODUCT_VARIANT_ADD="/admin/product-variant/add";
export const ADMIN_PRODUCT_VARIANT_SHOW="/admin/product-variant";
export const ADMIN_PRODUCT_Variant_EDIT= (id:string)=> id ? `/admin/product-variant/edit/${id}` : '';

// COUPON Routes
export const ADMIN_COUPON_ADD="/admin/coupon/add";
export const ADMIN_COUPON_SHOW="/admin/coupon";
export const ADMIN_COUPON_EDIT= (id:string)=> id ? `/admin/coupon/edit/${id}` : '';

// CUSTOMERS Routes
export const ADMIN_CUSTOMERS_SHOW="/admin/customers";

// REVIEW Routes
export const ADMIN_REVIEW_SHOW="/admin/review";

// Trash route
export const ADMIN_TRASH="/admin/trash";

// Orders route
export const ADMIN_ORDER_SHOW="/admin/orders";
export const ADMIN_ORDERS_DETAILS= (order_id:string)=> order_id ? `/admin/orders/details/${order_id}` : '';

