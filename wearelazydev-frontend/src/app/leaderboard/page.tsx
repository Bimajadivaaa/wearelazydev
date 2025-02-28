import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const leaderboardData = [
  { wallet: "0xebFACa8463E1c3495a09684137fEd7A4b4574179", pr: 10 },
  { wallet: "0xeEB252E542339E1BcaCed83d6f338527E2424513", pr: 5 },
  { wallet: "0xFFA3EceD063276266924700C726f4BD94A18c0E8", pr: 4 },
  { wallet: "0x568eccd69EE795b83395Aa3825879439B21bd955", pr: 3 },
  { wallet: "0xBEB6B2dCa3A80CcaF1Eb7ab2d26Ccc226f9573f0", pr: 1 },
  { wallet: "0x8ec747Ac26Ca47E95815b334d253637Eb172491E", pr: 1 },
  { wallet: "0x83d7c6d3dF6e72555aa35d6aDE4f897CDEb43212", pr: 1 },
  { wallet: "0xD3D7d5e0a71eA4B73a94fBBc098c71b55417Acd7", pr: 1 },
  { wallet: "0xeC79671059c31901DB1E2411E57AdedaBC1F7806", pr: 1 },
  { wallet: "0x92D3ac5d5d2C065A3b8f9B4c5B1a313453aFF2ac", pr: 1 },
];

const getBadge = (pr:number) => {
  if (pr >= 10) return "🥇 Gold";
  if (pr >= 5) return "🥈 Silver";
  if (pr >= 3) return "🥉 Bronze";
  return "🎖 Contributor";
};

export default function Leaderboard() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">🏆 Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center font-bold text-white bg-gray-800 p-2 rounded-t-lg">
            <span>Wallet Address</span>
            <span>Total PRs</span>
            <span>Badge</span>
          </div>
          <div className="space-y-3">
            {leaderboardData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 items-center p-3 bg-gray-900 text-white rounded-lg shadow-md text-center"
              >
                <span className="font-mono truncate">{item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}</span>
                <span className="font-semibold">{item.pr} PRs</span>
                <Badge variant="secondary" className="flex items-center justify-center">{getBadge(item.pr)}</Badge>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 text-white">
            <p>This is the Leaderboard from WeAreLazyDev.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}