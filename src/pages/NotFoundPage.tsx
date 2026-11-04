import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/store/sessionStore';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useSessionStore();

  const handleBack = () => {
    if (currentUser?.role === 'owner') {
      navigate('/dashboard');
    } else {
      navigate('/kasir');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="h-20 w-20 rounded-3xl bg-secondary/80 flex items-center justify-center text-primary mb-6 shadow-sm">
        <Coffee className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold font-heading text-foreground mb-2">404</h1>
      <h2 className="text-xl font-bold font-heading text-foreground mb-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL salah dimasukkan.
      </p>
      <div className="flex gap-3">
        <Button onClick={handleBack} className="gap-2">
          <Home className="h-4 w-4" />
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

