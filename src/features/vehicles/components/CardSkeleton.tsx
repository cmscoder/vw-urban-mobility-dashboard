import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CardSkeletonProps {
  count?: number;
  detailsColumnsCount?: number;
}

export function CardSkeleton({
  count = 6,
  detailsColumnsCount = 3,
}: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: detailsColumnsCount }).map((_, j) => (
                <Skeleton key={j} className="h-8 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
