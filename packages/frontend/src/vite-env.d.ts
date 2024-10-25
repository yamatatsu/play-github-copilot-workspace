/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URL: string;
	readonly VITE_USER_POOL_ID: string;
	readonly VITE_USER_POOL_CLIENT_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
