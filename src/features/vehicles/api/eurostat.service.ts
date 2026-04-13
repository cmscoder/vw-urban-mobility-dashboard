import { httpClient } from './http-client';
import { EUROSTAT_SINCE_YEAR } from '@/features/vehicles/constants';
import type {
  EurostatResponse,
  EurostatQueryParams,
  VehicleRecord,
} from '@/features/vehicles/types';

const DATASET = '/data/road_eqs_carpda';

const MOT_NRG_FILTER = [
  'mot_nrg=ELC',
  'mot_nrg=ELC_PET_HYB',
  'mot_nrg=ELC_DIE_HYB',
  'mot_nrg=ELC_PET_PI',
  'mot_nrg=ELC_DIE_PI',
  'mot_nrg=HYD_FCELL',
].join('&');

const DEFAULT_PARAMS: EurostatQueryParams = {
  format: 'JSON',
  lang: 'EN',
  unit: 'NR',
  geoLevel: 'country',
  sinceTimePeriod: String(EUROSTAT_SINCE_YEAR),
};

export async function fetchVehicleData(
  params?: EurostatQueryParams
): Promise<VehicleRecord[]> {
  const { data } = await httpClient.get<EurostatResponse>(
    `${DATASET}?${MOT_NRG_FILTER}`,
    { params: { ...DEFAULT_PARAMS, ...params } }
  );

  return transformResponse(data);
}

/**
 * JSON-stat `category.index` maps each category code to its axis position (0…n-1).
 * When we decode a flat value key with strides we only get those integer positions;
 * this builds the inverse map so we can resolve position → code for geo, time, and mot_nrg.
 */
function reverseIndex(index: Record<string, number>): Record<number, string> {
  return Object.fromEntries(
    Object.entries(index).map(([code, pos]) => [pos, code])
  );
}

/**
 * Transforms a JSON-stat 2.0 response into flat VehicleRecord[].
 *
 * Instead of iterating every possible dimension combination (3 nested loops),
 * we iterate directly over the value entries — only data that actually exists.
 * Each flat index is decoded back to its dimensional positions using strides.
 */
export function transformResponse(data: EurostatResponse): VehicleRecord[] {
  const { dimension, id: dimIds, size: dimSizes, value } = data;

  const geoDim = dimension['geo'];
  const timeDim = dimension['time'];
  const motNrgDim = dimension['mot_nrg'];

  if (!geoDim || !timeDim || !motNrgDim) return [];

  const geoByPos = reverseIndex(geoDim.category.index);
  const timeByPos = reverseIndex(timeDim.category.index);
  const motNrgByPos = reverseIndex(motNrgDim.category.index);

  const geoIdx = dimIds.indexOf('geo');
  const timeIdx = dimIds.indexOf('time');
  const motNrgIdx = dimIds.indexOf('mot_nrg');

  const strides = dimIds.map((_dimId, dimensionIndex) =>
    dimSizes.slice(dimensionIndex + 1).reduce((a, b) => a * b, 1)
  );

  return Object.entries(value).map(([flatKey, count]) => {
    let remaining = Number(flatKey);
    const positions = strides.map((stride) => {
      const pos = Math.floor(remaining / stride);
      remaining = remaining % stride;
      return pos;
    });

    const geo = geoByPos[positions[geoIdx]];
    const time = timeByPos[positions[timeIdx]];
    const motNrg = motNrgByPos[positions[motNrgIdx]];

    return {
      id: `${geo}-${motNrg}-${time}`,
      country: geo,
      countryName: geoDim.category.label?.[geo] ?? geo,
      year: time,
      motorEnergy: motNrg,
      motorEnergyName: motNrgDim.category.label?.[motNrg] ?? motNrg,
      count,
      source: 'eurostat' as const,
    };
  });
}
