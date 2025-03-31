import axiosInstance from '@/axios';

let latestAnalysisPromise: Promise<[]> | null = null;

export async function getTagsName() {

  if (!latestAnalysisPromise) {
    latestAnalysisPromise = axiosInstance
      .get('/search/input/distinct_tag')
      .then((response) => response.data);
  }
  const data = await latestAnalysisPromise;
  
  return { data };
}
