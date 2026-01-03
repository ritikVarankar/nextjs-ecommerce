import { ApiErrorData, ApiResponse, AppError } from "@/types/apidatatype/types";
import { NextResponse } from "next/server"
import Swal from 'sweetalert2';

export const sizes = [
  {
    value:'S',
    label:'Small', 
  },
  {
    value:'M',
    label:'Medium', 
  },
  {
    value:'L',
    label:'Large', 
  },
  {
    value:'XL',
    label:'Extra Large', 
  },
  {
    value:'2XL',
    label:'2X Large', 
  }
];

export const sortings = [
  { label:'Default Sorting', value:'default_sorting' },
  { label:'Ascending Order', value:'asc' },
  { label:'Descending Order', value:'desc' },
  { label:'Price: Low To High', value:'price_low_high' },
  { label:'Price: High To Low', value:'price_high_low' },
]

export const orderStatus = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'unverified'
]


export const handleSuccess=(title:string,Subtitle:string='')=>{
    Swal.fire(title, Subtitle, "success");
}

export const handleError=(title:string,Subtitle:string='')=>{
    Swal.fire(title, Subtitle, "error");
}

export const handleQuestion=(title:string,Subtitle:string='')=>{
    Swal.fire(title, Subtitle, "question");
}

export const handleInfo=(title:string,Subtitle:string='')=>{
    Swal.fire(title, Subtitle, "info");
}

export const handleWarning=(title:string,Subtitle:string='')=>{
    Swal.fire(title, Subtitle, "warning");
}

export const response = <T>(success: boolean, statusCode: number, message: string, data?: T) => {
  const res: ApiResponse<T> = { success, statusCode, message, data };
  return NextResponse.json(res);
};

export const catchError = (
  error: AppError,
  customMessage: string = ""
) => {
  // Mongo Duplicate Key Error
  if (error.code === 11000 && error.keyPattern) {
    const keys = Object.keys(error.keyPattern).join(",");
    error.message = `Duplicate field: ${keys}. These fields must be unique.`;
  }

  // Structured error output
  let errorObj: ApiErrorData & { message: string };

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error
    };
  } else {
    errorObj = {
      message: customMessage || "Internal server error."
    };
  }

  const { message, ...data } = errorObj;

  return response<ApiErrorData>(
    false,
    error.code ?? 500,
    message,
    data
  );
};

export const handleCatch=(error: unknown)=>{
    if (error instanceof Error) {
        return catchError({
            code: (error as any).code,
            message: error.message,
            stack: error.stack
        });
    }
    return catchError({
      message: "Unknown error occurred",
      code: 400
    });
}

export const generateOTP = () =>{
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}



export const columnsConfig =(column:any, isCreatedAt=false, isUpdatedAt=false, isDeletedAt=false)=>{
  const newColumn = [...column];
  if(isCreatedAt){
    newColumn.push({
      accessorKey:'createdAt',
      header:'Created At',
      Cell: ({ renderedCellValue }:any) => (new Date(renderedCellValue).toLocaleString())
    })
  }

  if(isUpdatedAt){
    newColumn.push({
      accessorKey:'updatedAt',
      header:'Updated At',
      Cell: ({ renderedCellValue }:any) => (new Date(renderedCellValue).toLocaleString())
    })
  }

  if(isDeletedAt){
    newColumn.push({
      accessorKey:'deletedAt',
      header:'Deleted At',
      Cell: ({ renderedCellValue }:any) => (new Date(renderedCellValue).toLocaleString())
    })
  }

  return newColumn;

}



