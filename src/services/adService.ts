import { IAdModel } from '../db/';
import { IAd } from '../interfaces/';
import { getAll, save } from '../repositories/adRepository';

export const getAllAds = async () => {
  return await getAll();
};

export const updateAds = async (ads: IAd[]) => {
  await saveAds(ads);
};

const updateAdsFields = async (knownAd: IAd, ads: IAd[]) => {
  let selectedAd;
  for (const ad of ads) {
    if (knownAd.sourceUrl === ad.sourceUrl) {
      selectedAd = ad;
    }
  }
  return Object.assign(knownAd, selectedAd);
};

const saveAds = async (ads: IAd[]) => {
  for (const ad of ads) {
    await save(ad);
  }
};

const addNewAds = (knownAds: IAd[], ads: IAd[]) => {
  let isExist;
  const newAds = [];
  for (const ad of ads) {
    isExist = false;
    for (const knownAd of knownAds) {
      if (knownAd.sourceUrl === ad.sourceUrl) {
        isExist = true;
      }
    }
    if (!isExist) {
      newAds.push(ad);
    }
  }
  return newAds;
};
