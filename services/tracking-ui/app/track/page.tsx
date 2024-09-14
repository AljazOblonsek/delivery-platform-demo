import { notFound } from 'next/navigation';
import { TrackPage } from '@/app/compositions/TrackPage';
import { getPackage } from '@/lib/ethers';
import { renderAsyncOrShowTrackError } from './renderAsyncOrShowTrackError';

type TrackPageProps = {
  searchParams: {
    trackNumber: string | undefined;
    secretKey: string | undefined;
  };
};

export default async function Track({ searchParams }: TrackPageProps) {
  return renderAsyncOrShowTrackError(async () => {
    const { trackNumber, secretKey } = searchParams;

    if (!trackNumber || !secretKey) {
      throw new Error('Insufficient data provided');
    }

    const packageData = await getPackage(trackNumber, secretKey);

    if (!packageData) {
      notFound();
    }

    return <TrackPage packageData={packageData} />;
  });
}
