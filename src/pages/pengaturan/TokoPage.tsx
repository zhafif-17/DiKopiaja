import React, { useState } from 'react';
import {
  Store,
  Phone,
  MapPin,
  Percent,
  FileText,
  Printer,
  Globe,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_STORE } from '@/mocks/session';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export const TokoPage: React.FC = () => {
  const { toast } = useToast();

  const [storeName, setStoreName] = useState(MOCK_STORE.name);
  const [address, setAddress] = useState(MOCK_STORE.address);
  const [phone, setPhone] = useState(MOCK_STORE.phone);
  const [taxPercent, setTaxPercent] = useState<number>(MOCK_STORE.taxPercent);
  const [receiptFooter, setReceiptFooter] = useState(MOCK_STORE.receiptFooter);
  const [paperWidth, setPaperWidth] = useState<'58' | '80'>(MOCK_STORE.paperWidth);
  const [timezone, setTimezone] = useState('Asia/Jakarta');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Profil Toko Disimpan',
      description: 'Pengaturan identitas kedai kopi dan struk berhasil diperbarui.',
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-foreground">
          Profil & Pengaturan Toko
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Identitas bisnis yang tercetak pada header struk kasir dan aturan pajak transaksi.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Informasi Kedai Kopi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sName">Nama Toko / Kedai</Label>
                <Input
                  id="sName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sAddress">Alamat Lengkap Toko</Label>
                <Textarea
                  id="sAddress"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sPhone">Nomor Telepon Toko</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sPhone"
                    className="pl-9 font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sTax">Pajak Restoran / PB1 (%)</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sTax"
                    type="number"
                    min="0"
                    max="100"
                    className="pl-9 font-bold"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default 0% (tidak dikenakan pajak). Isi 10% atau 11% jika berlaku.
                </p>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sFooter">Pesan Footer Struk</Label>
                <Input
                  id="sFooter"
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Teks penutup yang dicetak di bagian paling bawah struk thermal.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Lebar Kertas Printer Utama</Label>
                <Select
                  value={paperWidth}
                  onValueChange={(val: '58' | '80') => setPaperWidth(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58">58 mm (Printer Kasir Mini)</SelectItem>
                    <SelectItem value="80">80 mm (Printer Standar POS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Zona Waktu Operasional</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Jakarta">WIB (Asia/Jakarta, UTC+7)</SelectItem>
                    <SelectItem value="Asia/Makassar">WITA (Asia/Makassar, UTC+8)</SelectItem>
                    <SelectItem value="Asia/Jayapura">WIT (Asia/Jayapura, UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border pt-4">
            <Button type="submit" className="gap-2 font-bold">
              <Save className="h-4 w-4" />
              Simpan Profil Toko
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

