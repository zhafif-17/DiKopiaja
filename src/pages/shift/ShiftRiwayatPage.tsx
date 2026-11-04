import React, { useState } from 'react';
import {
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
} from 'lucide-react';
import { MOCK_SHIFTS, type Shift } from '@/mocks/shifts';
import { formatRupiah, formatDateTime, formatTime } from '@/lib/utils';
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

export const ShiftRiwayatPage: React.FC = () => {
  const [shifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShifts = shifts.filter(
    (s) =>
      s.cashierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.closingNote && s.closingNote.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Riwayat Shift Kasir
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit pembukaan dan penutupan shift, selisih uang kas, dan catatan kasir.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kasir atau catatan..."
              className="pl-9 h-10 text-xs bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kasir</TableHead>
                <TableHead>Waktu Jaga</TableHead>
                <TableHead className="text-right">Kas Awal</TableHead>
                <TableHead className="text-right">Penjualan</TableHead>
                <TableHead className="text-right">Kas Hitung</TableHead>
                <TableHead className="text-right">Selisih Kas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan Penutupan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium text-xs text-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {shift.cashierName.charAt(0)}
                      </div>
                      <span>{shift.cashierName}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    <div>{formatDateTime(shift.openedAt)}</div>
                    {shift.closedAt && (
                      <div className="text-[10px] text-muted-foreground/70">
                        s/d {formatTime(shift.closedAt)}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right text-xs tabular-nums text-foreground">
                    {formatRupiah(shift.openingCash)}
                  </TableCell>

                  <TableCell className="text-right text-xs font-semibold tabular-nums text-accent">
                    {formatRupiah(shift.totalSales)}
                  </TableCell>

                  <TableCell className="text-right text-xs tabular-nums text-foreground">
                    {shift.countedCash !== undefined
                      ? formatRupiah(shift.countedCash)
                      : '-'}
                  </TableCell>

                  <TableCell className="text-right text-xs font-bold tabular-nums">
                    {shift.difference === undefined ? (
                      <span className="text-muted-foreground">-</span>
                    ) : shift.difference === 0 ? (
                      <span className="text-emerald-600">Rp 0 (Cocok)</span>
                    ) : shift.difference > 0 ? (
                      <span className="text-emerald-600">+{formatRupiah(shift.difference)}</span>
                    ) : (
                      <span className="text-rose-600">{formatRupiah(shift.difference)}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant={shift.status === 'buka' ? 'success' : 'secondary'}>
                      {shift.status === 'buka' ? 'Aktif' : 'Selesai'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {shift.closingNote || '-'}
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

