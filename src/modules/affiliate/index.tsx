
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AffiliateDashboard } from './pages/AffiliateDashboard';

export function AffiliateModule() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AffiliateDashboard />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
