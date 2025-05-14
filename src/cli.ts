import inquirer from "inquirer";
import { deployERC20 } from "../scripts/deployERC20";
import { suggestTokenDetails, analyzeContractStats } from "./openaiHelper";
import { fetchContractStats } from "./monitorHelper";

async function monitorContract(contractAddress: string) {
  console.log('\n📊 Analyzing contract...');
  const stats = await fetchContractStats(contractAddress);
  console.log('\n📈 Contract Summary:', stats);

  console.log('\n🔍 Getting AI analysis...');
  const analysis = await analyzeContractStats(stats);
  console.log('\n🤖 AI Analysis:\n', analysis);
}

async function createToken() {
  const { assist } = await inquirer.prompt({
    type: "confirm",
    name: "assist",
    message: "✨ Would you like AI to help suggest token details?",
  });

  let name, symbol, supply;

  if (assist) {
    const { desc } = await inquirer.prompt({
      type: "input",
      name: "desc",
      message: "📝 Describe your project:",
    });

    const suggestion = await suggestTokenDetails(desc);
    console.log('\n' + '═'.repeat(50));
    console.log('🤖 AI Suggestion:');
    console.log('═'.repeat(50));
    console.log(suggestion);
    console.log('═'.repeat(50) + '\n');
    
    const lines = suggestion?.split('\n') || [];
    for (const line of lines) {
      if (line.startsWith('Name:')) name = line.replace('Name:', '').trim();
      if (line.startsWith('Symbol:')) symbol = line.replace('Symbol:', '').trim();
      if (line.startsWith('Total Supply:')) supply = line.replace('Total Supply:', '').trim();
    }
  }

  console.log('📋 Please confirm or modify the token details:\n');
  const answers = await inquirer.prompt([
    { type: "input", name: "name", message: "Token Name:", default: name },
    { type: "input", name: "symbol", message: "Token Symbol:", default: symbol },
    { type: "input", name: "supply", message: "Total Supply:", default: supply },
  ]);

  console.log('\n⏳ Deploying your token...');
  const deployedAddress = await deployERC20(answers.name, answers.symbol, answers.supply);
  console.log('\n🎉 Deployment complete!\n');

  const { monitor } = await inquirer.prompt({
    type: "confirm",
    name: "monitor",
    message: "🔍 Do you want to analyze the deployed contract now?",
  });
  
  if (monitor && deployedAddress) {
    await monitorContract(deployedAddress);
  }
}

async function main() {
  console.log('\n🚀 Welcome to the DeProdAI (Decentralized Productivity AI Agent)!\n');

  while (true) {
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Create new token", value: "create_token" },
        { name: "Monitor existing token", value: "monitor" },
        { name: "Create new NFT", value: "create_nft" },
        { name: "Create new ERC1155", value: "create_erc1155" },
        { name: "Create new DAO", value: "create_dao" },
        { name: "Exit", value: "exit" }
      ]
    });

    if (action === "exit") {
      console.log('\n👋 Thank you for using DeProdAI! Goodbye!\n');
      process.exit(0);
    }

    if (action === "monitor") {
      const { address } = await inquirer.prompt({
        type: "input",
        name: "address",
        message: "Enter the contract address to monitor:",
        validate: (input) => /^0x[a-fA-F0-9]{40}$/.test(input) || "Please enter a valid Ethereum address"
      });
      await monitorContract(address);
    } else if (action === "create_token") {
      await createToken();
    } else {
      console.log('\n🚧 This feature is coming soon!\n');
    }

    console.log('\n' + '─'.repeat(50) + '\n');
  }
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
