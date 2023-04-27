import React, { useEffect } from 'react';
import { Box, Toolbar } from '@mui/material/';

import Grid from '@mui/material/Unstable_Grid2';
import { useAtom } from 'jotai';
import { blockTagsAtom, blockUsersAtom, worksDataAtom } from '../atoms/atoms';
import WorkCard from './work_card';

export default function WorkList() {
  const [workData] = useAtom(worksDataAtom);
  const [blockUsers] = useAtom(blockUsersAtom);
  const [blockTags] = useAtom(blockTagsAtom);

  const hideElements = () => {
    const elements = document.querySelectorAll<HTMLLIElement>('.hidden');
    elements.forEach((element) => (element.style.display = 'none'));
  };

  useEffect(() => {
    // hideElements();
    // console.log(illustData, blockUsers, blockTags);
  }, [blockUsers, blockTags, workData]);

  return (
    <Box padding={2}>
      <Toolbar />
      <Grid container spacing={2}>
        {workData.map((data, index) => {
          const userId = data.userId!;
          const tags = data.tags!;

          if (!(userId || tags)) return;

          const hasDuplicateElements = (
            arr1: string[],
            arr2: string[]
          ): boolean => arr1.some((element) => arr2.includes(element));
          return (
            <div key={index}>
              {
                <Grid
                  className={
                    hasDuplicateElements(tags, blockTags) ||
                    hasDuplicateElements([userId!], blockUsers)
                      ? 'hidden'
                      : ''
                  }
                  key={index}
                  maxWidth={'fit-content'}
                  sx={{
                    filter: data.isRead ? 'grayscale(1)' : 'grayscale(0)',
                    opacity: data['isRead'] ? 0.5 : 1,
                  }}
                >
                  <WorkCard {...data}></WorkCard>
                </Grid>
              }
            </div>
          );
        })}
      </Grid>
    </Box>
  );
}
