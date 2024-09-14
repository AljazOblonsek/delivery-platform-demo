import TrackError from '@/app/track/trackError';

export const renderAsyncOrShowTrackError = (
  rendering: () => Promise<JSX.Element>
): Promise<JSX.Element> => {
  return rendering().catch((error) => {
    return <TrackError message={error.message} />;
  });
};
