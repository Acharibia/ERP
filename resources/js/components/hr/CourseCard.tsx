import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import React from 'react';

export type CourseCardProps = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string | null;
  href?: string;
  programTitle?: string;
};

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  href,
  programTitle,
}) => {
  const link = href || `/modules/hr/courses/${id}`;
  return (
    <Card className="flex flex-col h-full group overflow-hidden py-0">
      <CardHeader className="p-0">
        <Link href={link} className="block focus:outline-none">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-40 w-full object-cover rounded-t-lg transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center bg-muted rounded-t-lg">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 p-4">
        <Link href={link} className="focus:outline-none hover:underline">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {title}
          </CardTitle>
        </Link>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
          {description || 'No description provided.'}
        </CardDescription>
        {programTitle && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 min-h-[1.5rem]">
            <span className="truncate">{programTitle}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
