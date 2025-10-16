"use client";

import { useParams } from "next/navigation";
import CategoryEditor from "@/components/category-editor";

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);

  return <CategoryEditor categoryId={categoryId} />;
}
