import { categoriesTypes } from "@/utils/categories";
import { Key } from "react";

export interface UploadData {
  id: Key | null | undefined;
  cards: Array<{
    uploads: any;
    uri: string;
    _id: string;
    owner?: {
      name: string;
      id: string;
    };
    file: string;
    category: categoriesTypes;
  }>;
}