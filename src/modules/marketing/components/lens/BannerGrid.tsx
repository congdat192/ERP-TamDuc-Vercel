import { LensBanner } from '../../types/lens';

interface BannerGridProps {
  banners: LensBanner[];
}

export function BannerGrid({ banners }: BannerGridProps) {
  if (banners.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="relative rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => {
            if (banner.link_url) {
              window.open(banner.link_url, '_blank');
            }
          }}
        >
          <div className="aspect-[2/1] bg-muted">
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white font-bold text-xl mb-1">{banner.title}</h3>
            {banner.subtitle && (
              <p className="text-white/90 text-sm">{banner.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
