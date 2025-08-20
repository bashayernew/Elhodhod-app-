"use client";
import type { AppProps } from 'next/app';
import ClientProviders from '../providers/ClientProviders';
import ClientOnly from '../components/ClientOnly';
import { BrowserRouter } from 'react-router-dom';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ClientOnly>
			<BrowserRouter>
				<ClientProviders>
					<Component {...pageProps} />
				</ClientProviders>
			</BrowserRouter>
		</ClientOnly>
	);
}

