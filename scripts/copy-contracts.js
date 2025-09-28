const fs = require('fs');
const path = require('path');

// Script to copy contract ABIs and addresses from deployments to frontend
function copyContractsToFrontend(network = 'localhost') {
  const deploymentsDir = path.join(__dirname, '..', 'deployments', network);
  const frontendContractsDir = path.join(__dirname, '..', 'home', 'src', 'contracts');

  if (!fs.existsSync(deploymentsDir)) {
    console.error(`Deployments directory for ${network} not found: ${deploymentsDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Copy SmartWill contract
  const smartWillFile = path.join(deploymentsDir, 'SmartWill.json');
  const frontendSmartWillFile = path.join(frontendContractsDir, 'SmartWill.json');

  if (fs.existsSync(smartWillFile)) {
    const smartWillData = JSON.parse(fs.readFileSync(smartWillFile, 'utf8'));
    const frontendData = {
      address: smartWillData.address,
      abi: smartWillData.abi
    };

    fs.writeFileSync(frontendSmartWillFile, JSON.stringify(frontendData, null, 2));
    console.log(`✅ Copied SmartWill contract from ${network} to frontend`);
    console.log(`   Address: ${smartWillData.address}`);
  } else {
    console.error(`❌ SmartWill.json not found in ${deploymentsDir}`);
  }
}

// Get network from command line arguments
const network = process.argv[2] || 'localhost';
copyContractsToFrontend(network);