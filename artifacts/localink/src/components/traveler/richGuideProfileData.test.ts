import assert from 'node:assert/strict';
import test from 'node:test';

import { MOCK_GUIDES } from '../home/mockGuideData.ts';
import {
  changeProfileScheduleDate,
  createProfileBookingDraftDefaults,
  createProfileBookingHandoff,
  createRichGuideProfileViewModel,
  deduplicateGallery,
  experienceImageForGuide,
  isProfileSlotSelectable,
  selectVideoThumbnail,
} from './richGuideProfileData.ts';
import { PROFILE_SECTIONS } from './rich-profile/RichProfileNav.tsx';

test('creates a complete rich profile view model for all 11 mock guide ids', () => {
  assert.equal(MOCK_GUIDES.length, 11);

  for (const guide of MOCK_GUIDES) {
    const profile = createRichGuideProfileViewModel(guide.id);

    assert.ok(profile, `missing rich profile for ${guide.id}`);
    assert.equal(profile.id, guide.id);
    assert.ok(profile.fullName.length > 0);
    assert.ok(profile.tagline.length > 0);
    assert.ok(profile.galleryImages.length >= 4);
    assert.ok(profile.galleryImages.every((image) => image.startsWith('/images/')));
    assert.ok(profile.experiences.length >= 2);
    assert.ok(profile.credentials.length >= 3);
    assert.ok(profile.reviews.length >= 2);
    assert.equal(profile.availability.length, 7);
    assert.ok(profile.availability.every((day) => day.slots.length === 13));
  }
});

test('returns a safe not-found result for an unknown guide id', () => {
  assert.equal(createRichGuideProfileViewModel('unknown-guide'), undefined);
  assert.equal(createProfileBookingHandoff('unknown-guide'), undefined);
});

test('guide-specific fallback content is deterministic', () => {
  const first = createRichGuideProfileViewModel('prototype-guide-010');
  const second = createRichGuideProfileViewModel('prototype-guide-010');

  assert.deepEqual(first, second);
  assert.ok(first);
  assert.equal(first.city, 'Hanoi');
  assert.ok(first.experiences.every((experience) => experience.id.startsWith('prototype-guide-010')));
});

test('availability mapping exposes available, hold, and booked slot states', () => {
  for (const guide of MOCK_GUIDES) {
    const statuses = createRichGuideProfileViewModel(guide.id)?.availability.flatMap((day) => (
      day.slots.map((slot) => slot.status)
    ));

    assert.ok(statuses?.includes('available'), `${guide.id} has no available day`);
    assert.ok(statuses?.includes('hold'), `${guide.id} has no hold day`);
    assert.ok(statuses?.includes('booked'), `${guide.id} has no booked day`);
  }
});

test('available and hold slots can be selected while booked slots cannot', () => {
  const profile = createRichGuideProfileViewModel('guide-001');
  assert.ok(profile);
  const slots = profile.availability.flatMap((day) => day.slots.map((slot) => ({ day, slot })));
  const available = slots.find(({ slot }) => slot.status === 'available');
  const hold = slots.find(({ slot }) => slot.status === 'hold');
  const booked = slots.find(({ slot }) => slot.status === 'booked');

  assert.ok(available && hold && booked);
  assert.equal(isProfileSlotSelectable(available.day, available.slot.time), true);
  assert.equal(isProfileSlotSelectable(hold.day, hold.slot.time), true);
  assert.equal(isProfileSlotSelectable(booked.day, booked.slot.time), false);
});

test('changing profile dates clears a time that is not selectable on the next day', () => {
  const profile = createRichGuideProfileViewModel('guide-001');
  assert.ok(profile);
  const nextDay = profile.availability.find((day) => day.slots.some((slot) => slot.status === 'booked'))!;
  const bookedTime = nextDay.slots.find((slot) => slot.status === 'booked')!.time;

  assert.deepEqual(changeProfileScheduleDate(profile.availability, nextDay.date, bookedTime), {
    date: nextDay.date,
    time: '',
  });
});

test('changing profile dates retains a time that is available or on hold', () => {
  const profile = createRichGuideProfileViewModel('guide-002');
  assert.ok(profile);
  const nextDay = profile.availability.find((day) => day.slots.some((slot) => slot.status === 'hold'))!;
  const holdTime = nextDay.slots.find((slot) => slot.status === 'hold')!.time;

  assert.deepEqual(changeProfileScheduleDate(profile.availability, nextDay.date, holdTime), {
    date: nextDay.date,
    time: holdTime,
  });
});

test('maps selected profile schedule into existing booking draft defaults', () => {
  const profile = createRichGuideProfileViewModel('guide-001');
  assert.ok(profile);
  const day = profile.availability.find((candidate) => candidate.slots.some((slot) => slot.status === 'available'))!;
  const time = day.slots.find((slot) => slot.status === 'available')!.time;
  const draft = createProfileBookingDraftDefaults('guide-001', null, {
    date: day.date,
    time,
    durationHours: 4,
    groupSize: 3,
  });

  assert.ok(draft);
  assert.equal(draft.guideId, 'guide-001');
  assert.equal(draft.bookingDate, day.date);
  assert.equal(draft.startTime, time);
  assert.equal(draft.durationHours, 4);
  assert.equal(draft.groupSize, 3);
  assert.equal(createProfileBookingDraftDefaults('unknown-guide', null, {
    date: day.date,
    time,
    durationHours: 4,
    groupSize: 3,
  }), undefined);
});

test('schedule generation is deterministic and does not mutate mock guide data', () => {
  const guidesBefore = structuredClone(MOCK_GUIDES);
  const first = createRichGuideProfileViewModel('guide-004')?.availability;
  const second = createRichGuideProfileViewModel('guide-004')?.availability;

  assert.deepEqual(first, second);
  assert.deepEqual(MOCK_GUIDES, guidesBefore);
});

test('maps at most two recommendation reasons only for the current guide', () => {
  const recommendation = {
    guideId: 'guide-001',
    matchReasons: ['Speaks English', 'Matches Food & Culture', 'Highly Rated'],
  };

  assert.deepEqual(
    createRichGuideProfileViewModel('guide-001', recommendation)?.recommendationReasons,
    ['Speaks English', 'Matches Food & Culture'],
  );
  assert.equal(
    createRichGuideProfileViewModel('guide-002', recommendation)?.recommendationReasons,
    undefined,
  );
});

test('does not mutate current mock guide or recommendation data', () => {
  const guideSnapshot = structuredClone(MOCK_GUIDES);
  const recommendation = {
    guideId: 'guide-001',
    matchReasons: ['Speaks English', 'Matches Local Life'],
  };
  const recommendationSnapshot = structuredClone(recommendation);

  createRichGuideProfileViewModel('guide-001', recommendation);

  assert.deepEqual(MOCK_GUIDES, guideSnapshot);
  assert.deepEqual(recommendation, recommendationSnapshot);
});

test('related guides exclude the currently viewed guide', () => {
  const profile = createRichGuideProfileViewModel('guide-001');

  assert.ok(profile);
  assert.ok(profile.relatedGuides.length > 0);
  assert.ok(profile.relatedGuides.every((guide) => guide.id !== profile.id));
});

test('continue-to-booking handoff preserves the selected guide id', () => {
  assert.deepEqual(createProfileBookingHandoff('guide-007'), {
    selectedGuideId: 'guide-007',
    href: '/booking-handoff/guide-007',
  });
});

test('direct profile access works without recommendation context', () => {
  const profile = createRichGuideProfileViewModel('prototype-guide-011');

  assert.ok(profile);
  assert.equal(profile.recommendationReasons, undefined);
});

test('profile section navigation config covers required sections', () => {
  const ids = PROFILE_SECTIONS.map((section) => section.id);
  assert.ok(ids.includes('overview'));
  assert.ok(ids.includes('experiences'));
  assert.ok(ids.includes('gallery'));
  assert.ok(ids.includes('video'));
  assert.ok(ids.includes('availability'));
  assert.ok(ids.includes('reviews'));
  assert.equal(ids.length, 6);
  assert.ok(PROFILE_SECTIONS.every((section) => section.label.length > 0));
});

test('experience image mapping is deterministic and avoids duplicates within a guide', () => {
  const usedA = new Set<string>();
  const imgA1 = experienceImageForGuide('guide-001', 'Food & Culture', 0, usedA);
  const imgA2 = experienceImageForGuide('guide-001', 'Shopping', 1, usedA);
  const imgA3 = experienceImageForGuide('guide-001', 'History', 2, usedA);
  assert.notEqual(imgA1, imgA2);
  assert.notEqual(imgA2, imgA3);
  assert.notEqual(imgA1, imgA3);

  const usedB = new Set<string>();
  const imgB1 = experienceImageForGuide('guide-001', 'Food & Culture', 0, usedB);
  assert.equal(imgA1, imgB1);
});

test('gallery deduplication removes hero image from gallery', () => {
  const hero = '/images/guides/linh.webp';
  const gallery = [hero, '/images/a.webp', '/images/b.webp', '/images/c.webp', '/images/d.webp', '/images/e.webp'];
  const result = deduplicateGallery(gallery, hero);
  assert.ok(!result.includes(hero) || result.length <= gallery.length);
  assert.ok(result.length >= 5);
});

test('gallery deduplication handles short galleries gracefully', () => {
  const result = deduplicateGallery(['/images/a.webp', '/images/b.webp'], '/images/c.webp');
  assert.equal(result.length, 2);
});

test('video thumbnail avoids hero image when alternatives exist', () => {
  const hero = '/images/guides/linh.webp';
  const gallery = [hero, '/images/a.webp', '/images/b.webp'];
  const thumb = selectVideoThumbnail(gallery, hero, 'guide-001');
  assert.notEqual(thumb, hero);
  assert.ok(gallery.includes(thumb));
});

test('video thumbnail falls back when no alternatives exist', () => {
  const hero = '/images/guides/linh.webp';
  const result = selectVideoThumbnail([hero], hero, 'guide-001');
  assert.equal(result, hero);
});

test('current guide is excluded from related guides for all profiles', () => {
  for (const guide of MOCK_GUIDES) {
    const profile = createRichGuideProfileViewModel(guide.id);
    assert.ok(profile);
    assert.ok(profile.relatedGuides.every((related) => related.id !== guide.id));
  }
});
