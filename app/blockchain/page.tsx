import BlockchainVerification from '@/components/BlockchainVerification';

export default function BlockchainPage() {
  return <BlockchainVerification />;
  const [verification, setVerification] = useState<any>(null);

  const handleRegister = async () => {
    if (!contractText.trim()) return;
    
    setRegistering(true);
}