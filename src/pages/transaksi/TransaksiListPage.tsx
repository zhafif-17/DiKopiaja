import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Receipt,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MOCK_SALES, type Sale, type PaymentMethod, type SaleStatus } from '@/mocks/sales';
import { formatRupiah, formatDateTime, getSaleStatusLabel, getSaleStatusVariant } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const TransaksiListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cashierFilter, setCashierFilter] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredSales = MOCK_SALES.filter((sale) => {
    const matchSearch =
      sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchMethod = methodFilter === 'all' || sale.paymentMethod === methodFilter;
    const matchStatus = statusFilter === 'all' || sale.status === statusFilter;
    const matchCashier = cashierFilter === 'all' || sale.cashierName === cashierFilter;

    return matchSearch && matchMethod && matchStatus && matchCashier;
  });

  const totalPages = Math.ceil(filteredSales.length / pageSize) || 1;
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Daftar Seluruh Transaksi
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Riwayat lengkap penjualan, status pembayaran Midtrans, dan detail item.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari Invoice / Pelanggan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-10 text-xs"
              />
            </div>

            {/* Metode Bayar Filter */}
            <Select
              value={methodFilter}
              onValueChange={(val) => {
                setMethodFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Semua Metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Metode</SelectItem>
                <SelectItem value="tunai">Tunai</SelectItem>
                <SelectItem value="qris">QRIS</SelectItem>
                <SelectItem value="kartu">Kartu Debit</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="gagal">Gagal</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>

            {/* Kasir Filter */}
            <Select
              value={cashierFilter}
              onValueChange={(val) => {
                setCashierFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Semua Kasir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kasir</SelectItem>
                <SelectItem value="Dewi Lestari">Dewi Lestari</SelectItem>
                <SelectItem value="Bayu Saputra">Bayu Saputra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Data Transaksi */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Waktu Transaksi</TableHead>
                <TableHead>Kasir</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead className="text-right">Total Tagihan</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    Tidak ada transaksi yang cocok dengan filter.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSales.map((sale) => (
                  <TableRow
                    key={sale.id}
                    className="cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => navigate(`/transaksi/${sale.invoiceNo}`)}
                  >
                    <TableCell className="font-mono font-bold text-xs text-primary">
                      {sale.invoiceNo}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(sale.createdAt)}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {sale.cashierName}
                    </TableCell>
                    <TableCell className="text-xs">
                      {sale.customerName ? (
                        <span className="font-medium text-foreground">
                          {sale.customerName}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Umum</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs uppercase font-medium">
                      {sale.paymentMethod}
                    </TableCell>
                    <TableCell className="text-right font-bold text-xs tabular-nums text-foreground">
                      {formatRupiah(sale.total)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getSaleStatusVariant(sale.status)}>
                        {getSaleStatusLabel(sale.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => navigate(`/transaksi/${sale.invoiceNo}`)}
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Menampilkan {(currentPage - 1) * pageSize + 1} sampai{' '}
              {Math.min(currentPage * pageSize, filteredSales.length)} dari{' '}
              {filteredSales.length} transaksi
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Sebelumnya
              </Button>
              <span className="font-medium text-foreground">
                Hal {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 gap-1"
              >
                Selanjutnya
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

