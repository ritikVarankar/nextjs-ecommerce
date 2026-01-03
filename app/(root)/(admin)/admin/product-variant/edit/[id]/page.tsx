'use client'

import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import Editor from "@/components/application/Admin/Editor";
import MediaModal from "@/components/application/Admin/MediaModal";
import Select from "@/components/application/Admin/Select";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { UpdateProductSchemaType, updateProductSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoute";
import { MediaDataType } from "@/types/webAppDataType/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from 'slugify';
import Image from "next/image";
import { showToast } from "@/lib/showToast";
import axios from "axios";

interface CategoryOption {
  name: string;
  _id: string;
}

interface EditCategoryProps {
  params: Promise<{ id: string }>;
}

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Products' },
  { href: '', label: 'Edit Product' }
]

function EditProduct({ params }: EditCategoryProps) {
  const { id } = use(params);
  const { data: getCategory } = useFetch('/api/category?size=10&deleteType=SD');
  const { data: getProduct, loading: getProductLoading } = useFetch(`/api/product/get/${id}`);
  const [inputs, setInputs] = useState({
    loading: false,
    categoryOption: [],
    open: false,
    selectedMedia: [],
    isMultiple: true
  });

  const handleInputsOnChange = (text: string, value: boolean | string | MediaDataType[]) => {
    setInputs((prev) => ({ ...prev, [text]: value }));
  }

  const form = useForm<UpdateProductSchemaType>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
      category: "",
      mrp: "0",
      sellingPrice: "0",
      discountPercentage: "0",
      description: "",
      media: []
    }
  });

  const handleEditProductSubmit = async (values: UpdateProductSchemaType) => {
    console.log("Form Submitted with values: ", values, typeof values); // Debugging form submission
    try {
      handleInputsOnChange("loading", true);

      if (inputs.selectedMedia.length <= 0) {
        return showToast('error', 'Please select media');
      }

      const mediaIds = inputs.selectedMedia.map((media: MediaDataType) => media._id);
      values.media = mediaIds;
      const obj = {
        ...values,
        discountPercentage: String(values.discountPercentage),
        mrp: String(values.mrp),
        sellingPrice: String(values.sellingPrice)
      };

      const { data: productResponse } = await axios.put("/api/product/update", obj);

      if (!productResponse.success) {
        throw new Error(productResponse.message);
      }

      showToast('success', productResponse.message);
      handleInputsOnChange("selectedMedia", []);
    } catch (error) {
      if (error instanceof Error) {
        showToast('error', error.message);
      } else {
        showToast('error', 'An unknown error occurred');
      }
    } finally {
      handleInputsOnChange("loading", false);
    }
  }

  const editor = (event: any, editor: { getData: () => any; }) => {
    const data = editor.getData();
    form.setValue('description', data);
  }

  useEffect(() => {
    if (getCategory) {
      const options = getCategory.map((cat: CategoryOption) => ({ label: cat.name, value: cat._id }));
      handleInputsOnChange('categoryOption', options);
    }
  }, [getCategory]);

  useEffect(() => {
    if (getProduct) {
      console.log('getProduct=',getProduct,typeof getProduct.mrp,typeof getProduct.sellingPrice)
      form.reset({
        _id: getProduct._id,
        name: getProduct.name,
        slug: getProduct.slug,
        category: getProduct.category,
        mrp: String(getProduct.mrp),
        sellingPrice: String(getProduct.sellingPrice),
        discountPercentage: String(getProduct.discountPercentage),
        description: getProduct.description
      });

      if (getProduct.media) {
        const media = getProduct.media.map((media: MediaDataType) => ({
          _id: media._id,
          url: media.secure_url
        }));
        console.log("media=",media);
        handleInputsOnChange("selectedMedia", media);
      }
    }
  }, [getProduct]);

  useEffect(() => {
    if (inputs.selectedMedia.length > 0) {
      const mediaIds = inputs.selectedMedia.map((media: MediaDataType) => media._id);
      form.setValue('media', mediaIds);
    }
  }, [inputs.selectedMedia]);


  useEffect(() => {
    const name = form.getValues('name');
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase());
    }
  }, [form.watch('name')]);

  // Discount Percentage Calculation
  useEffect(() => {
    const mrp = form.getValues('mrp') || 0;
    const sellingPrice = form.getValues('sellingPrice') || 0;
    if (Number(mrp) > 0 && Number(sellingPrice) > 0) {
      const discountPercentage = ((Number(mrp) - Number(sellingPrice)) / Number(mrp)) * 100;
      form.setValue('discountPercentage', String(Math.round(discountPercentage)));
    }
  }, [form.watch('mrp'), form.watch('sellingPrice')]);

  // useEffect(() => {
  //   console.log("errors", form.formState.errors);
  // }, [form.formState.errors]);

  return (
    <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Product</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditProductSubmit)} className="grid md:grid-cols-2 grid-cols-1 gap-5">
              {/* Name Field */}
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Slug Field */}
              <div>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Category Field */}
              <div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select options={inputs.categoryOption} selected={field.value} setSelected={field.onChange} isMulti={false} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* MRP Field */}
              <div>
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="Enter MRP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Selling Price Field */}
              <div>
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="Enter Selling Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Discount Percentage Field */}
              <div>
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="Enter Discount Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Editor */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        {!getProductLoading && (
                          <Editor onChange={editor} initialData={form.getValues('description')} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Media Selection */}
              <div className="col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModal
                  open={inputs.open}
                  handleInputsOnChange={handleInputsOnChange}
                  selectedMedia={inputs.selectedMedia}
                  isMultiple={inputs.isMultiple}
                />
                {inputs.selectedMedia.length > 0 && (
                  <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                    {inputs.selectedMedia.map((media: MediaDataType) => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          src={media.url || ""}
                          alt={media.alt || 'Image'}
                          height={100}
                          width={100}
                          className="object-cover size-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer" onClick={() => handleInputsOnChange('open', true)}>
                  <span className="font-semibold">Select Media</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="my-3">
                <ButtonLoading className="cursor-pointer" type="submit" text="Update Product" loading={inputs.loading} />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProduct;
