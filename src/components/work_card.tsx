import React, { memo } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Stack, Link, ImageListItem, ImageListItemBar } from '@mui/material';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useAtom } from 'jotai';
import {
  blockTagsAtom,
  blockUsersAtom,
  favoritesAtom,
  showWatchWorkAtom,
  watchWorksAtom,
  worksDataAtom,
} from '../atoms/atoms';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function WorkCard(workData: WorkData) {
  const [expanded, setExpanded] = React.useState(false);

  const [blockUsers, setBlockUsers] = useAtom(blockUsersAtom);
  const [blockTags, setBlockTags] = useAtom(blockTagsAtom);
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  const [showWatchWork] = useAtom(showWatchWorkAtom);
  const [works, setWorks] = useAtom(worksDataAtom);
  const [watchWorks, setWatchWorks] = useAtom(watchWorksAtom);

  const itemURL = `https://www.pixiv.net/artworks/${workData.id}`;
  const baseUserURL = 'https://www.pixiv.net/users/';
  const baseTagsURL = 'https://www.pixiv.net/tags/';

  const tags = workData.tags!;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleBlockUser = () => {
    setBlockUsers([...blockUsers, workData.userId!]);
    console.log(workData.userId);
  };

  const handleBlockTag = (tag: string) => {
    setBlockTags([...blockTags, tag]);
    console.log(tag);
  };

  const handleWorkClick = () => {
    if (!showWatchWork) return;

    const workId = workData.id;
    const updateWorks = works.map((work) =>
      work.id === workId ? { ...work, isRead: true } : work
    );
    setWorks(updateWorks);

    const newWatchWorks = watchWorks.map((watchWork) =>
      watchWork.displayName === showWatchWork.displayName
        ? {
            ...watchWork,
            worksData: updateWorks,
            readWorks: [...(watchWork.readWorks ?? []), workId],
          }
        : watchWork
    );

    setWatchWorks(newWatchWorks);
  };

  const handleFavorite = () => {
    const clickedIllustId = workData.id!;
    // favoritesにclickedIllustIdが含まれているかどうかを判定する
    const isFavorite = favorites.includes(clickedIllustId);
    // isFavoriteがtrueならclickedIllustIdを除外し、falseなら追加する
    const newFavorites = isFavorite
      ? favorites.filter((favorite) => favorite !== clickedIllustId)
      : [...favorites, clickedIllustId];
    // newFavoritesをセットする
    setFavorites(newFavorites);
    console.log(favorites);
  };

  const hasDuplicateElements = (arr1: string[], arr2: string[]): boolean =>
    arr1.some((element) => arr2.includes(element));

  const TagContainer = () => {
    return (
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Stack direction={'column'} alignItems={'flex-start'}>
            {tags.map((tag, index) => {
              //map内の要素にはkeyを付ける
              return (
                <Stack key={index} direction={'row'} alignItems={'center'}>
                  <Link
                    href={baseTagsURL + tag}
                    underline="none"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    <Typography
                      style={{ fontSize: '1rem', wordBreak: 'break-all' }}
                    >
                      {tag}
                    </Typography>
                  </Link>
                  <IconButton
                    onClick={() => {
                      handleBlockTag(tag);
                    }}
                  >
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>
        </CardContent>
      </Collapse>
    );
  };

  return (
    <Card sx={{ width: '200px' }}>
      <CardContent sx={{ padding: 0 }}>
        <Stack direction={'column'}>
          <ImageListItem>
            <Link
              href={itemURL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={handleWorkClick}
            >
              <img src={workData.url} width={'100%'}></img>
            </Link>

            <ImageListItemBar
              sx={{ background: 'rgba(0,0,0,0)' }}
              actionIcon={
                <IconButton
                  aria-label="add to favorites"
                  onClick={handleFavorite}
                >
                  <FavoriteIcon
                    sx={{
                      color: favorites.includes(workData.id!) ? 'red' : 'white',
                      stroke: 'black',
                      strokeWidth: 1,
                    }}
                  />
                </IconButton>
              }
            ></ImageListItemBar>
          </ImageListItem>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Link
              title={workData.title}
              href={itemURL}
              target="_blank"
              underline="none"
              rel="noopener noreferrer nofollow"
              noWrap
              onClick={handleWorkClick}
            >
              <Typography noWrap style={{ fontSize: '1rem' }}>
                {workData.title}
              </Typography>
            </Link>
          </Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'left'}
            spacing={0.5}
          >
            <img
              src={workData.profileImageUrl}
              style={{ width: '1.5rem' }}
            ></img>
            <Link
              href={baseUserURL + workData.userId}
              target="_blank"
              underline="none"
              rel="noopener noreferrer nofollow"
              noWrap
            >
              <Typography noWrap style={{ fontSize: '0.9rem' }}>
                {workData.userName}
              </Typography>
            </Link>

            <IconButton onClick={handleBlockUser}>
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <TagContainer />
    </Card>
  );
}

export default memo(WorkCard);
