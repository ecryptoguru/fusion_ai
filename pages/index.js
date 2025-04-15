import Head from 'next/head';
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Fusion AI Marketplace</title>
      </Head>
      <main className="max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Fusion AI Marketplace</h1>
        <p className="mb-4">Multi-chain platform for AI models with native token payments and FAI staking discounts.</p>
        <ul className="list-disc pl-6">
          <li>Upload, buy, and subscribe to AI models</li>
          <li>Pay in ETH, AVAX, BNB, MATIC, and more</li>
          <li>10% discount for staking 10 FAI on Base</li>
          <li>Modern UI with search, filters, and reporting</li>
        </ul>
      </main>
    </div>
  );
}
