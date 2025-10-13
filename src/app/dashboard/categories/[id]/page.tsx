'use client';

import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import CategoryEditor from '@/components/category-editor';

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);

  return (
    <DashboardLayout>
      <CategoryEditor categoryId={categoryId} />
    </DashboardLayout>
  );
}