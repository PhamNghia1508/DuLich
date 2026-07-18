import { useState } from 'react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedGuides from '@/components/home/FeaturedGuides';
import RequestGuideDialog from '@/components/home/RequestGuideDialog';
import SupportChat from '@/components/home/SupportChat';
import type { RequestGuideDraft } from '@/components/home/requestGuideValidation';

export default function Home() {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [, setRequestDraft] = useState<RequestGuideDraft | null>(null);

  const handleRequestSubmit = (draft: RequestGuideDraft) => {
    setRequestDraft(draft);
    setRequestDialogOpen(false);
  };

  return (
    <div className="home-page flex flex-col min-h-screen">
      <Navbar variant="home" />
      <main className="flex-1">
        <Hero onRequestGuide={() => setRequestDialogOpen(true)} />
        <FeaturedGuides />
      </main>
      <Footer variant="home" />
      <SupportChat />
      <RequestGuideDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}
