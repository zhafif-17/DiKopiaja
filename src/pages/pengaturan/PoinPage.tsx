import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  TrendingUp,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { formatRupiah } from '@/lib/utils';

export const PoinPage: React.FC = () => {
  const { toast } = useToast();

  const [pointEarnPerRupiah, setPointEarnPerRupiah] = useState(10000);
  const [pointRedeemValue, setPointRedeemValue] = useState(100);
  const [maxRedeemPercent, setMaxRedeemPercent] = useState(50);
  const [silverThreshold, setSilverThreshold] = useState(1000000);
  const [goldThreshold, setGoldThreshold] = useState(5000000);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Aturan Poin Disimpan',
      description: 'Pengaturan aturan loyalti pelanggan berhasil diperbarui.',
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-foreground">
          Aturan Poin & Loyalitas Member
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tentukan rasio perolehan poin per rupiah, nilai konversi potongan, dan batas naik tier member.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Aturan Perolehan & Penukaran */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-base">Konversi & Nilai Tukar Poin</CardTitle>
            </div>
            <CardDescription>
              Aturan perolehan poin saat transaksi lunas dan nilai rupiah saat ditukar di kasir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="earnRatio">Nilai Belanja untuk 1 Poin (Rp)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="earnRatio"
                    type="number"
                    className="pl-9 font-semibold tabular-nums"
                    value={pointEarnPerRupiah}
                    onChange={(e) => setPointEarnPerRupiah(Number(e.target.value))}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default: Setiap belanja Rp 10.000 member mendapat 1 poin.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="redeemRatio">Nilai Rupiah 1 Poin saat Ditukar (Rp)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="redeemRatio"
                    type="number"
                    className="pl-9 font-semibold tabular-nums"
                    value={pointRedeemValue}
                    onChange={(e) => setPointRedeemValue(Number(e.target.value))}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default: 1 poin bernilai potongan Rp 100 saat pembayaran.
                </p>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="maxPercent">Batas Maksimal Penukaran (% dari Subtotal)</Label>
                <div className="relative">
                  <Input
                    id="maxPercent"
                    type="number"
                    max="100"
                    min="1"
                    className="pr-9 font-semibold tabular-nums"
                    value={maxRedeemPercent}
                    onChange={(e) => setMaxRedeemPercent(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Mencegah penukaran poin berlebihan. Contoh: 50% berarti maksimal setengah dari total belanja bisa dibayar dengan poin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Syarat Naik Tier */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Ambang Batas Belanja Kumulatif Tier Member</CardTitle>
            </div>
            <CardDescription>
              Tier member akan naik secara otomatis jika akumulasi total belanja mencapai nilai berikut.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="silverLimit">Total Belanja Masuk Tier Silver (Rp)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="silverLimit"
                    type="number"
                    className="pl-9 font-semibold tabular-nums"
                    value={silverThreshold}
                    onChange={(e) => setSilverThreshold(Number(e.target.value))}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default: Rp 1.000.000 akumulasi belanja.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="goldLimit">Total Belanja Masuk Tier Gold (Rp)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="goldLimit"
                    type="number"
                    className="pl-9 font-semibold tabular-nums"
                    value={goldThreshold}
                    onChange={(e) => setGoldThreshold(Number(e.target.value))}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default: Rp 5.000.000 akumulasi belanja.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border pt-4">
            <Button type="submit" className="gap-2 font-bold">
              <Save className="h-4 w-4" />
              Simpan Pengaturan Poin
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

