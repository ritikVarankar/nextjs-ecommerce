import { ListItemIcon, MenuItem } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteActionProps {
  row: any;
  deleteType: string;
  handleDelete: (ids: string[], type: string) => void;
}

function DeleteAction({
  handleDelete,
  row,
  deleteType,
}: DeleteActionProps) {
  return (
    <MenuItem
      onClick={() => handleDelete([row._id], deleteType)}
      aria-label="Delete item"
    >
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
}

export default DeleteAction;
