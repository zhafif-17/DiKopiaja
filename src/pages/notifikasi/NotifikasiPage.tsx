import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  TrendingUp,
  Clock,
  CreditCard,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS, type Notification, type NotifType } from '@/mocks/notifications';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export const NotifikasiPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    return typeFilter === 'all' || n.type === typeFilter;
  });

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    toast({
      title: 'Semua Notifikasi Ditandai',
      description: 'Seluruh notifikasi telah ditandai sebagai sudah dibaca.',
      variant: 'success',
    });
  };

  const handleItemClick = (notif: Notification) => {
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotifIcon = (type: NotifType) => {
    switch (type) {
      case 'stok_menipis':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'laporan_harian':
        return <TrendingUp className="h-5 w-5 text-emerald-600" />;
      case 'shift':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'pembayaran':
        return <CreditCard className="h-5 w-5 text-rose-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Pusat Notifikasi
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Peringatan stok menipis, ringkasan laporan harian, dan notifikasi shift.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-2 text-xs"
          >
            <CheckCheck className="h-4 w-4" />
            Tandai Sudah Dibaca Semua
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-56 h-9 text-xs">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="stok_menipis">Peringatan Stok</SelectItem>
            <SelectItem value="laporan_harian">Laporan Harian</SelectItem>
            <SelectItem value="shift">Aktivitas Shift</SelectItem>
            <SelectItem value="pembayaran">Pembayaran Gateway</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground">
          {notifications.filter((n) => !n.isRead).length} notifikasi belum dibaca
        </span>
      </div>

      <div className="space-y-2">
        {filteredNotifs.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm font-semibold text-foreground">Tidak Ada Notifikasi</p>
            <p className="text-xs">Semua peringatan dan aktivitas telah dibaca.</p>
          </Card>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-4 ${
                notif.isRead
                  ? 'bg-card border-border hover:bg-secondary/30'
                  : 'bg-primary/5 border-primary/30 hover:bg-primary/10'
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-xs">
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-sm text-foreground">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                    {formatDateTime(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {notif.body}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 self-center" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

