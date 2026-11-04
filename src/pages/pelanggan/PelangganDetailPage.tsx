import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Award,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '@/mocks/customers';
import { MOCK_SALES } from '@/mocks/sales';
import { MOCK_POINT_LEDGER } from '@/mocks/point-ledger';
import { formatRupiah, formatDateTime, getTierLabel } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const PelangganDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const customer =
    MOCK_CUSTOMERS.find((c) => c.id === id) || MOCK_CUSTOMERS[0];

  const customerSales = MOCK_SALES.filter(
    (s) => s.customerId === customer.id || s.customerName === customer.name
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => navigate('/pelanggan')}
          aria-label="Kembali"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading font-extrabold text-2xl text-foreground">
              {customer.name}
            </h1>
            <Badge
              variant={
                customer.tier === 'gold'
                  ? 'warning'
                  : customer.tier === 'silver'
                  ? 'secondary'
                  : 'default'
              }
              className="capitalize font-bold text-xs"
            >
              Tier {getTierLabel(customer.tier)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Member terdaftar sejak {formatDateTime(customer.createdAt)}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Total Belanja</span>
              <span className="font-heading font-extrabold text-xl text-foreground tabular-nums">
                {formatRupiah(customer.totalSpent)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Saldo Poin Saat Ini</span>
              <span className="font-heading font-extrabold text-xl text-amber-700 tabular-nums">
                {customer.points} Poin
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Kontak WhatsApp</span>
              <span className="font-mono font-bold text-sm text-foreground">
                {customer.phone}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Transaksi Belanja */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Riwayat Transaksi Belanja</CardTitle>
          </div>
          <CardDescription>
            Seluruh pesanan yang dibeli oleh member ini di kedai.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Tanggal Transaksi</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead className="text-right">Total Belanja</TableHead>
                <TableHead className="text-right">Poin Didapat</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Belum ada riwayat transaksi untuk member ini.
                  </TableCell>
                </TableRow>
              ) : (
                customerSales.map((sale) => (
                  <TableRow
                    key={sale.id}
                    className="cursor-pointer hover:bg-secondary/30"
                    onClick={() => navigate(`/transaksi/${sale.invoiceNo}`)}
                  >
                    <TableCell className="font-mono font-bold text-xs text-primary">
                      {sale.invoiceNo}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(sale.createdAt)}
                    </TableCell>
                    <TableCell className="text-xs uppercase font-medium">
                      {sale.paymentMethod}
                    </TableCell>
                    <TableCell className="text-right font-bold text-xs tabular-nums text-foreground">
                      {formatRupiah(sale.total)}
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold tabular-nums text-emerald-600">
                      +{sale.pointEarned}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Lunas</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mutasi Poin Ledger Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base">Riwayat Mutasi Poin Loyalitas</CardTitle>
          </div>
          <CardDescription>
            Pencatatan perolehan dan penukaran poin member.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Jenis Mutasi</TableHead>
                <TableHead className="text-right">Perubahan Poin</TableHead>
                <TableHead className="text-right">Saldo Akhir</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_POINT_LEDGER.map((pt) => (
                <TableRow key={pt.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(pt.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pt.type === 'dapat'
                          ? 'success'
                          : pt.type === 'tukar'
                          ? 'warning'
                          : 'secondary'
                      }
                      className="capitalize text-[10px]"
                    >
                      {pt.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right text-xs font-bold tabular-nums ${
                      pt.points > 0 ? 'text-accent' : 'text-destructive'
                    }`}
                  >
                    {pt.points > 0 ? `+${pt.points}` : pt.points}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold tabular-nums text-foreground">
                    {pt.balanceAfter} Poin
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {pt.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

