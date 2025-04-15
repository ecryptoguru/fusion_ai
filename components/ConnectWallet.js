import { W3mButton } from '@reown/appkit';
import { useAccount } from 'wagmi';
import { AlertTriangle } from 'lucide-react';

export default function ConnectWallet({ isBase, isStaked }) {
  const { address } = useAccount();
  return (
    <div className="flex items-center space-x-4">
      <W3mButton />
      {address && (
        <span className="text-xs text-gray-500">Connected: {address.slice(0, 6)}...{address.slice(-4)}</span>
      )}
      {!isBase && (
        <span className="flex items-center text-yellow-600"><AlertTriangle className="w-4 h-4 mr-1" /> Switch to Base for FAI staking discount</span>
      )}
      {isBase && !isStaked && (
        <span className="flex items-center text-blue-600"><AlertTriangle className="w-4 h-4 mr-1" /> Stake 10 FAI on Base for 10% discount</span>
      )}
      {isBase && isStaked && (
        <span className="flex items-center text-green-600">10 FAI staked – Discount active!</span>
      )}
    </div>
  );
}
