// source: https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
const { networkInterfaces } = require('os');
const fs = require('fs');

async function prepareEnv() {
	const nets = networkInterfaces();
	const results = {};

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === 'IPv4' && !net.internal) {
				if (!results[name]) {
					results[name] = [];
				}
				results[name].push(net.address);
			}
		}
	}

	const connectedIP = Object.entries(results)[0]?.[1][0] ?? '';
	if (!connectedIP) {
		console.log('Please check your connection');
		process.exit();
	} else {
		console.log(`using network with IP: ${connectedIP}`);
	}

	const iPAddressSettingRegex = /(IP_ADDRESS=.*)/;
	const backendApiSettingRegex = /(BACKEND_URL=.*)/;
	const exampleConfigContent = await fs.promises.readFile(
		'.env.example',
		'utf8'
	);

	if (fs.existsSync('.env')) {
		const backendApiSettingTemplateValue =
			backendApiSettingRegex.exec(exampleConfigContent)?.[0];

		if (backendApiSettingTemplateValue === undefined)
			throw new Error('Setting "BACKEND_URL" not found in .env.example');

		const actualIpAddressSettingRegex = `IP_ADDRESS=${connectedIP}`;
		const actualBackendApiSettingValue = `BACKEND_URL=http://${connectedIP}:4000`;

		let devConfigContent = await fs.promises.readFile('.env', 'utf8');

		devConfigContent = devConfigContent.replace(
			backendApiSettingRegex,
			actualBackendApiSettingValue,
			iPAddressSettingRegex,
			actualIpAddressSettingRegex
		);
		await fs.promises.writeFile('.env', devConfigContent);
	} else {
		const devConfigContent = exampleConfigContent.replace(
			/your_IP_address/g,
			connectedIP
		);
		fs.writeFile('.env', devConfigContent, (err) => {
			if (err) {
				console.error(err);
			}
		});
	}
}

prepareEnv();
