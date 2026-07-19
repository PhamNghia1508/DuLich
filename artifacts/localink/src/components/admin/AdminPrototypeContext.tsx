import { createContext, useContext, useMemo, useState } from 'react';

import {
  ADMIN_GUIDE_APPLICATIONS,
  ADMIN_PARTNERS,
  ADMIN_REPORTS,
  resetAdminSettings,
  updateAdminGuideApplication,
  updateAdminPartnerStatus,
  updateAdminReportStatus,
  type AdminGuideApplication,
  type AdminPartner,
  type AdminReport,
  type AdminSettings,
  type GuideApplicationStatus,
} from './adminPrototypeData';

interface AdminPrototypeValue {
  guideApplications: AdminGuideApplication[];
  partners: AdminPartner[];
  reports: AdminReport[];
  settings: AdminSettings;
  adminNotesByEntity: Record<string, string[]>;
  updateGuideApplication: (id: string, status: GuideApplicationStatus, note?: string) => string | undefined;
  updatePartner: (id: string, update: Partial<Pick<AdminPartner, 'verificationStatus' | 'accountStatus'>>) => void;
  updateReport: (id: string, status: AdminReport['status'], note?: string) => void;
  addAdminNote: (entityId: string, note: string) => void;
  updateSettings: (update: Partial<AdminSettings>) => void;
  resetSettings: () => void;
}

const AdminPrototypeContext = createContext<AdminPrototypeValue | null>(null);

export function AdminPrototypeProvider({ children }: { children: React.ReactNode }) {
  const [guideApplications, setGuideApplications] = useState(() => ADMIN_GUIDE_APPLICATIONS.map((application) => ({ ...application, adminNotes: [...application.adminNotes] })));
  const [partners, setPartners] = useState(() => ADMIN_PARTNERS.map((partner) => ({ ...partner })));
  const [reports, setReports] = useState(() => ADMIN_REPORTS.map((report) => ({ ...report, adminNotes: [...report.adminNotes] })));
  const [settings, setSettings] = useState<AdminSettings>(resetAdminSettings);
  const [adminNotesByEntity, setAdminNotesByEntity] = useState<Record<string, string[]>>({});

  const value = useMemo<AdminPrototypeValue>(() => ({
    guideApplications,
    partners,
    reports,
    settings,
    adminNotesByEntity,
    updateGuideApplication: (id, status, note = '') => {
      const result = updateAdminGuideApplication(guideApplications, id, status, note);
      if (!result.error) setGuideApplications(result.applications);
      return result.error;
    },
    updatePartner: (id, update) => setPartners((current) => updateAdminPartnerStatus(current, id, update)),
    updateReport: (id, status, note = '') => setReports((current) => updateAdminReportStatus(current, id, status, note)),
    addAdminNote: (entityId, note) => {
      if (!note.trim()) return;
      setAdminNotesByEntity((current) => ({ ...current, [entityId]: [...(current[entityId] ?? []), note.trim()] }));
    },
    updateSettings: (update) => setSettings((current) => ({ ...current, ...update })),
    resetSettings: () => setSettings(resetAdminSettings()),
  }), [adminNotesByEntity, guideApplications, partners, reports, settings]);

  return <AdminPrototypeContext.Provider value={value}>{children}</AdminPrototypeContext.Provider>;
}

export function useAdminPrototype() {
  const context = useContext(AdminPrototypeContext);
  if (!context) throw new Error('useAdminPrototype must be used within AdminPrototypeProvider');
  return context;
}
