'use client';

import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import PostEditor from '@/components/post-editor';

export default function EditPostPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);

  return (
    <DashboardLayout>
      <PostEditor postId={postId} />
    </DashboardLayout>
  );
}