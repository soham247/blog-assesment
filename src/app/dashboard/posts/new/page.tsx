import DashboardLayout from '@/components/dashboard-layout';
import PostEditor from '@/components/post-editor';

export default function NewPostPage() {
  return (
    <DashboardLayout>
      <PostEditor />
    </DashboardLayout>
  );
}