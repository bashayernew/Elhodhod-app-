'use client';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import dynamic from 'next/dynamic';
const AuthProvider = dynamic(() => import('../contexts/AuthContext').then(m => m.AuthProvider), { ssr: false });

export default function ClientProviders({ children }: { children: React.ReactNode }) {
	return (
		<I18nextProvider i18n={i18n}>
			<AuthProvider>{children}</AuthProvider>
		</I18nextProvider>
	);
}

