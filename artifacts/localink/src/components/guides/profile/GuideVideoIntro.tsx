
import { useEffect, useRef, useState } from 'react';
import { Info, Play, Video, X } from 'lucide-react';
import type { Guide } from '@/types';
import SafeImage from '@/components/ui/SafeImage';

interface GuideVideoIntroProps {
  guide: Guide;
}

export default function GuideVideoIntro({ guide }: GuideVideoIntroProps) {
  const [showModal, setShowModal] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const posterImage = guide.avatar;

  const closeModal = () => {
    setShowModal(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!showModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showModal]);

  return (
    <section className="profile-video-section" aria-labelledby="video-title">
      <div className="profile-section-heading">
        <div>
          <h2 id="video-title">Meet {guide.firstName}</h2>
          <p>A short introduction to Linh&apos;s tone, English fluency, and guiding style before you request a booking.</p>
        </div>
      </div>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setShowModal(true)}
        className="profile-video-trigger group"
        aria-label={`Open ${guide.firstName}'s video introduction details`}
      >
        <SafeImage
          src={posterImage}
          alt={`${guide.firstName} ${guide.lastName}, local guide in ${guide.city}`}
          className="h-full w-full"
          imageClassName="h-full w-full object-cover object-[50%_38%] transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="profile-video-wash" aria-hidden="true" />
        <span className="profile-video-play" aria-hidden="true">
          <Play size={26} className="fill-white" />
        </span>
        <span className="profile-video-duration">
          <Video size={13} />
          1:24 intro
        </span>
      </button>

      <p className="mt-4 max-w-[640px] text-sm leading-6 text-[#5A5A5A]">
        The final clip will help travelers judge communication style and personality. For now, this opens the existing introduction details.
      </p>

      {showModal && (
        <div
          className="profile-video-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-dialog-title"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}
        >
          <div className="profile-video-dialog">
            <button ref={closeRef} type="button" onClick={closeModal} className="profile-video-close" aria-label="Close video introduction">
              <X size={20} />
            </button>

            <div className="flex gap-4 items-start pt-2">
              <div className="bg-[#FAF0ED] p-3 rounded-full text-[#C4614A]">
                <Info size={24} />
              </div>
              <div className="space-y-2">
                <h3 id="video-dialog-title" className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1C3A2E]">
                  Video introduction
                </h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">
                  Linh Nguyen&apos;s personal video introduction is currently preparing. In the final platform, this clip features a greeting, language assessment, and a short walking preview of District 1.
                </p>
                <p className="text-xs text-[#8A8A8A]">
                  Travelers can use this to gauge communication skills, pronunciation, and personality prior to booking.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="button" onClick={closeModal} className="btn btn-primary min-h-11 rounded-xl px-6 py-2.5 text-xs font-bold">
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
