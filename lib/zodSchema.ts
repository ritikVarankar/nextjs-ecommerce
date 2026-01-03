import { z } from "zod";

export const zodSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be less than 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
  
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
  
  _id: z
    .string()
    .min(3, "Id is required"),
  
  alt: z
    .string()
    .min(3, "Alt is required"),

  title: z
    .string()
    .min(3, "Title is required"),
  
  slug: z
    .string()
    .min(3, "Slug is required"),
    
  category: z
    .string()
    .min(3, "Category is required"),

  mrp: z
    .string() 
    .min(1, "MRP is required"),

  sellingPrice: z
    .string() 
    .min(1, "Selling Price is required"),
  
  discountPercentage: z
    .string() 
    .min(1, "Discount Percentage is required"),
    
  description: z
    .string()
    .min(3, "Description is required"),

  media:z.array(z.string()),
  sku: z.string().trim().min(3, "SKU is required"),
  color: z.string().trim().min(3, "Color is required"),
  size: z.string().trim().min(1, "Size is required"),
  product: z.string().trim().min(3, "Product is required"),
  code: z.string().trim().min(3, "code is required"),
  // minShoppingAmount: z.union([
  //   z.number().positive('Expected positive value, recerived negative'),
  //   z.string().transform((val)=>Number(val)).refine((val)=>!isNaN(val) && val >=0)
  // ]),
  //  validity: z.coerce.date()
  minShoppingAmount: z.string().trim().min(1, "minShoppingAmount is required"),
  validity: z.string().trim().min(3, "validity is required"),
  userId: z.string().trim().min(3, "UserId is required"),
  rating: z.string(),
  review: z.string().trim().min(3, "Review is required"),

  phone: z.string().trim().min(1, "phone is required"),
  country: z.string().trim().min(1, "country is required"),
  state: z.string().trim().min(1, "state is required"),
  city: z.string().trim().min(1, "city is required"),
  pincode: z.string().trim().min(1, "pincode is required"),
  landmark: z.string().trim().min(1, "landmark is required"),
  ordernote: z.string().trim().min(1, "ordernote is required"),
  amount: z.string().trim().min(1, "amount is required"),
  address: z.string().trim().min(1, "address is required")
});

export type ZodeSchemaType = z.infer<typeof zodSchema>;


export const loginSchema = zodSchema.pick({
    email: true
  }).extend({
    password: z.string().min(3,"Password must be at least 3 characters")
  })
export type LoginSchemaType = z.infer<typeof loginSchema>;


export const registerSchema = zodSchema.pick({
    name:true,
    password:true,
    email: true
  }).extend({
    confirmPassword: z.string()
  }).refine((data)=>data.password === data.confirmPassword, {
    message:"Password and confirm password must be same.",
    path:['confirmPassword']
  })
export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const otpSchema = zodSchema.pick({
    email: true, otp:true
  })
export type OTPSchemaType = z.infer<typeof otpSchema>;

export const forwordPasswordSchema = zodSchema.pick({
    email: true
  })
export type ForwordPasswordSchemaType = z.infer<typeof forwordPasswordSchema>;

export const updatePasswordSchema = zodSchema.pick({
    email: true,
    password:true
  }).extend({
    confirmPassword: z.string()
  }).refine((data)=>data.password === data.confirmPassword, {
    message:"Password and confirm password must be same.",
    path:['confirmPassword']
  })
export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;


export const editMediaSchema = zodSchema.pick({
    _id: true,
    alt:true,
    title:true
  })
export type EditMediaSchemaType = z.infer<typeof editMediaSchema>;

export const addCategorySchema = zodSchema.pick({
    name: true,
    slug:true
  })
export type AddCategorySchemaType = z.infer<typeof addCategorySchema>;

export const updateCategorySchema = zodSchema.pick({
    _id:true,
    name: true,
    slug:true
  })
export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;

export const addProductSchema = zodSchema.pick({
  name: true,
  slug:true,
  category:true,
  mrp:true,
  sellingPrice:true,
  discountPercentage:true,
  description:true,
  media:true
})
export type AddProductSchemaType = z.infer<typeof addProductSchema>;

export const updateProductSchema = zodSchema.pick({
    _id:true,
    name: true,
    slug:true,
    category:true,
    mrp:true,
    sellingPrice:true,
    discountPercentage:true,
    description:true,
    media:true
  })
export type UpdateProductSchemaType = z.infer<typeof updateProductSchema>;


export const addProductVariantSchema = zodSchema.pick({
  product:true,
  sku:true,
  color:true,
  size:true,
  mrp:true,
  sellingPrice:true,
  discountPercentage:true,
  media:true
})
export type AddProductVariantSchemaType = z.infer<typeof addProductVariantSchema>;

export const updateProductVariantSchema = zodSchema.pick({
    _id:true,
    product:true,
    sku:true,
    color:true,
    size:true,
    mrp:true,
    sellingPrice:true,
    discountPercentage:true,
    media:true
  })
export type UpdateProductVariantSchemaType = z.infer<typeof updateProductVariantSchema>;

export const addCouponSchema = zodSchema.pick({
  code: true,
  discountPercentage:true,
  minShoppingAmount: true,
  validity:true
})
export type AddCouponSchemaType = z.infer<typeof addCouponSchema>;

export const updateCouponSchema = zodSchema.pick({
    _id:true,
    code: true,
    discountPercentage:true,
    minShoppingAmount: true,
    validity:true
  })
export type UpdateCouponSchemaType = z.infer<typeof updateCouponSchema>;


export const addReviewSchema = zodSchema.pick({
  product: true,
  userId:true,
  rating:true,
  title:true,
  review:true
})
export type AddReviewSchemaType = z.infer<typeof addReviewSchema>;

export const applyCouponSchema = zodSchema.pick({
  code: true,
  minShoppingAmount:true
})
export type ApplyCouponSchemaType = z.infer<typeof applyCouponSchema>;

export const placeOrderFormSchema = zodSchema.pick({
  name: true,
  email:true,
  phone: true,
  country:true,
  state: true,
  city:true,
  pincode: true,
  landmark:true,
  ordernote:true

}).extend({
  userId: z.string().optional()
})
export type PlaceOrderFormSchemaType = z.infer<typeof placeOrderFormSchema>;

export const paymentSchema = zodSchema.pick({
  amount: true
})
export type PaymentSchemaType = z.infer<typeof paymentSchema>;

export const profileSchema = zodSchema.pick({
    name: true,
    phone:true,
    address:true
  })
export type ProfileSchemaType = z.infer<typeof profileSchema>;


