import { useEffect, useMemo, useRef, useState } from 'react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedGuides from '@/components/home/FeaturedGuides';
import RequestGuideDialog from '@/components/home/RequestGuideDialog';
import RequestSummaryBar from '@/components/home/RequestSummaryBar';
import GuideResults from '@/components/home/GuideResults';
import SupportChat from '@/components/home/SupportChat';
import { matchGuides } from '@/components/home/guideMatching';
import { MOCK_GUIDES } from '@/components/home/mockGuideData';
import type { RequestGuideDraft } from '@/components/home/requestGuideValidation';

export default function Home() {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestDraft, setRequestDraft] = useState<RequestGuideDraft | null>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const guideResults = useMemo(
    () => requestDraft ? matchGuides(requestDraft, MOCK_GUIDES) : [],
    [requestDraft],
  );

  useEffect(() => {
    if (!requestDraft) return;

    const frame = requestAnimationFrame(() => {
      resultsHeadingRef.current?.focus({ preventScroll: true });
      resultsHeadingRef.current?.scrollIntoView({ block: 'start' });
    });

    return () => cancelAnimationFrame(frame);
  }, [requestDraft]);

  const handleRequestSubmit = (draft: RequestGuideDraft) => {
    setRequestDraft(draft);
    setRequestDialogOpen(false);
  };

  const openRequestDialog = () => setRequestDialogOpen(true);

  return (
    <div className="home-page flex flex-col min-h-screen">
      <Navbar variant="home" />
      <main className="flex-1">
        {requestDraft ? (
          <div className="home-results">
            <div className="container">
              <header className="home-results-header">
                <span>Your local guide request</span>
                <h1 ref={resultsHeadingRef} tabIndex={-1}>Local friends for your trip</h1>
                <p>Based on your destination, language and interests.</p>
              </header>

              <RequestSummaryBar
                request={requestDraft}
                onEdit={openRequestDialog}
                onStartOver={() => setRequestDraft(null)}
              />

              <GuideResults results={guideResults} onEditRequest={openRequestDialog} />
            </div>
          </div>
        ) : (
          <>
            <Hero onRequestGuide={openRequestDialog} />
            <FeaturedGuides />
          </>
        )}
      </main>
      <Footer variant="home" />
      {!requestDialogOpen && <SupportChat />}
      <RequestGuideDialog
        open={requestDialogOpen}
        initialDraft={requestDraft}
        onOpenChange={setRequestDialogOpen}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}
