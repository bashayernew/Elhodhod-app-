import { useQuery } from '@tanstack/react-query';
import { api } from '@hodhod/data';

export type FeatureFlags = {
  newCheckout: boolean;
  newChat: boolean;
  [key: string]: boolean;
};

export type PlatformOverrides = {
  web?: Partial<FeatureFlags>;
  mobile?: Partial<FeatureFlags>;
};

export type ConfigResponse = {
  flags: FeatureFlags;
  overrides?: PlatformOverrides;
};

function applyOverrides(base: FeatureFlags, platform?: keyof PlatformOverrides, overrides?: PlatformOverrides): FeatureFlags {
  if (!platform || !overrides || !overrides[platform]) return base;
  return { ...base, ...(overrides[platform] as Partial<FeatureFlags>) };
}

export function useConfig(platform: 'web' | 'mobile') {
  return useQuery({
    queryKey: ['config', platform],
    queryFn: async () => {
      const res = await api.get<ConfigResponse>('/v1/config');
      return applyOverrides(res.data.flags, platform, res.data.overrides);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeature(platform: 'web' | 'mobile', name: keyof FeatureFlags) {
  const { data: flags } = useConfig(platform);
  return !!flags?.[name];
}


