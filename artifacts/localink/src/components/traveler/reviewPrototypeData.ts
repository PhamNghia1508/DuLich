export interface PrototypeTravelerReview {
  id: string;
  bookingId: string;
  guideId: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface PrototypeReviewDraft {
  rating: number;
  comment: string;
}

export type PrototypeReviewErrors = Partial<Record<'rating' | 'comment', string>>;

export function validatePrototypeReview(draft: PrototypeReviewDraft): PrototypeReviewErrors {
  const errors: PrototypeReviewErrors = {};
  if (!Number.isFinite(draft.rating) || draft.rating < 1 || draft.rating > 5) {
    errors.rating = 'Choose a rating between 1 and 5 stars.';
  }
  if (!draft.comment.trim()) {
    errors.comment = 'Write a short comment about your experience.';
  } else if (draft.comment.trim().length < 10) {
    errors.comment = 'Your review should be at least 10 characters.';
  }
  return errors;
}

export function hasReviewErrors(errors: PrototypeReviewErrors): boolean {
  return Object.keys(errors).length > 0;
}

let reviewCounter = 0;

export function createPrototypeReview(
  bookingId: string,
  guideId: string,
  draft: PrototypeReviewDraft,
): PrototypeTravelerReview {
  reviewCounter += 1;
  return {
    id: `review-${bookingId}-${reviewCounter}`,
    bookingId,
    guideId,
    rating: draft.rating,
    comment: draft.comment.trim(),
    submittedAt: new Date().toISOString(),
  };
}
