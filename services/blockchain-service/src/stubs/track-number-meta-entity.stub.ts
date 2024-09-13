import { faker } from '@faker-js/faker';
import { TrackNumberMetaEntity } from '../entities/track-number-meta.entity';

export const generateTrackNumberMetaEntityStub = (
  data: Partial<TrackNumberMetaEntity> = {}
): TrackNumberMetaEntity => {
  const defaultOptions: TrackNumberMetaEntity = {
    id: faker.number.int(),
    trackNumber: faker.string.alphanumeric(10),
    encryptedPrivateKey: faker.string.uuid(),
    companyId: faker.number.int(),
  };

  return { ...defaultOptions, ...data };
};
