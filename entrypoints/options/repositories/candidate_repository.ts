export const CandidateRepository = {
  fetchCandidates: async () => {
    // const searchQuery = new URLSearchParams();
    // searchQuery.set('keyword', 'do');
    // searchQuery.set('lang', 'ja');

    // const url = new URL('https://www.pixiv.net/rpc/cps.php');
    // url.search = searchQuery.toString();
    // const response = await fetch(url.toString(), {
    //   method: 'GET',
    //   mode: 'cors',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   referrer: 'https://www.pixiv.net/',
    // });
    // console.log(await response.text());

    // if (!response.ok) {
    //   throw new Error('Failed to fetch candidates');
    // }
    // return response.json();

    const respnse = await fetch(
      'https://www.pixiv.net/rpc/cps.php?keyword=do&lang=ja',
      {
        headers: {
          accept: '*/*',
          'accept-language': 'ja,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'none',
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      }
    );

    console.log(await respnse.text());
  },
};
