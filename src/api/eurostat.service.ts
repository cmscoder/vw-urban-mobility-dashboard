import { httpClient } from './http-client';
import type {
  EurostatResponse,
  EurostatQueryParams,
  VehicleRecord,
} from '../types';

const DATASET = '/data/road_eqs_carmot';

const DEFAULT_PARAMS: EurostatQueryParams = {
  format: 'JSON',
  lang: 'EN',
  unit: 'NR',
  engine: 'TOTAL',
};

export async function fetchVehicleData(
  params?: EurostatQueryParams
): Promise<VehicleRecord[]> {
  const { data } = await httpClient.get<EurostatResponse>(DATASET, {
    params: { ...DEFAULT_PARAMS, ...params },
  });

  return transformResponse(data);
}

/**
 * Computes a flat index from multi-dimensional positions.
 * JSON-stat stores values in a sparse flat object keyed by this index.
 *
 * For dimensions with sizes [2, 3, 4] and indices [1, 2, 0]:
 * flatIndex = 1*(3*4) + 2*(4) + 0 = 20
 */
function computeFlatIndex(indices: number[], sizes: number[]): number {
  let index = 0;
  let multiplier = 1;
  for (let i = indices.length - 1; i >= 0; i--) {
    index += indices[i] * multiplier;
    multiplier *= sizes[i];
  }
  return index;
}

export function transformResponse(data: EurostatResponse): VehicleRecord[] {
  const { dimension, id: dimensionIds, size: dimensionSizes, value } = data;

  const geoDim = dimension['geo'];
  const timeDim = dimension['time'];
  const motNrgDim = dimension['mot_nrg'];

  if (!geoDim || !timeDim || !motNrgDim) return [];

  const geoCodes = Object.keys(geoDim.category.index);
  const timeCodes = Object.keys(timeDim.category.index);
  const motNrgCodes = Object.keys(motNrgDim.category.index);

  const records: VehicleRecord[] = [];

  for (const geo of geoCodes) {
    for (const time of timeCodes) {
      for (const motNrg of motNrgCodes) {
        const indices = dimensionIds.map((dimId) => {
          if (dimId === 'geo') return geoDim.category.index[geo];
          if (dimId === 'time') return timeDim.category.index[time];
          if (dimId === 'mot_nrg') return motNrgDim.category.index[motNrg];
          return 0;
        });

        const flatIndex = computeFlatIndex(indices, dimensionSizes);
        const count = value[String(flatIndex)] ?? null;

        if (count === null) continue;

        records.push({
          id: `${geo}-${motNrg}-${time}`,
          country: geo,
          countryName: geoDim.category.label[geo] ?? geo,
          year: time,
          motorEnergy: motNrg,
          motorEnergyName: motNrgDim.category.label[motNrg] ?? motNrg,
          count,
          source: 'eurostat',
        });
      }
    }
  }

  return records;
}
