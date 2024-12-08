// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import fs from "fs";
// // https://vitejs.dev/config/

// export default defineConfig(({ command, mode }) => {
// 	// Load env file based on `mode` in the current working directory
// 	const env = loadEnv(mode, process.cwd());
// 	// Validate required environment variables
// 	if (!env.VITE_APP_SSL_KEY || !env.VITE_APP_SSL_CERT) {
// 		throw new Error(
// 			"Environment variables VITE_APP_SSL_KEY and VITE_APP_SSL_CERT must be defined."
// 		);
// 	}
// 	return {
// 		// build specific config

// 		plugins: [react()],
// 		esbuild: {
// 			jsxFactory: "h",
// 			jsxFragment: "Fragment",
// 		},

// 		server: {
// 			https: {
// 				key: fs.readFileSync(import.meta.env.VITE_APP_SSL_KEY),
// 				cert: fs.readFileSync(import.meta.env.VITE_APP_SSL_CERT),
// 			},
// 		},
// 	};
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	const keyPath = path.resolve(env.VITE_APP_SSL_KEY.replace(/\\/g, "/"));
	const certPath = path.resolve(env.VITE_APP_SSL_CERT.replace(/\\/g, "/"));

	// Validate file existence
	if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
		throw new Error(
			`SSL Key or Certificate file not found:\nKey: ${keyPath}\nCert: ${certPath}`
		);
	}

	return {
		plugins: [react()],
		server: {
			https: {
				key: fs.readFileSync(keyPath),
				cert: fs.readFileSync(certPath),
			},
		},
	};
});
