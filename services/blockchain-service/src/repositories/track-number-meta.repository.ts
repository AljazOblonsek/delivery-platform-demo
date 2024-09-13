import { eq } from 'drizzle-orm';
import {
  NewTrackNumberMetaEntity,
  TrackNumberMetaEntity,
  trackNumberMetaEntity,
} from '../entities/track-number-meta.entity';
import { DatabaseProvider } from '../providers/database.provider';

export const getTrackNumberMetaByTrackNumber = async (
  trackNumber: string
): Promise<TrackNumberMetaEntity | null> => {
  const database = await DatabaseProvider.getInstance().getDatabase();

  const trackNumberMetas = await database
    .select()
    .from(trackNumberMetaEntity)
    .where(eq(trackNumberMetaEntity.trackNumber, trackNumber));

  const trackNumberMeta = trackNumberMetas.at(0);

  if (!trackNumberMeta) {
    return null;
  }

  return trackNumberMeta;
};

export const createTrackNumberMeta = async (
  data: NewTrackNumberMetaEntity
): Promise<TrackNumberMetaEntity | null> => {
  const database = await DatabaseProvider.getInstance().getDatabase();

  const trackNumberMetas = await database.insert(trackNumberMetaEntity).values(data).returning();

  const trackNumberMeta = trackNumberMetas.at(0);

  if (!trackNumberMeta) {
    return null;
  }

  return trackNumberMeta;
};
