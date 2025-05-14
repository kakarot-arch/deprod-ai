import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ETHERSCAN_API = "https://api.etherscan.io/api";
const API_KEY = process.env.ETHERSCAN_API_KEY!;

export async function fetchContractStats(contractAddress: string) {
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Contract Analysis Report');
  console.log('═'.repeat(50));
  
  const url = `${ETHERSCAN_API}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`;

  const res = await axios.get(url);
  const txs = res.data.result;

  if (!txs || txs.length === 0) {
    console.log("\n⚠️  No transactions found for this contract.\n");
    return;
  }

  const summary = {
    totalTxs: txs.length,
    failedTxs: txs.filter((tx: any) => tx.isError === "1").length,
    gasUsed: txs.reduce((acc: number, tx: any) => acc + parseInt(tx.gasUsed), 0),
    firstTx: new Date(parseInt(txs[0].timeStamp) * 1000).toLocaleString(),
    lastTx: new Date(parseInt(txs[txs.length - 1].timeStamp) * 1000).toLocaleString(),
  };

  console.log('\n📈 Transaction Statistics');
  console.log('─'.repeat(30));
  console.log(`🔢 Total Transactions  : ${summary.totalTxs}`);
  console.log(`❌ Failed Transactions : ${summary.failedTxs}`);
  console.log(`⛽ Total Gas Used      : ${summary.gasUsed.toLocaleString()}`);
  console.log('\n📅 Timeline');
  console.log('─'.repeat(30));
  console.log(`🔰 First Transaction  : ${summary.firstTx}`);
  console.log(`🔄 Latest Transaction : ${summary.lastTx}`);
  console.log('═'.repeat(50) + '\n');

  return summary;
}
