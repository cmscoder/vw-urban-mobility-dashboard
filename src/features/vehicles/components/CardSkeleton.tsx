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
      {[...Array(count).keys()].map((cardIndex) => (
        <Card key={cardIndex}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${detailsColumnsCount}, minmax(0, 1fr))`,
              }}
            >
              {[...Array(detailsColumnsCount).keys()].map((columnIndex) => (
                <Skeleton key={columnIndex} className="h-8 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
