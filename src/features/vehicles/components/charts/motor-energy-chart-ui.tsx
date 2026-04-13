import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MotorEnergyChartEmpty } from './MotorEnergyChartEmpty';

interface MotorEnergyChartCardProps {
  title: string;
  isEmpty: boolean;
  children?: ReactNode;
}

export function MotorEnergyChartCard({
  title,
  isEmpty,
  children,
}: MotorEnergyChartCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          isEmpty ? 'flex items-center justify-center py-12' : 'pb-4'
        )}
      >
        {isEmpty ? <MotorEnergyChartEmpty /> : children}
      </CardContent>
    </Card>
  );
}
