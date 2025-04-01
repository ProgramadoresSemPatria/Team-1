import axiosInstance from '@/axios';

export async function getAnalysis({ values }: { values: string[] }) {
  try {
    const response = await axiosInstance.post(
      '/search/input/filter',
      {
        tag: values,
      },
      {
        params: {
          items_per_page: 100000,
        }
      }
    );

    return {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      data: response.data.map((item: any) => ({
        Text: item.text,
        Sentiment_Prediction: item.sentiment,
      })),
    };
  } catch (error) {
    console.error('Error in getAnalysis:', error);
    throw error;
  }
}
