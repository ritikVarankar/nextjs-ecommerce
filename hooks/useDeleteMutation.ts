import { showToast } from "@/lib/showToast";
import { MediaDataType } from "@/types/webAppDataType/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios";

interface DeleteMutationVariables {
  ids: string[];    // Assuming ids are an array of strings, adjust as needed
  deleteType: string; // "PD" or other possible values
}


export const useDeleteMutation = (queryKey:string, deleteEndPoint:string) =>{
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async({ ids, deleteType }:DeleteMutationVariables) => {
        const {  data:deleteResponse } = await axios({
            url:deleteEndPoint,
            method: deleteType === "PD" ? "DELETE" : "PUT",
            data: { ids, deleteType }
        });
        if(!deleteResponse.success){
            throw new Error(deleteResponse.message)
        }
        return deleteResponse
    },
    onError: (error) => {
        showToast('error',error.message);
    },
    onSuccess: (data) => {
        showToast('success',data.message);
        queryClient.invalidateQueries([queryKey] as any)
    },
  })
}