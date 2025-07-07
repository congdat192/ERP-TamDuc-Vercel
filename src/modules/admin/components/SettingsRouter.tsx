
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsLayout } from '../pages/settings/SettingsLayout';
import { GeneralSettings } from '../pages/settings/GeneralSettings';
import { APISettings } from '../pages/settings/APISettings';
import { IntegrationsSettings } from '../pages/settings/IntegrationsSettings';
import { SecuritySettings } from '../pages/settings/SecuritySettings';
import { NotificationsSettings } from '../pages/settings/NotificationsSettings';
import { AppearanceSettings } from '../pages/settings/AppearanceSettings';

export function SettingsRouter() {
  return (
    <SettingsLayout>
      <Routes>
        <Route path="/" element={<Navigate to="General" replace />} />
        <Route path="/General" element={<GeneralSettings />} />
        <Route path="/API" element={<APISettings />} />
        <Route path="/Integrations" element={<IntegrationsSettings />} />
        <Route path="/Security" element={<SecuritySettings />} />
        <Route path="/Notifications" element={<NotificationsSettings />} />
        <Route path="/Appearance" element={<AppearanceSettings />} />
        <Route path="*" element={<Navigate to="General" replace />} />
      </Routes>
    </SettingsLayout>
  );
}
